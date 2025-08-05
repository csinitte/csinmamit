import { z } from "zod";
import { getAdminFirestore, isFirebaseAdminConfigured } from "~/server/firebase-admin";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

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
            
            // Check if Firebase Admin is configured
            if (!isFirebaseAdminConfigured()) {
                console.warn('Firebase Admin not properly configured. User data fetch skipped.');
                return null;
            }
            
            const db = getAdminFirestore();
            const userDoc = await db.collection('users').doc(input.userid).get();
            
            if (userDoc.exists) {
                const data = userDoc.data();
                // Only return the fields we need to avoid large payloads
                return {
                    id: userDoc.id,
                    name: (data?.name as string) ?? "",
                    bio: (data?.bio as string) ?? "",
                    branch: (data?.branch as string) ?? "",
                    github: (data?.github as string) ?? "",
                    linkedin: (data?.linkedin as string) ?? "",
                    phone: (data?.phone as string) ?? "",
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
            
            // Check if Firebase Admin is configured
            if (!isFirebaseAdminConfigured()) {
                throw new Error('Firebase Admin not properly configured');
            }
            
            const db = getAdminFirestore();
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
