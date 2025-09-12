# Firebase Connection Fix Guide

## 🚨 **Current Issue**
Firebase Firestore cannot connect to the backend, showing error:
```
FirebaseError: [code=unavailable]: The operation could not be completed
```

## 🔧 **Solution Steps**

### **Step 1: Verify Environment Variables**

Create or update your `.env.local` file with the correct Firebase configuration:

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

### **Step 2: Get Firebase Configuration**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ → Project Settings
4. Scroll to "Your apps" section
5. Click on the web app icon `</>`
6. Copy the configuration values from the `firebaseConfig` object

### **Step 3: Test Connection**

Visit: `http://localhost:3000/firebase-test`

This will show you exactly what's wrong with your Firebase connection.

### **Step 4: Common Issues & Solutions**

#### **Issue 1: Missing Environment Variables**
- **Symptom**: Console shows "Missing Firebase config values"
- **Solution**: Ensure all NEXT_PUBLIC_FIREBASE_* variables are set

#### **Issue 2: Wrong Project ID**
- **Symptom**: Connection fails with "project not found"
- **Solution**: Verify project ID matches your Firebase project

#### **Issue 3: Network Issues**
- **Symptom**: "Could not reach Cloud Firestore backend"
- **Solution**: Check internet connection, try different network

#### **Issue 4: Firestore Not Enabled**
- **Symptom**: Connection fails with permission errors
- **Solution**: Enable Firestore in Firebase Console

#### **Issue 5: Firestore Rules Blocking**
- **Symptom**: Connection succeeds but queries fail
- **Solution**: Update Firestore rules to allow read access

### **Step 5: Enable Firestore**

1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Choose "Start in test mode"
4. Select a location for your database

### **Step 6: Update Firestore Rules**

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if false; // Restrict write for security
    }
  }
}
```

### **Step 7: Test the Fix**

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Visit the test page:
   ```
   http://localhost:3000/firebase-test
   ```

3. Check the admin dashboard:
   ```
   http://localhost:3000/admin
   ```

## 🔍 **Debugging Commands**

### **Check Environment Variables**
```bash
# In your terminal
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

### **Test Firebase Connection**
```bash
# Visit the test page
curl http://localhost:3000/firebase-test
```

### **Check Network Connectivity**
```bash
# Test Firebase connectivity
ping firestore.googleapis.com
```

## 🚀 **Quick Fix Checklist**

- [ ] Environment variables are set correctly
- [ ] Firebase project is active and not suspended
- [ ] Firestore is enabled in Firebase Console
- [ ] Firestore rules allow read access
- [ ] Internet connection is stable
- [ ] Development server is restarted after env changes

## 📞 **If Still Having Issues**

1. **Check Firebase Status**: Visit [Firebase Status Page](https://status.firebase.google.com/)
2. **Verify Project**: Ensure your Firebase project is not suspended
3. **Check Console**: Look for detailed error messages in browser console
4. **Try Different Network**: Test with mobile hotspot or different WiFi
5. **Create New Project**: If current project has issues, create a new one

## 🎯 **Expected Results**

After fixing:
- ✅ No Firebase connection errors in console
- ✅ Admin dashboard loads data correctly
- ✅ Test page shows "Connected" status
- ✅ All Firebase operations work normally

---

**Note**: Make sure to restart your development server after updating environment variables!
