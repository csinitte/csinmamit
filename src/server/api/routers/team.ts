import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

// teamRouter is correct as is
export const teamRouter = createTRPCRouter({
  getTeam: publicProcedure.query(async () => {
    const db = getFirestore();
    const querySnapshot = await db.collection('teams').get();
    const teams = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { dbF: teams };
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
    imageLink: z.string().optional(),
  }))
  .mutation(async ({input})=> {
      try {
        const { userid, email, name, branch, role, linkedin, github, imageLink } = input;
        const db = getFirestore();
        
        // Check if user already exists in teams collection
        const userQuery = await db.collection('teams').where('custid', '==', userid).limit(1).get();
        
        if (userQuery.empty) {
          // Create new team member
          await db.collection('teams').add({
            custid: userid,
            email: email,
            name: name,
            branch: branch,
            role: role,
            linkedin: linkedin,
            github: github,
            imageLink: imageLink ?? "",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        return { success: true };
      } catch (error) {
        console.error('Error in addTeam:', error);
        throw new Error('Failed to add team member');
      }
  })
});


