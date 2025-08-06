// import {
//   createTRPCRouter,
//   publicProcedure,
//   protectedProcedure,
// } from "~/server/api/trpc";
// import { teamMemberService } from "~/lib/firestore";
// import { z } from "zod";

// const teamMemberSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email().optional(),
//   branch: z.string().min(1, "Branch is required"),
//   position: z.string().min(1, "Position is required"),
//   linkedin: z.string().url().optional().or(z.literal("")),
//   github: z.string().optional().or(z.literal("")),
//   imageSrc: z.string().url("Valid image URL is required"),
//   year: z.number().min(1, "Year is required"),
//   order: z.number().min(0, "Order must be non-negative"),
//   phone: z.string().optional(),
//   bio: z.string().optional(),
//   role: z.string().optional(),
// });

// export const teamMembersRouter = createTRPCRouter({
//   getAll: publicProcedure.query(async () => {
//     const data = await teamMemberService.getAll();
    
//     // Serialize the data to handle Firestore Timestamps
//     const serializedData = data.map(member => ({
//       ...member,
//       createdAt: member.createdAt ? 
//         (typeof member.createdAt === 'object' && 'seconds' in member.createdAt ? 
//           new Date((member.createdAt as { seconds: number }).seconds * 1000).toISOString() : 
//           member.createdAt instanceof Date ? member.createdAt.toISOString() : null) : null,
//       updatedAt: member.updatedAt ? 
//         (typeof member.updatedAt === 'object' && 'seconds' in member.updatedAt ? 
//           new Date((member.updatedAt as { seconds: number }).seconds * 1000).toISOString() : 
//           member.updatedAt instanceof Date ? member.updatedAt.toISOString() : null) : null,
//     }));
    
//     return serializedData;
//   }),

//   getById: publicProcedure
//     .input(z.object({ id: z.string() }))
//     .query(async ({ input }) => {
//       const data = await teamMemberService.getById(input.id);
//       return data;
//     }),

//   create: protectedProcedure
//     .input(teamMemberSchema)
//     .mutation(async ({ input }) => {
//       const data = await teamMemberService.create(input);
//       return data;
//     }),

//   update: protectedProcedure
//     .input(z.object({
//       id: z.string(),
//       data: teamMemberSchema.partial()
//     }))
//     .mutation(async ({ input }) => {
//       await teamMemberService.update(input.id, input.data);
//       return { success: true };
//     }),

//   delete: protectedProcedure
//     .input(z.object({ id: z.string() }))
//     .mutation(async ({ input }) => {
//       await teamMemberService.delete(input.id);
//       return { success: true };
//     }),

//   getByYear: publicProcedure
//     .input(z.object({ year: z.number() }))
//     .query(async ({ input }) => {
//       const data = await teamMemberService.findMany('year', input.year);
//       return data.sort((a, b) => a.order - b.order);
//     }),

//   getByPosition: publicProcedure
//     .input(z.object({ position: z.string() }))
//     .query(async ({ input }) => {
//       const data = await teamMemberService.findMany('position', input.position);
//       return data.sort((a, b) => a.order - b.order);
//     }),
// }); 