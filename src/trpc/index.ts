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

  getTeam: publicProcedure.query(async () => {
    const dbF = await db.team.findMany();
    return { dbF };
  }),

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
  addEvent: publicProcedure.input(
    z.object({
      eventname: z.string(),
      category   : z.string(),
      date: z.date(),
      registered: z.number(),
      organizers: z.string(),
      description: z.string(),
      imageLink  : z.string()
    })
  ).mutation(async ( { ctx, input }) => {
    const { eventname, category, date, registered, organizers, description, imageLink } = input;

    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user.id || !user.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    // check if the user is in the database
    await db.event.create({
      data: {
        eventname: eventname,
        category: category,
        date: date,
        registered: registered,
        organizers : organizers,
        description: description, 
        imageLink: imageLink
      }
    })
    

    return { success: true };
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


  addMember: publicProcedure.input(
    z.object({
      name : z.string(),
      username: z.string(),
      bio:  z.string(),
      pfp:  z.string(),
      phonenumber: z.string(),
      branch: z.string(),
      github: z.string(),
      linkedin: z.string(),
  })
  ).mutation(async ({ ctx, input }) => {
    const { name, branch, username, bio, pfp, phonenumber, linkedin, github } = input;


    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user.id || !user.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    // check if the user is in the database
    const dbUser = await db.members.findFirst({
      where: {
        custid: user.id,
      },
    })

    if (!dbUser) {
      // create user in db
      await db.members.create({
        data: {
          custid: user.id,
          name : name,
          username: username,
          email: user.email,
          bio:  bio,
          pfp:  pfp,
          branch: branch,
          github: github,
          linkedin: linkedin,
          phonenumber: phonenumber,  
        },
      })
    }

    return { success: true };
  }),

 
})


export type AppRouter = typeof appRouter