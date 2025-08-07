# Firestore Rules Quick Reference

## Basic Rule Structure

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Your rules here
  }
}
```

## Common Rule Patterns

### 1. Public Read, Authenticated Write
```javascript
match /collection/{docId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

### 2. User-Owned Documents
```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### 3. Admin-Only Access
```javascript
match /admin/{docId} {
  allow read, write: if request.auth != null && request.auth.token.admin == true;
}
```

### 4. Field-Specific Updates
```javascript
match /users/{userId} {
  allow update: if request.auth != null && 
    request.auth.uid == userId && 
    request.resource.data.keys().hasOnly(['name', 'email', 'updatedAt']);
}
```

### 5. Array Operations
```javascript
match /users/{userId} {
  allow update: if request.auth != null && 
    request.auth.uid == userId && 
    (resource.data.diff(resource.data).affectedKeys().hasOnly(['certificates', 'updatedAt']));
}
```

## Rule Functions

### Create Reusable Functions
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }
    
    function isValidUserData() {
      return request.resource.data.keys().hasOnly(['name', 'email', 'bio', 'updatedAt']);
    }
    
    // Use functions in rules
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      allow update: if isOwner(userId) && isValidUserData();
    }
  }
}
```

## Data Validation Rules

### Validate Required Fields
```javascript
function hasRequiredFields() {
  return request.resource.data.keys().hasAll(['name', 'email']) &&
         request.resource.data.name is string &&
         request.resource.data.email is string;
}
```

### Validate String Length
```javascript
function isValidName() {
  return request.resource.data.name is string &&
         request.resource.data.name.size() > 0 &&
         request.resource.data.name.size() < 100;
}
```

### Validate Email Format
```javascript
function isValidEmail() {
  return request.resource.data.email is string &&
         request.resource.data.email.matches('^[^@]+@[^@]+\\.[^@]+$');
}
```

## Collection-Specific Rules

### Users Collection
```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  allow update: if request.auth != null && request.auth.uid == userId && 
    (resource.data.diff(resource.data).affectedKeys().hasOnly(['certificates', 'updatedAt']) || 
     resource.data.diff(resource.data).affectedKeys().hasOnly(['name', 'bio', 'branch', 'github', 'linkedin', 'phone', 'role', 'updatedAt']));
}
```

### Events Collection
```javascript
match /events/{eventId} {
  allow read: if true;  // Public read
  allow write: if request.auth != null && request.auth.token.admin == true;  // Admin only
}
```

### Teams Collection
```javascript
match /teams/{teamId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update: if request.auth != null && 
    (resource.data.custid == request.auth.uid || request.auth.token.admin == true);
  allow delete: if request.auth != null && request.auth.token.admin == true;
}
```

## Subcollection Rules

### Nested Collections
```javascript
match /users/{userId}/posts/{postId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.uid == userId;
}
```

### Recursive Rules
```javascript
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## Time-Based Rules

### Expiring Documents
```javascript
match /temporary/{docId} {
  allow read: if request.auth != null && 
    resource.data.expiresAt > request.time;
  allow write: if request.auth != null;
}
```

## Rate Limiting (Conceptual)

```javascript
match /posts/{postId} {
  allow create: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.postCount < 10;
}
```

## Testing Rules

### Use Firebase Emulator
```bash
# Start emulator
firebase emulators:start --only firestore

# Test rules
firebase firestore:rules:test
```

### Test Specific Rules
```javascript
// Test rule in Firebase Console Rules Playground
// Input document: users/user123
// Request: read
// User: authenticated user with uid "user123"
```

## Common Error Messages

### Permission Denied
```
FirebaseError: Missing or insufficient permissions
```
**Solution**: Check if user is authenticated and has proper permissions

### Invalid Data
```
FirebaseError: Invalid data. Document contains invalid field
```
**Solution**: Validate data structure in rules

### Missing Fields
```
FirebaseError: Missing required field
```
**Solution**: Add field validation in rules

## Best Practices

1. **Start Restrictive**: Begin with deny-all and add permissions gradually
2. **Test Thoroughly**: Use Firebase Emulator for testing
3. **Monitor Usage**: Check Firebase Console for rule violations
4. **Use Functions**: Create reusable rule functions
5. **Validate Data**: Always validate data structure and content
6. **Principle of Least Privilege**: Only grant necessary permissions

## Security Checklist

- [ ] All collections have appropriate rules
- [ ] User data is protected (users can only access their own data)
- [ ] Admin functions are properly secured
- [ ] Data validation is implemented
- [ ] Rules are tested with Firebase Emulator
- [ ] No sensitive data is exposed to public read
- [ ] Write operations are properly restricted
- [ ] Array operations are handled correctly
- [ ] Subcollections have appropriate rules
- [ ] Time-based rules are implemented if needed

## Debugging Tips

1. **Check Firebase Console**: Look for rule violations in the console
2. **Use Emulator**: Test rules locally before deploying
3. **Add Logging**: Use `debug()` function in rules for debugging
4. **Check Authentication**: Ensure user is properly authenticated
5. **Validate Data**: Check if data structure matches expectations

## Example Complete Rules File

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }
    
    function isValidUserData() {
      return request.resource.data.keys().hasOnly(['name', 'bio', 'branch', 'github', 'linkedin', 'phone', 'role', 'certificates', 'updatedAt']);
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      allow update: if isOwner(userId) && isValidUserData();
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Teams collection
    match /teams/{teamId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
        (resource.data.custid == request.auth.uid || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

**Remember**: Always test your rules thoroughly before deploying to production! 