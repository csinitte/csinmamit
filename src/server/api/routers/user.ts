import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const userRouter = createTRPCRouter({
    getUserData: publicProcedure
    .input(z.object( { userid : z.string() }))
    .query(({ input }) => {
        return db.user.findFirst({where : {id : input.userid}})
    }),

    editUserData: publicProcedure
    .input(z.object({
        userid : z.string(),
        name : z.string(),
        bio:  z.string(),
        phone : z.string(),
        branch: z.string(),
        github: z.string(),
        linkedin: z.string(),
    }))
    .mutation(({input})=> {
        return db.user.update({where : {id : input.userid},
        data : {
            name: input.name,
            bio:  input.bio,
            phone : input.phone,
            branch: input.branch,
            github: input.github,
            linkedin: input.linkedin,
        }})
    })
});
