import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { sendWelcomeEmail } from "~/utils/email";

export const recruitRouter = createTRPCRouter({
  submitRecruitForm: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      dateOfBirth: z.string(),
      usn: z.string().min(1),
      yearOfStudy: z.string().min(1),
      branch: z.string().min(1),
      mobileNumber: z.string().min(10),
      personalEmail: z.string().email(),
      collegeEmail: z.string().optional(),
      membershipPlan: z.string().min(1),
      csiIdea: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      try {
        // Parse DD/MM/YYYY format to Date object
        const dateParts = input.dateOfBirth.split('/');
        if (dateParts.length !== 3) {
          throw new Error("Invalid date format. Expected DD/MM/YYYY");
        }
        
        const day = Number(dateParts[0]);
        const month = Number(dateParts[1]);
        const year = Number(dateParts[2]);
        
        // Validate that all parts are valid numbers
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
          throw new Error("Invalid date values");
        }
        
        const dateOfBirth = new Date(year, month - 1, day);

        const recruit = await db.recruit.create({
          data: {
            name: input.name,
            dateOfBirth: dateOfBirth,
            usn: input.usn,
            yearOfStudy: input.yearOfStudy,
            branch: input.branch,
            mobileNumber: input.mobileNumber,
            personalEmail: input.personalEmail,
            collegeEmail: input.collegeEmail,
            membershipPlan: input.membershipPlan,
            csiIdea: input.csiIdea,
          },
        });

        // Send welcome email
        try {
          await sendWelcomeEmail(
            input.name,
            input.personalEmail,
            input.membershipPlan,
            input.usn
          );
        } catch (emailError) {
          console.error("Error sending welcome email:", emailError);
          // Don't fail the entire request if email fails
        }
        
        return { success: true, recruit };
      } catch (error) {
        console.error("Error creating recruit:", error);
        throw new Error("Failed to submit recruit form");
      }
    }),

  getAllRecruits: publicProcedure.query(async () => {
    try {
      const recruits = await db.recruit.findMany({
        orderBy: { createdAt: "desc" },
      });
      return recruits;
    } catch (error) {
      console.error("Error fetching recruits:", error);
      throw new Error("Failed to fetch recruits");
    }
  }),
}); 