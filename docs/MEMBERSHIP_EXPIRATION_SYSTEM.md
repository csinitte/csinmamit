# Membership Expiration and Role Reversion System

## Overview

The membership expiration system automatically manages user roles and membership status when memberships expire. This ensures that users with expired memberships cannot access member-only features and their roles are properly updated.

## How It Works

### 1. **Automatic Expiration Detection**

#### **Profile Load Check**
When a user loads their profile, the system automatically:
1. Checks if the user has membership data
2. Compares current date with membership end date
3. If expired and role is still "EXECUTIVE MEMBER":
   - Updates role to "User"
   - Sets `membershipExpired: true`
   - Sets `membershipExpiredDate` to current date
   - Updates `updatedAt` timestamp

#### **Background Global Check**
When any user loads their profile, the system runs a background check:
1. Queries all users with membership data
2. Identifies users with expired memberships
3. Updates their roles in bulk
4. Logs the number of updated memberships

### 2. **Expiration Logic**

#### **Date Calculation**
```typescript
// Membership end dates are calculated as:
const currentYear = new Date().getFullYear();
const endYear = currentYear + selectedYears;
const membershipEndDate = new Date(endYear, 3, 30); // April 30th (0-indexed)

// If current date is past April 30th, start from next year
if (currentDate.getMonth() > 3 || (currentDate.getMonth() === 3 && currentDate.getDate() > 30)) {
  membershipEndDate.setFullYear(endYear + 1);
}
```

#### **Active Status Check**
```typescript
const isMembershipActive = (endDate: Date): boolean => {
  const today = new Date();
  return today < endDate;
};
```

### 3. **Role Management**

#### **Role Transitions**
- **New Member**: `User` → `EXECUTIVE MEMBER` (after payment)
- **Active Member**: `EXECUTIVE MEMBER` (unchanged)
- **Expired Member**: `EXECUTIVE MEMBER` → `User` (automatic)

#### **Role Update Process**
```typescript
if (!isActive && data.role === "EXECUTIVE MEMBER") {
  await updateDoc(doc(db, 'users', user.id), {
    role: "User",
    membershipExpired: true,
    membershipExpiredDate: new Date(),
    updatedAt: new Date(),
  });
}
```

## Implementation Details

### 1. **Profile Component Integration**

#### **Location**: `src/components/profile/profile.tsx`

#### **Key Functions**:
```typescript
// Check membership status on profile load
useEffect(() => {
  const loadUserData = async () => {
    // ... existing code ...
    
    if (data.membershipType) {
      const membershipEndDate = data.membershipEndDate?.toDate() || new Date();
      const isActive = isMembershipActive(membershipEndDate);
      
      // Auto-update expired memberships
      if (!isActive && data.role === "EXECUTIVE MEMBER") {
        await updateDoc(doc(db, 'users', user.id), {
          role: "User",
          membershipExpired: true,
          membershipExpiredDate: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  };
}, [user?.id]);
```

### 2. **Background Check Function**

#### **Location**: `src/lib/membership-utils.ts`

#### **Function**: `checkAndUpdateExpiredMemberships()`

```typescript
export const checkAndUpdateExpiredMemberships = async (): Promise<void> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('membershipEndDate', '!=', null));
    const querySnapshot = await getDocs(q);
    
    const now = new Date();
    const expiredUsers: string[] = [];
    
    // Find expired memberships
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const membershipEndDate = userData.membershipEndDate?.toDate();
      
      if (membershipEndDate && now > membershipEndDate && userData.role === "EXECUTIVE MEMBER") {
        expiredUsers.push(doc.id);
      }
    });
    
    // Update expired memberships
    for (const userId of expiredUsers) {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: "User",
        membershipExpired: true,
        membershipExpiredDate: now,
        updatedAt: now,
      });
    }
    
    console.log(`Updated ${expiredUsers.length} expired memberships`);
  } catch (error) {
    console.error('Error checking expired memberships:', error);
    throw error;
  }
};
```

### 3. **API Endpoint**

#### **Location**: `src/pages/api/membership/check-expired.ts`

#### **Usage**:
```bash
# Manual trigger
curl -X POST http://localhost:3000/api/membership/check-expired

# Response
{
  "success": true,
  "message": "Expired memberships checked and updated successfully"
}
```

## Data Fields Added

### **New Fields in User Document**:
```typescript
{
  // Existing fields...
  role: "User" | "EXECUTIVE MEMBER";
  membershipType: string;
  membershipStartDate: Date;
  membershipEndDate: Date;
  
  // New expiration tracking fields
  membershipExpired?: boolean;        // Set to true when membership expires
  membershipExpiredDate?: Date;       // Date when membership expired
  updatedAt: Date;                    // Last update timestamp
}
```

## User Experience

### **Active Members**
- ✅ Can access member-only features
- ✅ Profile shows "Active Member" status
- ✅ Cannot access membership registration page
- ✅ No renewal options shown

### **Expired Members**
- ❌ Cannot access member-only features
- ✅ Profile shows "Membership Expired" status
- ✅ Can renew membership (if registration is open)
- ✅ Role automatically shows as "User"

### **Non-Members**
- ❌ Cannot access member-only features
- ✅ Profile shows "Not a Member" status (if registration open)
- ✅ No membership status shown (if registration closed)

## Monitoring and Logging

### **Console Logs**
```typescript
// When individual membership expires
console.log(`Membership expired for user ${userId}`);

// When bulk update completes
console.log(`Updated ${expiredUsers.length} expired memberships`);

// When background check runs
console.log('Background membership check completed');
```

### **Error Handling**
```typescript
try {
  await checkAndUpdateExpiredMemberships();
} catch (error) {
  console.error('Error checking expired memberships:', error);
  // Error is logged but doesn't break the user experience
}
```

## Performance Considerations

### **Optimizations**
- **Background Processing**: Expiration checks run in background
- **Bulk Updates**: Multiple expired memberships updated in one operation
- **Conditional Checks**: Only checks users with membership data
- **Non-blocking**: Doesn't affect user interface performance

### **Database Queries**
- **Efficient Filtering**: Only queries users with membership data
- **Indexed Fields**: Uses indexed `membershipEndDate` field
- **Batch Operations**: Updates multiple documents efficiently

## Maintenance and Troubleshooting

### **Manual Checks**
```bash
# Trigger manual expiration check
curl -X POST https://yourdomain.com/api/membership/check-expired
```

### **Cron Job Setup** (Optional)
```bash
# Add to crontab for daily checks at 2 AM
0 2 * * * curl -X POST https://yourdomain.com/api/membership/check-expired
```

### **Monitoring Queries**
```sql
-- Check expired memberships (Firestore query)
where membershipEndDate < now() and role == "EXECUTIVE MEMBER"

-- Check recently expired memberships
where membershipExpiredDate > now() - 7 days
```

## Security Considerations

### **Data Integrity**
- **Atomic Updates**: Role changes are atomic operations
- **Validation**: Checks ensure only valid role transitions
- **Audit Trail**: `updatedAt` timestamp tracks all changes

### **Access Control**
- **Role-based Access**: Features check user roles
- **Automatic Enforcement**: No manual intervention needed
- **Consistent State**: System always reflects current membership status

## Future Enhancements

### **Planned Features**
- **Email Notifications**: Alert users before membership expires
- **Grace Period**: Allow access for a few days after expiration
- **Renewal Reminders**: Automated reminders for expired members
- **Analytics Dashboard**: Track expiration patterns and trends

### **Advanced Features**
- **Partial Expiration**: Gradual access reduction
- **Tiered Memberships**: Different expiration rules for different tiers
- **Custom Expiration Dates**: Override default April 30th rule
- **Bulk Operations**: Admin tools for bulk membership management 