# Firebase Storage Security Rules Setup

## Problem
Profile photo uploads are failing because Firebase Storage requires proper security rules to allow authenticated users to upload files.

## Solution
You need to configure Firebase Storage security rules in your Firebase Console.

### Steps to Fix:

1. **Go to Firebase Console**
   - Visit https://console.firebase.google.com/
   - Select your Beat3 Social project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - Go to the "Rules" tab

3. **Update Security Rules**
   Replace the existing rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload profile pictures
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to upload banner images
    match /banner-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to upload post media
    match /post-media/{userId}/{postId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow public read access to all uploaded files
    match /{allPaths=**} {
      allow read: if true;
    }
  }
}
```

4. **Publish the Rules**
   - Click "Publish" to apply the new security rules

### What These Rules Do:
- Allow authenticated users to upload files to their own folders
- Prevent unauthorized access to user-specific storage paths
- Allow public read access so profile photos display properly
- Organize uploads by user ID for better security

### Test the Upload
After updating the rules, try uploading a profile photo again. The upload should work properly now.

### If Still Having Issues:
Check the browser console for detailed error messages that can help identify any remaining configuration issues.