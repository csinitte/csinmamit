import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { sendWelcomeEmail } from "~/utils/email";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export const recruitRouter = createTRPCRouter({
  submitRecruitForm: protectedProcedure
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
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("Session user:", ctx.session.user);
        console.log("Input data:", input);
        
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
        
        // Validate date ranges
        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
          throw new Error("Invalid date values");
        }
        
        const dateOfBirth = new Date(year, month - 1, day);
        
        // Validate the date is valid
        if (isNaN(dateOfBirth.getTime())) {
          throw new Error("Invalid date");
        }

        const db = getFirestore();
        console.log("Firestore instance:", db);
        console.log("Creating recruit with data:", {
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
          userId: (ctx.session.user as { id: string }).id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        let recruitRef;
        try {
          recruitRef = await db.collection('recruits').add({
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
            userId: (ctx.session.user as { id: string }).id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          
          console.log("Recruit created successfully with ID:", recruitRef.id);
        } catch (dbError) {
          console.error("Database error:", dbError);
          throw new Error(`Database error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
        }

        const recruit = {
          id: recruitRef.id,
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
          userId: (ctx.session.user as { id: string }).id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

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
        // Provide more specific error message
        if (error instanceof Error) {
          throw new Error(`Failed to submit recruit form: ${error.message}`);
        } else {
          throw new Error("Failed to submit recruit form");
        }
      }
    }),

  getAllRecruits: protectedProcedure.query(async () => {
    try {
      const db = getFirestore();
      const recruitsSnapshot = await db.collection('recruits')
        .orderBy('createdAt', 'desc')
        .get();
      
      const recruits = recruitsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return recruits;
    } catch (error) {
      console.error("Error fetching recruits:", error);
      throw new Error("Failed to fetch recruits");
    }
  }),

  updateUserMembership: protectedProcedure
    .input(z.object({
      userId: z.string(),
      recruitData: z.object({
        membershipPlan: z.string(),
        name: z.string(),
        personalEmail: z.string(),
        csiIdea: z.string(),
        dateOfBirth: z.union([z.date(), z.string()]), // Allow both Date and string
        usn: z.string(),
        yearOfStudy: z.string(),
        branch: z.string(),
        mobileNumber: z.string(),
        collegeEmail: z.string().optional(),
      }),
      paymentDetails: z.object({
        razorpayOrderId: z.string(),
        razorpayPaymentId: z.string(),
        amount: z.number(),
        currency: z.string(),
      }),
    }))
    .mutation(async ({ input }) => {
      try {
        console.log("Updating user membership for:", input.userId);
        console.log("Payment details:", input.paymentDetails);
        console.log("Recruit data:", input.recruitData);

        const db = getFirestore();
        
        // Calculate membership dates
        const membershipStartDate = new Date();
        const membershipEndDate = new Date();
        
        // Calculate end date based on membership plan
        if (input.recruitData.membershipPlan.includes('1-Year')) {
          membershipEndDate.setFullYear(membershipEndDate.getFullYear() + 1);
        } else if (input.recruitData.membershipPlan.includes('6-Month')) {
          membershipEndDate.setMonth(membershipEndDate.getMonth() + 6);
        } else if (input.recruitData.membershipPlan.includes('3-Month')) {
          membershipEndDate.setMonth(membershipEndDate.getMonth() + 3);
        } else {
          // Default to 1 year
          membershipEndDate.setFullYear(membershipEndDate.getFullYear() + 1);
        }

        const membershipData = {
          membershipType: input.recruitData.membershipPlan,
          membershipStartDate: membershipStartDate,
          membershipEndDate: membershipEndDate,
          paymentDetails: {
            ...input.paymentDetails,
            paymentDate: new Date(),
          },
          role: "EXECUTIVE MEMBER",
          updatedAt: new Date(),
        };

        // Check if user document exists, if not create it
        const userDoc = await db.collection('users').doc(input.userId).get();
        
        if (userDoc.exists) {
          // Update existing user document with membership data
          await db.collection('users').doc(input.userId).update(membershipData);
        } else {
          // Create new user document with membership data
          await db.collection('users').doc(input.userId).set({
            ...membershipData,
            name: input.recruitData.name,
            email: input.recruitData.personalEmail,
            createdAt: new Date(),
          });
        }

        console.log(`Membership updated successfully for user ${input.userId}`);
        return { success: true, membershipData };
      } catch (error) {
        console.error("Error updating user membership:", error);
        throw new Error(`Failed to update user membership: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
}); 