# Membership System API Reference

## Overview

This document provides a comprehensive reference for all API endpoints and utility functions related to the CSI NMAMIT membership system.

## API Endpoints

### 1. **Check Expired Memberships**

#### **Endpoint**: `POST /api/membership/check-expired`

#### **Purpose**: Manually trigger the expired membership check and role reversion process

#### **Request**:
```http
POST /api/membership/check-expired
Content-Type: application/json
```

#### **Response**:
```json
{
  "success": true,
  "message": "Expired memberships checked and updated successfully"
}
```

#### **Error Response**:
```json
{
  "error": "Failed to check expired memberships",
  "details": "Error message details"
}
```

#### **Usage**:
```bash
# Manual trigger
curl -X POST http://localhost:3000/api/membership/check-expired

# With authentication (if required)
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/membership/check-expired
```

#### **Implementation**: `src/pages/api/membership/check-expired.ts`

---

### 2. **Razorpay Order Creation**

#### **Endpoint**: `POST /api/razorpay/create-order`

#### **Purpose**: Create a new Razorpay order for membership payment

#### **Request**:
```json
{
  "amount": 350,
  "currency": "INR",
  "receipt": "mem_1703123456789"
}
```

#### **Response**:
```json
{
  "orderId": "order_ABC123",
  "amount": 35000,
  "currency": "INR"
}
```

#### **Implementation**: `src/pages/api/razorpay/create-order.ts`

---

### 3. **Razorpay Payment Verification**

#### **Endpoint**: `POST /api/razorpay/verify-payment`

#### **Purpose**: Verify Razorpay payment signature and authenticity

#### **Request**:
```json
{
  "razorpay_order_id": "order_ABC123",
  "razorpay_payment_id": "pay_XYZ789",
  "razorpay_signature": "signature_hash"
}
```

#### **Response**:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentId": "pay_XYZ789",
  "orderId": "order_ABC123"
}
```

#### **Implementation**: `src/pages/api/razorpay/verify-payment.ts`

---

## Utility Functions

### 1. **Membership Utilities** (`src/lib/membership-utils.ts`)

#### **`checkAndUpdateExpiredMemberships()`**
```typescript
export const checkAndUpdateExpiredMemberships = async (): Promise<void>
```

**Purpose**: Check all users for expired memberships and update their roles

**Returns**: Promise that resolves when all updates are complete

**Usage**:
```typescript
import { checkAndUpdateExpiredMemberships } from '~/lib/membership-utils';

// Run in background
checkAndUpdateExpiredMemberships().catch(error => {
  console.error('Error:', error);
});
```

---

#### **`isMembershipActive(endDate: Date)`**
```typescript
export const isMembershipActive = (endDate: Date): boolean
```

**Purpose**: Check if a membership is still active based on end date

**Parameters**:
- `endDate`: Date object representing membership end date

**Returns**: `true` if membership is active, `false` if expired

**Usage**:
```typescript
import { isMembershipActive } from '~/lib/membership-utils';

const isActive = isMembershipActive(membershipEndDate);
if (isActive) {
  console.log('Membership is active');
} else {
  console.log('Membership has expired');
}
```

---

#### **`getUserMembershipStatus(userId: string)`**
```typescript
export const getUserMembershipStatus = async (userId: string): Promise<{
  isActive: boolean;
  membershipType: string | null;
  daysRemaining: number | null;
  role: string;
}>
```

**Purpose**: Get comprehensive membership status for a user

**Parameters**:
- `userId`: User ID to check

**Returns**: Object with membership status information

**Usage**:
```typescript
import { getUserMembershipStatus } from '~/lib/membership-utils';

const status = await getUserMembershipStatus(userId);
console.log(`User role: ${status.role}`);
console.log(`Active: ${status.isActive}`);
console.log(`Days remaining: ${status.daysRemaining}`);
```

---

#### **`getMembershipDuration(plan: string)`**
```typescript
export const getMembershipDuration = (plan: string): number
```

**Purpose**: Get membership duration in months from plan string

**Parameters**:
- `plan`: Membership plan string (e.g., "1-Year Executive Membership")

**Returns**: Duration in months

**Usage**:
```typescript
import { getMembershipDuration } from '~/lib/membership-utils';

const duration = getMembershipDuration("1-Year Executive Membership");
console.log(`Duration: ${duration} months`); // Output: 12
```

---

#### **`calculateMembershipEndDate(plan: string)`**
```typescript
export const calculateMembershipEndDate = (plan: string): Date
```

**Purpose**: Calculate membership end date based on plan

**Parameters**:
- `plan`: Membership plan string

**Returns**: Date object representing end date (April 30th of respective year)

**Usage**:
```typescript
import { calculateMembershipEndDate } from '~/lib/membership-utils';

const endDate = calculateMembershipEndDate("1-Year Executive Membership");
console.log(`End date: ${endDate.toLocaleDateString()}`);
```

---

## Data Types

### **MembershipData Interface**
```typescript
interface MembershipData {
  membershipType: string;
  membershipStartDate: Date;
  membershipEndDate: Date;
  paymentDetails: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amount: number;
    currency: string;
    paymentDate: Date;
  };
  role: string;
}
```

### **RecruitData Interface**
```typescript
interface RecruitData {
  id: string;
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

### **User Document Structure**
```typescript
{
  // Basic user info
  name: string;
  email: string;
  role: "User" | "EXECUTIVE MEMBER";
  
  // Membership data
  membershipType: string;
  membershipStartDate: Date;
  membershipEndDate: Date;
  
  // Payment details
  paymentDetails: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amount: number; // in rupees
    currency: string;
    paymentDate: Date;
  };
  
  // Expiration tracking
  membershipExpired?: boolean;
  membershipExpiredDate?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Environment Variables

### **`NEXT_PUBLIC_MEMBERSHIP_ENABLED`**
- **Type**: `string`
- **Values**: `"true"` | `"false"` | `undefined`
- **Purpose**: Controls membership registration availability
- **Default**: `undefined` (disabled)

**Usage**:
```typescript
import { env } from '~/env';

if (env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true") {
  // Show membership options
} else {
  // Hide membership options
}
```

---

## Error Handling

### **Common Error Types**

#### **Payment Errors**
```typescript
{
  error: "Payment verification failed",
  details: "Invalid signature"
}
```

#### **Membership Errors**
```typescript
{
  error: "Failed to update membership",
  details: "User not found"
}
```

#### **Validation Errors**
```typescript
{
  error: "Invalid request",
  details: "Missing required fields"
}
```

### **Error Handling Patterns**
```typescript
try {
  const result = await apiCall();
  // Handle success
} catch (error) {
  console.error('API Error:', error);
  // Handle error appropriately
}
```

---

## Rate Limiting

### **API Limits**
- **Order Creation**: 10 requests per minute per user
- **Payment Verification**: 20 requests per minute per user
- **Membership Check**: 5 requests per minute per user

### **Implementation**
```typescript
// Rate limiting is handled by the hosting platform
// Consider implementing additional rate limiting for production
```

---

## Security Considerations

### **Authentication**
- All API endpoints should be protected with appropriate authentication
- User-specific operations should verify user ownership
- Admin operations should require admin privileges

### **Data Validation**
- All input data should be validated on both client and server
- Use TypeScript interfaces for type safety
- Sanitize user inputs to prevent injection attacks

### **Payment Security**
- Always verify Razorpay signatures server-side
- Never expose sensitive payment data to the client
- Use HTTPS for all payment-related communications

---

## Monitoring and Logging

### **Logging Levels**
```typescript
// Info level - Normal operations
console.log('Membership created successfully');

// Warning level - Potential issues
console.warn('Membership expiring soon');

// Error level - Actual errors
console.error('Failed to update membership', error);
```

### **Metrics to Monitor**
- Payment success/failure rates
- Membership creation rates
- Expiration check performance
- API response times
- Error rates by endpoint

---

## Testing

### **API Testing**
```bash
# Test membership check endpoint
curl -X POST http://localhost:3000/api/membership/check-expired

# Test with invalid data
curl -X POST http://localhost:3000/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": -100}'
```

### **Unit Testing**
```typescript
// Test utility functions
import { isMembershipActive } from '~/lib/membership-utils';

describe('isMembershipActive', () => {
  it('should return true for future dates', () => {
    const futureDate = new Date(Date.now() + 86400000); // Tomorrow
    expect(isMembershipActive(futureDate)).toBe(true);
  });
  
  it('should return false for past dates', () => {
    const pastDate = new Date(Date.now() - 86400000); // Yesterday
    expect(isMembershipActive(pastDate)).toBe(false);
  });
});
```

---

## Deployment

### **Environment Setup**
```bash
# Production environment variables
NEXT_PUBLIC_MEMBERSHIP_ENABLED=true
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### **Health Checks**
```bash
# Check API health
curl http://yourdomain.com/api/health

# Check membership endpoint
curl -X POST http://yourdomain.com/api/membership/check-expired
```

### **Monitoring**
- Set up alerts for API errors
- Monitor payment success rates
- Track membership creation metrics
- Watch for expired membership updates 