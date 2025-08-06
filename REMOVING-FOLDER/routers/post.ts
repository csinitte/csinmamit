// import { z } from "zod";

// import {
//   createTRPCRouter,
//   protectedProcedure,
//   publicProcedure,
// } from "~/server/api/trpc";
// import { teamService } from "~/lib/firestore";

// export const postRouter = createTRPCRouter({
//   hello: publicProcedure
//     .input(z.object({ text: z.string() }))
//     .query(({ input }) => {
//       return {
//         greeting: `Hello ${input.text}`,
//       };
//     }),

//   getTeam: protectedProcedure.query(async () => {
//     return await teamService.getAll();
//   }),
// });
