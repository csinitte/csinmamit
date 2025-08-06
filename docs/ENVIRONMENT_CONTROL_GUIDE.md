# Environment Control Guide

## Overview

The CSI NMAMIT membership system includes a flexible environment-based control mechanism that allows administrators to enable or disable membership registration without requiring code changes or deployments.

## Environment Variable

### **Variable Name**: `NEXT_PUBLIC_MEMBERSHIP_ENABLED`

### **Purpose**: Controls whether membership registration is available to users

### **Values**:
- `"true"` - Membership registration is **ENABLED**
- `"false"` or not set - Membership registration is **DISABLED**

## Configuration

### 1. **Local Development**

#### **File**: `.env.local`
```bash
# Enable membership registration
NEXT_PUBLIC_MEMBERSHIP_ENABLED=true

# Disable membership registration
NEXT_PUBLIC_MEMBERSHIP_ENABLED=false
```

### 2. **Production Environment**

#### **Vercel Deployment**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the variable:
   - **Name**: `NEXT_PUBLIC_MEMBERSHIP_ENABLED`
   - **Value**: `true` or `false`
   - **Environment**: Production (and Preview if needed)

#### **Other Hosting Platforms**
Add the environment variable to your hosting platform's configuration:
```bash
NEXT_PUBLIC_MEMBERSHIP_ENABLED=true
```

## How It Works

### 1. **Frontend Components**

The environment variable controls the visibility of membership-related UI elements across the application:

#### **Navbar** (`src/components/layout/navbar.tsx`)
```typescript
{env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && (
  <Link href="/recruit" className="...">
    Get Membership
  </Link>
)}
```

#### **Home Page** (`src/components/home-page/index.tsx`)
```typescript
{env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" ? (
  <Link href="/recruit">
    <Button>Get Executive Membership</Button>
  </Link>
) : (
  <div className="text-gray-500 italic">
    Membership registration is currently closed
  </div>
)}
```

#### **Profile Page** (`src/components/profile/profile.tsx`)
```typescript
{!membershipData && env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && (
  <div className="membership-section">
    {/* Membership registration content */}
  </div>
)}
```

#### **Recruit Page** (`src/pages/recruit/index.tsx`)
```typescript
if (env.NEXT_PUBLIC_MEMBERSHIP_ENABLED !== "true") {
  return (
    <div className="membership-closed">
      <h1>Membership Registration Closed</h1>
      <p>Please check back later for updates.</p>
    </div>
  );
}
```

### 2. **User Experience Changes**

#### **When ENABLED** (`NEXT_PUBLIC_MEMBERSHIP_ENABLED=true`):

**Navbar**:
- ✅ Shows "Get Membership" button
- ✅ Button links to `/recruit` page

**Home Page**:
- ✅ Shows "Get Executive Membership" button in hero section
- ✅ Shows membership benefits section
- ✅ Shows "Get Executive Membership Now" button

**Profile Page**:
- ✅ Shows membership status for all users
- ✅ Shows "Get Membership" button for non-members
- ✅ Shows "Renew" button for expired members
- ✅ Shows membership details for active members

**Recruit Page**:
- ✅ Fully functional membership registration
- ✅ Year selection and payment options
- ✅ Complete registration flow

#### **When DISABLED** (`NEXT_PUBLIC_MEMBERSHIP_ENABLED=false` or not set):

**Navbar**:
- ❌ Hides "Get Membership" button completely

**Home Page**:
- ❌ Hides "Get Executive Membership" button
- ❌ Shows "Membership registration is currently closed" message
- ❌ Hides membership benefits section call-to-action

**Profile Page**:
- ❌ Hides membership status for non-members
- ❌ Hides "Get Membership" button for non-members
- ❌ Hides "Renew" button for expired members
- ✅ Still shows active membership status for active members
- ❌ Shows "Membership Registration Closed" message for non-members

**Recruit Page**:
- ❌ Shows "Membership Registration Closed" page
- ❌ No access to registration functionality
- ❌ Redirects users back to home

## Implementation Details

### 1. **Environment Configuration**

#### **File**: `src/env.js`
```typescript
client: {
  // ... other variables
  NEXT_PUBLIC_MEMBERSHIP_ENABLED: z.string().optional(),
},

runtimeEnv: {
  // ... other variables
  NEXT_PUBLIC_MEMBERSHIP_ENABLED: process.env.NEXT_PUBLIC_MEMBERSHIP_ENABLED,
}
```

### 2. **Component Integration**

#### **Import Pattern**:
```typescript
import { env } from "../../env";
```

#### **Usage Pattern**:
```typescript
{env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && (
  // Membership-related content
)}
```

### 3. **Conditional Rendering Logic**

#### **Simple Toggle**:
```typescript
{env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && <Component />}
```

#### **Toggle with Alternative**:
```typescript
{env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" ? (
  <MembershipComponent />
) : (
  <ClosedMessage />
)}
```

#### **Complex Conditions**:
```typescript
{(env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" || 
  (membershipData && isMembershipActive(membershipData.membershipEndDate))) && (
  <MembershipStatus />
)}
```

## Use Cases

### 1. **Regular Operations**
```bash
# Normal operation - membership open
NEXT_PUBLIC_MEMBERSHIP_ENABLED=true
```

### 2. **Registration Periods**
```bash
# During specific registration periods
NEXT_PUBLIC_MEMBERSHIP_ENABLED=true

# Between registration periods
NEXT_PUBLIC_MEMBERSHIP_ENABLED=false
```

### 3. **Maintenance Mode**
```bash
# During system maintenance
NEXT_PUBLIC_MEMBERSHIP_ENABLED=false
```

### 4. **Testing**
```bash
# Test disabled state
NEXT_PUBLIC_MEMBERSHIP_ENABLED=false

# Test enabled state
NEXT_PUBLIC_MEMBERSHIP_ENABLED=true
```

## Best Practices

### 1. **Environment Management**
- **Use `.env.local`** for local development
- **Set in production** via hosting platform
- **Document changes** in deployment notes
- **Test both states** before deployment

### 2. **User Communication**
- **Clear messaging** when registration is closed
- **Consistent UI** across all pages
- **Helpful redirects** to appropriate pages
- **Professional appearance** in both states

### 3. **Monitoring**
- **Log environment state** on application startup
- **Monitor user feedback** during disabled periods
- **Track usage patterns** when enabled/disabled
- **Alert administrators** of state changes

## Troubleshooting

### 1. **Common Issues**

#### **Membership buttons not showing**
- Check if `NEXT_PUBLIC_MEMBERSHIP_ENABLED=true`
- Verify environment variable is set correctly
- Restart development server after changes

#### **Membership buttons showing when disabled**
- Check if `NEXT_PUBLIC_MEMBERSHIP_ENABLED=false`
- Clear browser cache
- Verify deployment includes environment variable

#### **Inconsistent behavior across pages**
- Ensure all components check the same environment variable
- Verify import statements are correct
- Check for typos in variable name

### 2. **Debug Steps**
```typescript
// Add to any component to debug
console.log('Membership enabled:', env.NEXT_PUBLIC_MEMBERSHIP_ENABLED);
console.log('Environment check:', env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true");
```

### 3. **Verification Commands**
```bash
# Check environment variable in production
curl -s https://yourdomain.com/api/health | grep membership

# Test API endpoint
curl -X POST https://yourdomain.com/api/membership/check-expired
```

## Security Considerations

### 1. **Client-Side Exposure**
- **Public variable**: `NEXT_PUBLIC_` prefix makes it visible to clients
- **No sensitive data**: Only controls UI visibility
- **No security risk**: Cannot be used to bypass server-side checks

### 2. **Server-Side Validation**
- **Always validate** membership status on server
- **Don't rely** solely on client-side checks
- **Use role-based** access control for features

### 3. **Data Protection**
- **Active memberships** remain visible regardless of setting
- **User data** is not affected by this setting
- **Payment processing** is independent of UI state

## Future Enhancements

### 1. **Advanced Controls**
- **Time-based scheduling**: Automatic enable/disable based on dates
- **User-specific controls**: Different rules for different user types
- **Feature flags**: More granular control over specific features

### 2. **Monitoring Tools**
- **Admin dashboard**: Visual control panel for membership status
- **Analytics**: Track usage during enabled/disabled periods
- **Notifications**: Alert when registration is enabled/disabled

### 3. **Integration Features**
- **API endpoints**: Programmatic control of membership status
- **Webhook support**: Notify external systems of status changes
- **Audit logging**: Track all status changes and who made them 