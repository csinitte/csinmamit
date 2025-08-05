# Firebase Security Rules Guide

## Overview

This document explains the comprehensive Firebase security rules implemented for the CSI NMAMIT project. The rules provide robust security, data validation, and access control for all Firestore collections.

## Key Security Features

### 🔐 Authentication & Authorization
- **Email-based Admin System**: Admins are identified by their email addresses
- **Role-based Access Control**: Different permissions for public users, authenticated users, and admins
- **Owner-based Permissions**: Users can only modify their own data

### 🛡️ Data Validation
- **Field-level Validation**: All data fields are validated for type, length, and format
- **Schema Enforcement**: Strict data structure validation prevents malformed data
- **Input Sanitization**: Protection against malicious data injection

### ⚡ Performance & Security
- **Rate Limiting**: Basic rate limiting to prevent abuse
- **Size Restrictions**: Limits on data size to prevent storage abuse
- **Optimized Queries**: Rules designed to work efficiently with Firestore indexes

## Admin Configuration

### Setting Up Admins

To configure admin users, update the `isAdmin()` function in `firestore.rules`:

```javascript
function isAdmin() {
  return isAuthenticated() && 
    request.auth.token.email in [
      'admin@csinmamit.com',           // Main admin
      'president@csinmamit.com',       // President
      'secretary@csinmamit.com',       // Secretary  
      'treasurer@csinmamit.com',       // Treasurer
      'your-email@example.com'         // Add your admin emails here
    ];
}
```

**Important**: Replace the example emails with actual admin email addresses.

## Collection Security Rules

### 👤 Users Collection (`/users/{userId}`)

**Access Control:**
- ✅ **Read**: Users can read their own profile, admins can read any profile
- ✅ **Create**: Users can create their own profile with valid data
- ✅ **Update**: Users can update their own profile, admins can update any profile
- ❌ **Delete**: Only admins can delete user profiles

**Validation:**
- Name: 1-100 characters, required
- Bio: 0-500 characters, optional
- Branch: 0-100 characters, optional
- GitHub/LinkedIn: 0-200 characters, optional
- Phone: Valid phone number format, optional
- Role: Must be 'member', 'core', or 'admin'
- Certificates: Array type, optional

**Rate Limiting:** 1 second between updates

### 👥 Core Team (`/core/{document}`)

**Access Control:**
- ✅ **Read**: Public access for displaying team
- ❌ **Write**: Only admins can manage core team data

**Validation:**
- Name, Position: 1-100 characters, required
- Bio: 0-1000 characters, optional
- Image, GitHub, LinkedIn: URL format validation
- Email: Valid email format
- Order: Numeric for sorting
- Active: Boolean flag
- Year: Numeric year

### 🎯 Events Collection (`/events/{document}`)

**Access Control:**
- ✅ **Read**: Public access for displaying events
- ❌ **Write**: Only admins can manage events

**Validation:**
- Title: 1-200 characters, required
- Description: 1-5000 characters, required
- Brief: 0-1000 characters, optional
- Category: Must be 'PREVIOUS', 'UPCOMING', or 'CURRENT'
- Type: Must be 'SOLO' or 'TEAM'
- Entry Fee: Numeric value
- Published: Boolean flag
- Featured: Boolean flag

### 🏆 Teams Collection (`/teams/{teamId}`)

**Access Control:**
- ✅ **Read**: Team members and creators can read
- ✅ **Create**: Authenticated users can create teams
- ✅ **Update**: Team owners and admins can update
- ❌ **Delete**: Only team owners and admins can delete

**Validation:**
- Name: 1-100 characters, required
- Description: 0-500 characters, optional
- Members: Array with max 10 members
- Max Members: 1-10 numeric value
- Status: Must be 'active', 'inactive', or 'full'

**Rate Limiting:** 1 second between updates

### 📝 Recruits Collection (`/recruits/{document}`)

**Access Control:**
- ❌ **Read**: Only admins can read recruit data
- ✅ **Create**: Public can submit applications
- ❌ **Update**: Only admins can update (for processing)
- ❌ **Delete**: Only admins can delete

**Validation:**
- Name: 1-100 characters, required
- USN: 8-15 alphanumeric characters, required
- Year of Study: 1-20 characters, required
- Branch: 1-100 characters, required
- Mobile: Valid phone format, required
- Personal Email: Valid email format, required
- College Email: Valid email format, optional
- Membership Plan: 1-50 characters, required
- CSI Idea: 1-2000 characters, required
- Payment Status: 'pending', 'completed', or 'failed'

### 📊 Metadata Collection (`/metadata/{document}`)

**Access Control:**
- ✅ **Read**: Public access for system information
- ❌ **Write**: Only admins can update metadata

## Security Functions

### Helper Functions

```javascript
// Authentication checks
isAuthenticated()           // Check if user is logged in
isAdmin()                  // Check if user is admin
isOwner(userId)            // Check if user owns resource
isOwnerOrAdmin(userId)     // Check if user is owner or admin

// Validation functions
isValidStringLength(field, min, max)  // Validate string length
isValidEmail(email)                   // Validate email format
isValidPhone(phone)                   // Validate phone format
isValidUSN(usn)                      // Validate USN format
onlyUpdatingFields(allowedFields)     // Check allowed field updates
isWithinRateLimit()                   // Basic rate limiting
```

## Deployment

### 1. Deploy Rules to Firebase

```bash
# Deploy rules to Firebase
firebase deploy --only firestore:rules

# Test rules with emulator
firebase emulators:start --only firestore
```

### 2. Verify Rules

```bash
# Check if rules are valid
firebase firestore:rules:get

# Test rules with Firebase console
# Go to Firebase Console > Firestore > Rules tab
```

### 3. Monitor Security

```bash
# Check security violations in Firebase Console
# Go to Firebase Console > Firestore > Usage tab
```

## Testing Rules

### Using Firebase Emulator

```javascript
// Example test for user creation
const testUserCreation = async () => {
  const db = firebase.firestore();
  const userRef = db.collection('users').doc('test-user-id');
  
  try {
    await userRef.set({
      name: 'Test User',
      bio: 'Test bio',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ User creation successful');
  } catch (error) {
    console.error('❌ User creation failed:', error);
  }
};
```

### Testing Admin Functions

```javascript
// Test admin access
const testAdminAccess = async () => {
  // Sign in with admin email
  await firebase.auth().signInWithEmailAndPassword('admin@csinmamit.com', 'password');
  
  const db = firebase.firestore();
  const eventRef = db.collection('events').doc('test-event');
  
  try {
    await eventRef.set({
      title: 'Test Event',
      description: 'Test description',
      published: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Admin event creation successful');
  } catch (error) {
    console.error('❌ Admin event creation failed:', error);
  }
};
```

## Common Issues & Solutions

### Issue: Admin Access Denied

**Solution:** Verify admin email is correctly added to the `isAdmin()` function and the user is authenticated with that email.

### Issue: Data Validation Errors

**Solution:** Check that all required fields are present and match the validation rules. Use browser dev tools to inspect the exact error message.

### Issue: Rate Limiting

**Solution:** Ensure updates are not happening too frequently. The basic rate limiting allows one update per second.

### Issue: Field Update Restrictions

**Solution:** Make sure you're only updating allowed fields. Check the `onlyUpdatingFields()` validation for each collection.

## Security Best Practices

### 1. Regular Security Audits
- Review admin email list regularly
- Monitor Firebase Console for security violations
- Check for unusual access patterns

### 2. Data Validation
- Always validate data on both client and server side
- Use TypeScript interfaces that match Firestore rules
- Implement proper error handling

### 3. Access Control
- Follow principle of least privilege
- Regularly review user permissions
- Use role-based access control consistently

### 4. Monitoring
- Set up Firebase alerts for security violations
- Monitor Firestore usage and costs
- Log important security events

## Migration Notes

### From Previous Rules

The new rules are more restrictive than the previous version:

1. **Admin System**: Changed from custom claims to email-based verification
2. **Validation**: Added comprehensive field validation
3. **Rate Limiting**: Added basic rate limiting protection
4. **Security**: Removed overly permissive rules

### Required Code Changes

You may need to update your application code to:

1. **Handle Validation Errors**: Add proper error handling for validation failures
2. **Admin Checks**: Update admin verification logic to use email-based system
3. **Field Updates**: Ensure only allowed fields are updated in each operation

## Support

For questions or issues with the Firebase rules:

1. Check the Firebase Console for detailed error messages
2. Use Firebase Emulator for local testing
3. Review this documentation for validation requirements
4. Contact the development team for assistance

---

**Last Updated:** December 2024  
**Version:** 2.0  
**Author:** CSI NMAMIT Development Team
