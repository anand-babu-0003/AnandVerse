# Firebase Setup Guide

## 🚨 **Current Issue**
Your application is getting a Firestore connection error because Firebase environment variables are not configured.

## 🔧 **Solution Steps**

### **1. Create Environment Variables File**

Create a `.env.local` file in your project root with the following content:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=your_ga_id

# Optional: Site Verification
GOOGLE_SITE_VERIFICATION=your_verification_code
YANDEX_VERIFICATION=your_yandex_code
YAHOO_VERIFICATION=your_yahoo_code
```

### **2. Get Firebase Configuration Values**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on the gear icon ⚙️ → Project Settings
4. Scroll down to "Your apps" section
5. Click on the web app icon `</>`
6. Copy the configuration values from the `firebaseConfig` object

### **3. Configure Firestore Rules**

In Firebase Console:
1. Go to Firestore Database
2. Click on "Rules" tab
3. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents for now
    match /{document=**} {
      allow read: if true;
      allow write: if false; // Restrict write access for security
    }
  }
}
```

### **4. Enable Firestore**

1. In Firebase Console, go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database

### **5. Test Connection**

After setting up the environment variables:

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Check the browser console for Firebase connection status
3. Visit your admin dashboard to test Firestore connectivity

## 🔍 **Troubleshooting**

### **If you still get connection errors:**

1. **Check Network Connection**: Ensure you have a stable internet connection
2. **Verify Project ID**: Make sure the project ID is correct
3. **Check Firebase Status**: Visit [Firebase Status Page](https://status.firebase.google.com/)
4. **Clear Browser Cache**: Clear your browser cache and cookies
5. **Check Firestore Rules**: Ensure your Firestore rules allow read access

### **Common Issues:**

- **Invalid API Key**: Double-check the API key in Firebase Console
- **Wrong Project ID**: Verify the project ID matches your Firebase project
- **Network Issues**: Check if your firewall or network blocks Firebase
- **Firestore Not Enabled**: Make sure Firestore is enabled in your Firebase project

## 🚀 **Next Steps**

1. Set up the environment variables
2. Configure Firestore rules
3. Test the connection
4. If successful, you can start using the admin dashboard

## 📞 **Need Help?**

If you continue to have issues:
1. Check the browser console for more detailed error messages
2. Verify your Firebase project is active and not suspended
3. Ensure you have the correct permissions for the Firebase project
4. Try creating a new Firebase project if the current one has issues

---

**Note**: Make sure to never commit your `.env.local` file to version control as it contains sensitive information.
