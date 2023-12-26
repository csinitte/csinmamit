import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {
 
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { db } from '@/db'
// import { z } from 'zod'
// import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'
// import { absoluteUrl } from '@/lib/utils'
// import {
//   getUserSubscriptionPlan,
//   stripe,
// } from '@/lib/stripe'
// import { PLANS } from '@/config/stripe'

import { z } from "zod";


export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user.id || !user.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    // check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        custid: user.id,
      },
    })

    if (!dbUser) {
      // create user in db
      await db.user.create({
        data: {
          custid: user.id,
          email: user.email,
          role: 'user'
        },
      })
    }

    return { success: true }
  }),
  addTeam: publicProcedure.input(
    z.object({
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
    })
  ).mutation(async ({ ctx, input }) => {
    const { name, branch, role, linkedin, github, imageLink } = input;

    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user.id || !user.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    // check if the user is in the database
    const dbUser = await db.team.findFirst({
      where: {
        custid: user.id,
      },
    })

    if (!dbUser) {
      // create user in db
      await db.team.create({
        data: {
          custid: user.id,
          email: user.email,
          name: name,
          branch: branch,
          role: role,
          linkedin: linkedin,
          github: github,
          imageLink: imageLink,
        },
      })
    }

    return { success: true };
  }),

 
})


export type AppRouter = typeof appRouter