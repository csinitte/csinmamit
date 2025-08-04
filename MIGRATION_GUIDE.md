# Migration Guide: PostgreSQL to Firestore

This document outlines the migration from PostgreSQL + NextAuth to Firebase Auth + Firestore database.

## Changes Made

### 1. Database Migration
- **Removed**: Prisma ORM and PostgreSQL
- **Added**: Firebase Firestore NoSQL database
- **Benefits**: 
  - Faster queries and real-time updates
  - Better scalability
  - Simplified deployment (no database server needed)
  - Built-in authentication integration

### 2. Authentication Migration
- **Removed**: NextAuth.js with Prisma adapter
- **Added**: Firebase Authentication with Google provider
- **Benefits**:
  - Seamless integration with Firestore
  - Built-in security rules
  - Real-time authentication state

### 3. API Layer Updates
- **Updated**: All tRPC routers to use Firestore services
- **Added**: Firebase Admin SDK for server-side operations
- **Maintained**: Type safety and validation with Zod

## New File Structure

```
src/
├── lib/
│   ├── firestore.ts          # Firestore service layer
│   └── firebase-auth.ts      # Client-side auth hooks
├── server/
│   ├── auth.ts               # Firebase Admin auth
│   └── api/
│       └── routers/          # Updated to use Firestore
└── utils/
    └── api.ts                # Updated tRPC client with auth
```

## Environment Variables

### Required Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration (Server-side)
FIREBASE_TOKEN="your-firebase-api-key"
FIREBASE_URL="your-firebase-database-url"
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-service-account-email"
FIREBASE_PRIVATE_KEY="your-service-account-private-key"

# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_TOKEN="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_URL="your-firebase-database-url"

# Other existing variables...
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM_EMAIL=""
```

### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication with Google provider
4. Enable Firestore Database
5. Go to Project Settings > Service Accounts
6. Generate new private key (downloads JSON file)
7. Extract the required values from the JSON file

## Database Collections

The following Firestore collections will be created automatically:

- `users` - User profiles and data
- `core` - Core team members
- `events` - Event information
- `teams` - Team registrations
- `recruits` - Recruitment applications

## Migration Steps

### 1. Install Dependencies
```bash
npm install firebase-admin
npm uninstall @prisma/client @auth/prisma-adapter next-auth prisma
```

### 2. Update Environment Variables
Copy the new environment variables to your `.env.local` file.

### 3. Set Up Firebase Project
- Create Firebase project
- Enable Authentication and Firestore
- Download service account key
- Update environment variables

### 4. Data Migration (Optional)
If you have existing data in PostgreSQL, you'll need to export it and import to Firestore:

```javascript
// Example migration script
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

// Export data from PostgreSQL and import to Firestore
const migrateData = async (data, collectionName) => {
  for (const item of data) {
    await addDoc(collection(db, collectionName), item);
  }
};
```

### 5. Update Authentication Components
Replace NextAuth components with Firebase Auth:

```tsx
// Old NextAuth usage
import { useSession } from 'next-auth/react';

// New Firebase Auth usage
import { useAuth } from '~/lib/firebase-auth';

const { user, signInWithGoogle, signOut } = useAuth();
```

## Benefits of This Migration

1. **Performance**: Firestore provides faster queries and real-time updates
2. **Scalability**: No database server management required
3. **Cost**: Pay-per-use pricing model
4. **Security**: Built-in security rules and authentication
5. **Real-time**: Automatic real-time data synchronization
6. **Offline**: Built-in offline support

## Security Rules

Set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow public read access to core team and events
    match /core/{document=**} {
      allow read: if true;
    }
    
    match /events/{document=**} {
      allow read: if true;
    }
    
    // Allow authenticated users to create teams and recruits
    match /teams/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /recruits/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Testing

1. Test authentication flow
2. Test all CRUD operations
3. Test real-time updates
4. Test offline functionality
5. Verify security rules

## Troubleshooting

### Common Issues

1. **Firebase Admin SDK not initialized**: Check environment variables
2. **Authentication errors**: Verify Firebase project configuration
3. **Permission denied**: Check Firestore security rules
4. **Token expired**: Implement token refresh logic

### Debug Mode

Enable debug logging in development:

```javascript
// In firebase.ts
const firebaseApp = initializeApp(firebaseConfig);
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## Support

For issues related to:
- Firebase setup: [Firebase Documentation](https://firebase.google.com/docs)
- Firestore queries: [Firestore Documentation](https://firebase.google.com/docs/firestore)
- Authentication: [Firebase Auth Documentation](https://firebase.google.com/docs/auth) 