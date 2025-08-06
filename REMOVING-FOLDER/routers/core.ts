// import {
//   createTRPCRouter,
//   publicProcedure,
// } from "~/server/api/trpc";
// import { coreService } from "../../../lib/firestore";

// export const coreRouter = createTRPCRouter({
//     getCoreMembers: publicProcedure.query(async() => {
//         const data = await coreService.getAll();
//         return data;
//     })
// // })