import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export const userRouter = createTRPCRouter({
    ping: publicProcedure
    .query(async () => {
        return { message: 'pong', timestamp: new Date().toISOString() };
    }),
    
    test: publicProcedure
    .query(async () => {
        return { message: 'Server is working', timestamp: new Date().toISOString() };
    }),
    
    testMutation: publicProcedure
    .mutation(async () => {
        return { message: 'Mutation is working', timestamp: new Date().toISOString() };
    }),
    
    simpleGetUserData: publicProcedure
    .input(z.object({ userid: z.string() }))
    .query(async ({ input }) => {
        return { 
            message: 'Simple getUserData working',
            userid: input.userid,
            timestamp: new Date().toISOString()
        };
    }),
    
    getUserData: publicProcedure
    .input(z.object({ userid: z.string() }))
    .query(async ({ input }) => {
        try {
            if (!input?.userid || input.userid.trim() === "") {
                return null;
            }
            
            const db = getFirestore();
            const userDoc = await db.collection('users').doc(input.userid).get();
            
            if (userDoc.exists) {
                const data = userDoc.data();
                // Only return the fields we need to avoid large payloads
                return {
                    id: userDoc.id,
                    name: data?.name || "",
                    bio: data?.bio || "",
                    branch: data?.branch || "",
                    github: data?.github || "",
                    linkedin: data?.linkedin || "",
                    phone: data?.phone || "",
                };
            }
            return null;
        } catch (error) {
            console.error('Error in getUserData:', error);
            throw new Error('Failed to fetch user data');
        }
    }),

    editUserData: publicProcedure
    .input(z.object({
        userid: z.string(),
        name: z.string().min(1, "Name is required"),
        bio: z.string().optional().default(""),
        phone: z.string().optional().default(""),
        branch: z.string().optional().default(""),
        github: z.string().optional().default(""),
        linkedin: z.string().optional().default(""),
    }))
    .mutation(async ({ input }) => {
        try {
            if (!input?.userid) {
                throw new Error('User ID is required');
            }
            
            const db = getFirestore();
            await db.collection('users').doc(input.userid).set({
                name: input.name,
                bio: input.bio,
                phone: input.phone,
                branch: input.branch,
                github: input.github,
                linkedin: input.linkedin,
                updatedAt: new Date(),
            }, { merge: true });
            
            return { 
                success: true, 
                message: 'Profile updated successfully'
            };
        } catch (error) {
            console.error('Error updating user data:', error);
            throw new Error('Failed to update profile');
        }
    })
});
