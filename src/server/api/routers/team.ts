import { z } from "zod";
import { getAdminFirestore, isFirebaseAdminConfigured } from "~/server/firebase-admin";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  getTeam: publicProcedure.query(async () => {
    try {
      // Check if Firebase Admin is configured
      if (!isFirebaseAdminConfigured()) {
        console.warn('Firebase Admin not properly configured. Team data fetch skipped.');
        return { dbF: [] };
      }
      
      const db = getAdminFirestore();
      const querySnapshot = await db.collection('teams').get();
      const teams = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { dbF: teams };
    } catch (error) {
      console.error('Error fetching teams:', error);
      return { dbF: [] };
    }
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
        // Check if Firebase Admin is configured
        if (!isFirebaseAdminConfigured()) {
          throw new Error('Firebase Admin not properly configured');
        }
        
        const { userid, email, name, branch, role, linkedin, github, imageLink } = input;
        const db = getAdminFirestore();
        
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


