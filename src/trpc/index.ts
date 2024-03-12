import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {
 
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { db } from '@/db'


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

  addCertificate: publicProcedure.input(
    z.object({
      userId: z.string(),
      certificateName: z.string(),
      certificateLink: z.string(),
    })
  ).mutation(async ({ ctx, input }) => {
    const { userId, certificateName, certificateLink } = input;
  
    const { getUser } = getKindeServerSession();
    const user = getUser();
  
    if (!user.id || !user.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
  
    // Check if the user is authorized to add a certificate to the specified user
    if (user.id !== userId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'User is not authorized to add a certificate for this user' });
    }
  
    // Check if the user exists in the database
    const dbUser = await db.members.findFirst({
      where: {
        custid: userId,
      },
    });
  
    if (!dbUser) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
  
    // Add the certificate to the user's record in the database
    await db.certificate.create({
      data: {
        name: certificateName,
        link: certificateLink,
        memberId: dbUser.id,
      },
    });
  
    return { success: true };
  }),  


  addMember: publicProcedure.input(
    z.object({
      name: z.string(),
      bio: z.string(),
      phonenumber: z.string(),
      branch: z.string(),
      github: z.string(),
      usn: z.string(),
      linkedin: z.string(),
    })
  ).mutation(async ({ ctx, input }) => {
    const { name, branch, bio, phonenumber, linkedin, github, usn } = input;
  
    const { getUser } = getKindeServerSession()
    const user = getUser()
  
    let username = user.given_name?.toLowerCase().replace(" ", "_")
  
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
          name: name,
          usn: usn,
          username: username || user.id,
          email: user.email,
          bio: bio,
          pfp: user.picture || "https://github.com/dhanushlnaik.png",
          branch: branch,
          github: github,
          linkedin: linkedin,
          phonenumber: phonenumber,
        },
      })
    } else {
      // update existing user in db
      await db.members.update({
        where: {
          custid: user.id,
        },
        data: {
          name: name,
          username: username || user.id,
          email: user.email,
          bio: bio,
          usn: usn,
          pfp: user.picture || "https://github.com/dhanushlnaik.png",
          branch: branch,
          github: github,
          linkedin: linkedin,
          phonenumber: phonenumber,
        },
      })
    }
  
    return { success: true };
  }),

  getProfile: publicProcedure
  .input(
    z.object({
      username: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      const memberData = await db.members.findUnique({
        where: {
          username: input.username,
        },
      });

      if (!memberData) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Member not found' });
      }
    
      return memberData;
    } catch (error) {
      console.log("error", error);
    }
  }),

  getEvent: publicProcedure.query(async () => {
    const dbE = await db.event.findMany();
    return { dbE };
  }),



 
})


export type AppRouter = typeof appRouter