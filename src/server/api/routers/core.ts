import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const coreRouter = createTRPCRouter({
    getCoreMembers: publicProcedure.query(async() => {
        const data = await db.core.findMany();
        
        return data
    })
})