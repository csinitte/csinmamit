import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

// teamRouter is correct as is
export const teamRouter = createTRPCRouter({
  getTeam: publicProcedure.query(async () => {
    const dbF = await db.team.findMany();
    return { dbF };
  }),
  addTeam: publicProcedure
  .input(z.object({
    userid : z.string(),
    email : z.string(),
    name: z.string(),
    branch: z.string(),
    role: z.string(),
    linkedin: z.string().url({
      message: 'Please enter a valid LinkedIn profile URL.',
    }),
    github: z.string().url({
      message: 'Please enter a valid GitHub profile URL.',
    }),
    imageLink: z.string().url({
      message: 'Please enter a valid image URL.',
    }),
  }))
  .mutation(async ({input})=> {
      const { userid, email, name, branch, role, linkedin, github, imageLink } = input;
      const dbUser = await db.team.findFirst({
        where: {
          custid: userid,
        },
      });
      
      if (!dbUser) {
        // create user in db
        await db.team.create({
          data: {
            custid: userid,
            email: email,
            name: name,
            branch: branch,
            role: role,
            linkedin: linkedin,
            github: github,
            imageLink: imageLink,
          },
        });
      }
  })
});


