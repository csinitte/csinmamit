# CSI Membership Workflow Documentation

## Overview
This document describes the comprehensive membership workflow system implemented for CSI NMAMIT, including user registration, payment processing, role management, and membership expiration handling.

## Architecture

### 1. User Registration Flow
1. User fills out recruitment form on `/recruit` page
2. Form data is saved to `recruits` collection in Firestore
3. User proceeds to payment via Razorpay
4. After successful payment, user role is updated to "EXECUTIVE MEMBER"

### 2. Membership Data Structure

#### User Document Fields (users collection)
```typescript
{
  // Existing fields
  name: string;
  email: string;
  role: string; // "User" | "EXECUTIVE MEMBER" | "Admin"
  
  // New membership fields
  membershipType: string; // "Annual", "Semester", "Quarterly", etc.
  membershipStartDate: Date;
  membershipEndDate: Date;
  paymentDetails: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amount: number;
    currency: string;
    paymentDate: Date;
  };
  membershipExpired?: boolean;
  membershipExpiredDate?: Date;
}
```

#### Recruit Document Fields (recruits collection)
```typescript
{
  name: string;
  personalEmail: string;
  membershipPlan: string;
  csiIdea: string;
  dateOfBirth: Date;
  usn: string;
  yearOfStudy: string;
  branch: string;
  mobileNumber: string;
  collegeEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Key Components

### 1. Membership Utilities (`src/lib/membership-utils.ts`)

#### Functions:
- `getMembershipDuration(plan)`: Returns duration in months for a plan
- `calculateMembershipEndDate(plan)`: Calculates end date based on plan
- `updateUserMembership(userId, recruitData, paymentDetails)`: Updates user after payment
- `getUserRecruitData(email)`: Retrieves recruit data by email
- `isMembershipActive(endDate)`: Checks if membership is still valid
- `getMembershipStatusMessage(membershipData, recruitData)`: Returns status message
- `getMembershipBadgeColor(membershipData, recruitData)`: Returns badge color
- `checkAndUpdateExpiredMemberships()`: Updates expired memberships
- `getUserMembershipStatus(userId)`: Gets current membership status

### 2. Profile Page Updates (`src/components/profile/profile.tsx`)

#### New Features:
- **Membership Status Badge**: Shows current membership status with color coding
- **Membership Details Section**: Displays membership type, dates, payment info
- **Application Details**: Shows recruit application info for pending payments
- **Dynamic Role Display**: Shows current user role

#### Status Messages:
- **No Membership**: "No membership found. Join CSI to become a member!"
- **Pending Payment**: "Application submitted for [Plan] membership. Payment pending."
- **Active Membership**: "Active [Type] member. [X] days remaining."
- **Expired Membership**: "Membership expired on [Date]. Renew to continue benefits."

### 3. Payment Integration (`src/pages/recruit/index.tsx`)

#### Payment Success Flow:
1. User completes Razorpay payment
2. Payment is verified via `/api/razorpay/verify-payment`
3. `updateUserMembership()` is called with payment details
4. User role is updated to "EXECUTIVE MEMBER"
5. Membership data is saved to user document

### 4. Membership Expiration System

#### API Endpoint: `/api/membership/check-expired`
- **Method**: POST
- **Purpose**: Check and update expired memberships
- **Usage**: Can be called via cron job or manually

#### Expiration Logic:
- Checks all users with `membershipEndDate` field
- Compares current date with `membershipEndDate`
- Updates role from "EXECUTIVE MEMBER" to "User" for expired memberships
- Sets `membershipExpired: true` and `membershipExpiredDate`

## Firestore Security Rules

### Updated Rules:
```javascript
// Users can read/write their own data including membership fields
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  allow update: if request.auth != null && request.auth.uid == userId && 
    (resource.data.diff(resource.data).affectedKeys().hasOnly(['membershipType', 'membershipStartDate', 'membershipEndDate', 'paymentDetails', 'role', 'updatedAt']));
}

// Users can read their own recruit data
match /recruits/{recruitId} {
  allow read: if request.auth != null && 
    (request.auth.token.admin == true || resource.data.personalEmail == request.auth.token.email);
  allow create: if request.auth != null;
  allow update: if request.auth != null && request.auth.token.admin == true;
}
```

## Deployment and Maintenance

### 1. Cron Job Setup
Set up a daily cron job to call the expiration check endpoint:
```bash
# Example cron job (runs daily at 2 AM)
0 2 * * * curl -X POST https://your-domain.com/api/membership/check-expired
```

### 2. Monitoring
- Monitor the `/api/membership/check-expired` endpoint logs
- Check for failed membership updates
- Monitor payment success rates

### 3. Backup Strategy
- Regular backups of Firestore data
- Export membership data for analysis
- Monitor membership expiration patterns

## Testing

### Test Cases:
1. **New User Registration**: Complete recruitment form and payment
2. **Membership Display**: Verify profile shows correct membership info
3. **Expiration Handling**: Test automatic role updates
4. **Payment Failure**: Verify user role remains unchanged
5. **Admin Access**: Test admin ability to view all recruit data

### Manual Testing:
```bash
# Test expiration check endpoint
curl -X POST http://localhost:3000/api/membership/check-expired

# Check user membership status
# Navigate to profile page and verify display
```

## Future Enhancements

### Potential Improvements:
1. **Email Notifications**: Send reminders before membership expires
2. **Auto-Renewal**: Automatic payment processing for renewals
3. **Membership Tiers**: Different membership levels with varying benefits
4. **Analytics Dashboard**: Track membership statistics
5. **Bulk Operations**: Admin tools for bulk membership management

## Troubleshooting

### Common Issues:
1. **Payment Success but No Role Update**: Check `updateUserMembership` function logs
2. **Membership Not Showing**: Verify recruit data exists and email matches
3. **Expired Memberships Not Updated**: Check cron job and API endpoint logs
4. **Firestore Permission Errors**: Verify security rules are correctly deployed

### Debug Commands:
```javascript
// Check user membership status
const status = await getUserMembershipStatus(userId);
console.log(status);

// Manually trigger expiration check
await checkAndUpdateExpiredMemberships();
```

## Security Considerations

1. **Payment Verification**: Always verify payments server-side
2. **Role Validation**: Validate role changes through proper channels
3. **Data Access**: Users can only access their own data
4. **API Protection**: Consider adding authentication to expiration endpoint
5. **Audit Trail**: Log all membership changes for accountability 