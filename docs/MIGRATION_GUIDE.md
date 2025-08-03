# Migration Guide: Prisma+PostgreSQL to Firestore

## Table of Contents
1. [Overview](#overview)
2. [Why We Migrated](#why-we-migrated)
3. [Architecture Changes](#architecture-changes)
4. [Database Schema Migration](#database-schema-migration)
5. [Authentication Migration](#authentication-migration)
6. [API Layer Changes](#api-layer-changes)
7. [Frontend Changes](#frontend-changes)
8. [Firestore Rules Guide](#firestore-rules-guide)
9. [Admin Panel Setup](#admin-panel-setup)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

## Overview

This document outlines the complete migration from a Prisma+PostgreSQL backend to Firebase Firestore, including authentication, data management, and admin panel setup.

### Before Migration
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom auth system
- **API**: tRPC with Next.js API routes
- **Data Flow**: Client → tRPC → Prisma → PostgreSQL

### After Migration
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **API**: Direct Firestore client SDK
- **Data Flow**: Client → Firebase SDK → Firestore

## Why We Migrated

### Benefits
1. **Simplified Architecture**: No need for separate API layer
2. **Real-time Updates**: Built-in real-time listeners
3. **Scalability**: Automatic scaling with Firebase
4. **Security**: Row-level security with Firestore Rules
5. **Cost Efficiency**: Pay-per-use model
6. **Development Speed**: Faster development with less boilerplate

### Trade-offs
1. **Query Limitations**: Less flexible than SQL
2. **Data Relationships**: Manual handling of relationships
3. **Migration Complexity**: One-time migration effort

## Architecture Changes

### Old Architecture
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│    tRPC     │───▶│   Prisma    │───▶│ PostgreSQL  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### New Architecture
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│Firebase SDK │───▶│  Firestore  │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Database Schema Migration

### User Schema Comparison

#### Old (Prisma Schema)
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  bio       String?
  branch    String?
  github    String?
  linkedin  String?
  phone     String?
  role      String   @default("Member")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### New (Firestore Document)
```typescript
interface User {
  id: string;           // Firebase Auth UID
  name: string;
  bio: string;
  branch: string;
  github: string;       // Only username, not full URL
  linkedin: string;     // Full LinkedIn URL
  phone: string;
  role: string;         // Default: "User"
  certificates: string[]; // Array of certificate URLs
  updatedAt: Date;
}
```

### Key Changes
1. **ID System**: Using Firebase Auth UID instead of CUID
2. **Timestamps**: Only `updatedAt` (Firestore auto-manages creation)
3. **Arrays**: Using Firestore arrays for certificates
4. **No Relations**: Manual handling of relationships

## Authentication Migration

### Old Authentication
```typescript
// Custom auth with sessions
const session = await getSession(req);
if (!session) {
  return res.status(401).json({ error: "Unauthorized" });
}
```

### New Authentication
```typescript
// Firebase Auth
import { useAuth } from "~/lib/firebase-auth";

const { user, loading } = useAuth();
if (!user) {
  // Handle unauthenticated state
}
```

### Firebase Auth Setup
```typescript
// src/lib/firebase-auth.ts
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

## API Layer Changes

### Old tRPC Approach
```typescript
// Server-side
export const userRouter = router({
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string(),
      bio: z.string(),
      // ...
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input
      });
    })
});

// Client-side
const updateProfile = api.user.updateProfile.useMutation();
await updateProfile.mutateAsync(profileData);
```

### New Direct Firestore Approach
```typescript
// Client-side only
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "~/lib/firebase-auth";

const db = getFirestore(app);
await setDoc(doc(db, 'users', user.id), {
  name: profileData.name,
  bio: profileData.bio,
  // ...
}, { merge: true });
```

## Frontend Changes

### Component Updates
1. **Removed tRPC imports** and replaced with Firebase SDK
2. **Updated data fetching** to use Firestore
3. **Added loading states** for Firebase operations
4. **Implemented error handling** for Firestore operations

### Example: Profile Component
```typescript
// Before (tRPC)
const { data: userData } = api.user.getProfile.useQuery();

// After (Firestore)
const [userData, setUserData] = useState(null);
useEffect(() => {
  const loadUserData = async () => {
    const userDoc = await getDoc(doc(db, 'users', user.id));
    if (userDoc.exists()) {
      setUserData(userDoc.data());
    }
  };
  loadUserData();
}, [user.id]);
```

## Firestore Rules Guide

### What are Firestore Rules?

Firestore Rules are security rules that control access to your Firestore database. They act as a security layer between your client applications and your data.

### Basic Rule Structure
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Rules go here
  }
}
```

### Rule Components

#### 1. Match Statements
```javascript
// Match specific collection
match /users/{userId} {
  // Rules for users collection
}

// Match nested collections
match /users/{userId}/posts/{postId} {
  // Rules for posts subcollection
}

// Match all documents recursively
match /{document=**} {
  // Rules for all documents
}
```

#### 2. Allow Statements
```javascript
// Allow read and write
allow read, write: if condition;

// Allow specific operations
allow read: if condition;
allow write: if condition;
allow create: if condition;
allow update: if condition;
allow delete: if condition;
```

#### 3. Conditions
```javascript
// Authentication check
allow read: if request.auth != null;

// User-specific access
allow read, write: if request.auth.uid == userId;

// Admin access
allow write: if request.auth.token.admin == true;

// Complex conditions
allow update: if request.auth != null && 
  request.auth.uid == userId && 
  request.resource.data.keys().hasOnly(['name', 'bio', 'updatedAt']);
```

### Our Current Rules Explained

```javascript
// Allow authenticated users to read/write their own user data
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  
  // Allow users to update their certificates array
  allow update: if request.auth != null && request.auth.uid == userId && 
    (resource.data.diff(resource.data).affectedKeys().hasOnly(['certificates', 'updatedAt']) || 
     resource.data.diff(resource.data).affectedKeys().hasOnly(['name', 'bio', 'branch', 'github', 'linkedin', 'phone', 'role', 'updatedAt']));
}
```

**Explanation:**
- Users can read/write their own documents
- Users can update specific fields only (prevents unauthorized field changes)
- Certificate updates are allowed separately from profile updates

### Admin Rules
```javascript
// Allow public read access to core team members, only admins can write
match /core/{document=**} {
  allow read: if true;  // Anyone can read
  allow write: if request.auth != null && request.auth.token.admin == true;  // Only admins can write
}
```

### Best Practices for Rules

1. **Principle of Least Privilege**: Only grant necessary permissions
2. **Validate Data**: Check data structure and content
3. **Use Functions**: Create reusable rule functions
4. **Test Rules**: Use Firebase Emulator for testing
5. **Monitor Usage**: Check Firebase Console for rule violations

## Admin Panel Setup

### 1. Admin Authentication

Create admin authentication using Firebase Custom Claims:

```typescript
// Server-side function to set admin claim
import { getAuth } from "firebase-admin/auth";

export const setAdminClaim = async (uid: string, isAdmin: boolean) => {
  const auth = getAuth();
  await auth.setCustomUserClaims(uid, { admin: isAdmin });
};
```

### 2. Admin Route Protection

```typescript
// src/components/auth/AdminRoute.tsx
import { useAuth } from "~/lib/firebase-auth";
import { useEffect, useState } from "react";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const token = await user.getIdTokenResult();
        setIsAdmin(token.claims?.admin === true);
      }
      setLoading(false);
    };
    checkAdminStatus();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access Denied</div>;
  
  return <>{children}</>;
};
```

### 3. Admin Dashboard Structure

```typescript
// src/pages/admin/index.tsx
import { AdminRoute } from "~/components/auth/AdminRoute";
import { UserManagement } from "~/components/admin/UserManagement";
import { CertificateManagement } from "~/components/admin/CertificateManagement";

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <UserManagement />
        <CertificateManagement />
      </div>
    </AdminRoute>
  );
}
```

### 4. Certificate Management Component

```typescript
// src/components/admin/CertificateManagement.tsx
import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { addCertificateToUser, setUserCertificates } from "~/lib/certificate-utils";

export const CertificateManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");

  const loadUsers = async () => {
    const db = getFirestore();
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const usersData = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(usersData);
  };

  const addCertificate = async () => {
    if (selectedUser && certificateUrl) {
      await addCertificateToUser(selectedUser, certificateUrl);
      setCertificateUrl("");
      alert("Certificate added successfully!");
    }
  };

  return (
    <div className="certificate-management">
      <h2>Certificate Management</h2>
      
      <div className="form-group">
        <label>Select User:</label>
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Choose a user...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Certificate URL:</label>
        <input
          type="url"
          value={certificateUrl}
          onChange={(e) => setCertificateUrl(e.target.value)}
          placeholder="https://example.com/certificate.jpg"
        />
      </div>

      <button onClick={addCertificate}>Add Certificate</button>
    </div>
  );
};
```

### 5. User Management Component

```typescript
// src/components/admin/UserManagement.tsx
import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const db = getFirestore();
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const usersData = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(usersData);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const db = getFirestore();
    await updateDoc(doc(db, 'users', userId), {
      role: newRole,
      updatedAt: new Date()
    });
    await loadUsers(); // Refresh the list
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role || "User"}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </td>
              <td>
                <button onClick={() => loadUsers()}>Refresh</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## Best Practices

### 1. Data Structure
- **Denormalize when needed**: Store frequently accessed data together
- **Use arrays for small lists**: Like certificates, tags, etc.
- **Keep documents small**: Split large documents into subcollections
- **Use consistent naming**: Follow a consistent naming convention

### 2. Security
- **Always validate on server**: Don't trust client-side validation
- **Use Firestore Rules**: Implement proper access control
- **Limit field updates**: Only allow updates to specific fields
- **Monitor access patterns**: Check Firebase Console regularly

### 3. Performance
- **Index your queries**: Create composite indexes for complex queries
- **Limit query results**: Use pagination for large datasets
- **Cache frequently accessed data**: Use React Query or SWR
- **Optimize reads**: Structure data to minimize read operations

### 4. Error Handling
```typescript
try {
  await setDoc(doc(db, 'users', userId), userData);
  toast.success("Profile updated successfully!");
} catch (error) {
  console.error('Error updating profile:', error);
  toast.error("Failed to update profile. Please try again.");
}
```

## Troubleshooting

### Common Issues

#### 1. Permission Denied Errors
**Problem**: `FirebaseError: Missing or insufficient permissions`
**Solution**: Check Firestore Rules and ensure proper authentication

#### 2. Image Loading Errors
**Problem**: `Invalid src prop on next/image`
**Solution**: Add domain to `next.config.js` images configuration

#### 3. Real-time Updates Not Working
**Problem**: Data not updating in real-time
**Solution**: Use `onSnapshot` instead of `getDoc` for real-time listeners

#### 4. Large Document Errors
**Problem**: Document too large for Firestore
**Solution**: Split into subcollections or reduce document size

### Debugging Tools

1. **Firebase Console**: Monitor database usage and errors
2. **Firebase Emulator**: Test locally before deploying
3. **Browser DevTools**: Check network requests and console errors
4. **Firestore Rules Playground**: Test rules before deployment

### Performance Monitoring

```typescript
// Enable performance monitoring
import { getPerformance } from "firebase/performance";

const perf = getPerformance(app);
```

## Migration Checklist

- [ ] Set up Firebase project
- [ ] Configure Firestore database
- [ ] Set up Firebase Authentication
- [ ] Create Firestore Rules
- [ ] Migrate data schema
- [ ] Update frontend components
- [ ] Remove tRPC dependencies
- [ ] Test all functionality
- [ ] Deploy and monitor
- [ ] Update documentation

## Conclusion

The migration to Firestore provides a more scalable and maintainable architecture. The key benefits include:

1. **Simplified backend**: No need for separate API layer
2. **Better security**: Row-level security with Firestore Rules
3. **Real-time capabilities**: Built-in real-time updates
4. **Cost efficiency**: Pay-per-use model
5. **Faster development**: Less boilerplate code

Remember to follow the best practices outlined in this guide and regularly monitor your application's performance and security.

---

**For questions or issues, refer to:**
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization) 