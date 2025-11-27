# Firebase Setup Guide for BlessedShop

This guide walks you through creating a Firebase project and connecting it to BlessedShop.

---

## Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Open your browser and go to: https://console.firebase.google.com/
   - Sign in with your Google account (create one if needed)

2. **Create a New Project**
   - Click the **"Create a project"** button (or **"Add project"**)
   - Enter a project name, e.g., `BlessedShop` or `BlessedShop-ecom`
   - Click **Continue**

3. **Enable Google Analytics (Optional)**
   - You can skip this for now by unchecking the box
   - Click **Create project**
   - Wait for the project to initialize (1-2 minutes)

4. **You're in the Firebase Console**
   - You should see a dashboard with options like "Web", "iOS", "Android"
   - Click the **Web icon** (`</>`  or **Add app** → Web)

---

## Step 2: Register Your Web App and Get Firebase Config

1. **Register the Web App**
   - In the Firebase Console, look for **Project settings** (gear icon in top-left)
   - Click **Project settings**
   - Go to the **Your apps** section at the bottom
   - If no apps are listed, click **Add app** → **Web** (`</>`)
   - Enter an app name, e.g., `BlessedShop Web`
   - Check "Also set up Firebase Hosting for this app" (optional; we'll use Netlify/Vercel instead, so you can skip this)
   - Click **Register app**

2. **Copy Your Firebase Config**
   - You'll see a code snippet that looks like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyD_xxx...",
     authDomain: "blessedshop-xyz.firebaseapp.com",
     projectId: "blessedshop-xyz",
     storageBucket: "blessedshop-xyz.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123def456"
   };
   ```
   - **Copy this entire object** (including the curly braces `{}`)
   - **Do NOT share this with anyone** — it's semi-public (the `apiKey` is client-side and safe, but keep it private)

3. **Paste into BlessedShop**
   - Open this file in your code editor: `js/firebase.js`
   - Find the line:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```
   - **Replace the entire `firebaseConfig` object with your actual config** from Firebase
   - **Save the file**

   Example of what it should look like after:
   ```javascript
   const firebaseConfig = {
       apiKey: "AIzaSyD_xxx...",
       authDomain: "blessedshop-xyz.firebaseapp.com",
       projectId: "blessedshop-xyz",
       storageBucket: "blessedshop-xyz.appspot.com",
       messagingSenderId: "123456789",
       appId: "1:123456789:web:abc123def456"
   };
   ```

---

## Step 3: Enable Firestore Database

1. **In the Firebase Console, on the left sidebar:**
   - Click **Build** → **Firestore Database**

2. **Create Database**
   - Click **Create database**
   - Choose location closest to you (e.g., `us-central1` for USA, `europe-west1` for Europe)
   - For the security rules, select **Start in test mode** (we'll secure it later)
   - Click **Create**
   - Wait for it to initialize (1-2 minutes)

3. **You now have a Firestore Database**
   - You should see a database interface with collections listed
   - It will be empty for now — orders will appear here once you start using the app

---

## Step 4: Enable Firebase Storage

1. **In the Firebase Console, on the left sidebar:**
   - Click **Build** → **Storage**

2. **Create Storage Bucket**
   - Click **Get started**
   - Select location (same as your Firestore location is recommended)
   - For security rules, select **Start in test mode**
   - Click **Done**
   - Wait for initialization (1-2 minutes)

3. **You now have Storage enabled**
   - Payment proof images will be uploaded here

---

## Step 5: (Optional but Recommended) Enable Firebase Authentication

1. **In the Firebase Console, on the left sidebar:**
   - Click **Build** → **Authentication**

2. **Set Up Sign-In Method**
   - Click **Get started** or **Set up sign-in method**
   - Click on **Email/Password**
   - Toggle **Enable** to ON
   - Click **Save**

3. **Create Admin Account (Optional for testing)**
   - Go to **Users** tab
   - Click **Add user**
   - Email: `admin@blessedshop.com`
   - Password: `admin123` (or your preferred password)
   - Click **Add user**
   - This lets you test login on your site

---

## Step 6: Set Firestore Security Rules (Important for Production)

### For Testing (Current Setup)

Right now you're in **test mode**, which means:
- ✅ Anyone can read and write to your database for 30 days
- This is fine for development/testing
- **After 30 days, Firestore will disable test mode** — you must set proper rules

### For Production (When Going Live)

1. **In Firebase Console → Firestore Database:**
   - Click **Rules** tab

2. **Replace the entire content with this ruleset:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to create pending orders and upload payment proofs
    match /pendingBankTransfers/{document=**} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow update, delete: if request.auth.token.email == 'admin@blessedshop.com';
    }

    // Only admin can read/write to completed orders
    match /orders/{document=**} {
      allow read, write: if request.auth.token.email == 'admin@blessedshop.com';
    }

    // Rejected orders (only admin)
    match /rejectedOrders/{document=**} {
      allow read, write: if request.auth.token.email == 'admin@blessedshop.com';
    }

    // Email logs (only admin)
    match /emailLog/{document=**} {
      allow read, write: if request.auth.token.email == 'admin@blessedshop.com';
    }

    // Admin notifications (only admin)
    match /adminNotifications/{document=**} {
      allow read, write: if request.auth.token.email == 'admin@blessedshop.com';
    }

    // Receipts (only admin)
    match /receipts/{document=**} {
      allow read, write: if request.auth.token.email == 'admin@blessedshop.com';
    }

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Click Publish**

**Note:** These rules require Firebase Authentication. Once you enable auth and create the admin user with email `admin@blessedshop.com`, the rules will enforce that only the admin can verify/reject/view orders.

---

## Step 7: Set Firebase Storage Security Rules

1. **In Firebase Console → Storage:**
   - Click **Rules** tab

2. **Replace the content with this ruleset:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload payment proofs
    match /paymentProofs/{allPaths=**} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow delete: if request.auth.token.email == 'admin@blessedshop.com';
    }

    // Default deny
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Click Publish**

---

## Step 8: Test the Firebase Integration

1. **Open your BlessedShop site in a browser**
   - Open `index.html` or any page
   - Open DevTools Console (F12)
   - Look for a message like:
     ```
     Firebase initialized. Firestore and Storage available via window.fb
     ```
   - If you see this, Firebase is connected ✅

2. **If you see an error:**
   - Check that your Firebase config in `js/firebase.js` matches the one from Firebase Console
   - Make sure Firestore and Storage are enabled
   - Refresh the page

3. **Test Firestore write (for testing only):**
   - Paste this into the DevTools Console:
   ```javascript
   (async () => {
     if (!window.fb || !fb.db) { 
       console.error('Firebase not initialized'); 
       return; 
     }
     try {
       const testDoc = await fb.db.collection('pendingBankTransfers').doc('TEST_ORDER_001').set({
         id: 'TEST_ORDER_001',
         customer: { email: 'test@example.com', firstName: 'Test', lastName: 'User' },
         amounts: { total: 1000 },
         createdAt: new Date().toISOString(),
         status: 'pending_verification'
       });
       console.log('Test order written to Firestore ✓');
     } catch (err) {
       console.error('Error writing test order:', err);
     }
   })();
   ```
   - If successful, you'll see: `Test order written to Firestore ✓`
   - Open `admin.html` (logged in as admin) — the test order should appear in the Pending Orders table

---

## Step 9: Migrate Existing Orders from localStorage to Firestore

If you have pending orders already saved in `localStorage` and want to move them to Firestore:

1. **Open `debug.html` in your browser**

2. **Click "⏳ View Pending Orders"** to see what you have locally

3. **Paste this into the DevTools Console to copy them to Firestore:**
```javascript
(async () => {
  if (!window.fb || !fb.db) { 
    console.error('Firebase not initialized'); 
    return; 
  }
  const pending = JSON.parse(localStorage.getItem('pendingBankTransfers')) || [];
  console.log(`Copying ${pending.length} orders to Firestore...`);
  for (const order of pending) {
    try {
      await fb.db.collection('pendingBankTransfers').doc(order.id).set(order);
      console.log(`✓ Saved: ${order.id}`);
    } catch (err) {
      console.error(`✗ Error saving ${order.id}:`, err);
    }
  }
  console.log('Migration complete!');
})();
```

4. **After running, open `admin.html` (logged in as admin)**
   - Your pending orders should now appear in the Firestore listener
   - When you refresh the page, orders persist (because they're in Firestore, not just localStorage)

---

## Step 10: Deploy to Netlify or Vercel (Next)

Once Firebase is set up and working locally:

1. **Push your code to GitHub**
   - Create a repo on GitHub
   - Commit and push your code

2. **Deploy to Netlify or Vercel**
   - Connect your GitHub repo to Netlify or Vercel (both are free)
   - No build step needed (your site is static HTML)
   - Your Firebase config is now part of the deployed site
   - Users can access the live site and create orders in your production Firestore

**Security Note:** Your Firebase config (especially `apiKey`) is public once deployed. This is by design — the security comes from Firestore rules, not from hiding the config.

---

## Quick Reference: Key Firebase Concepts

| Term | What It Does |
|------|-------------|
| **Firestore Database** | Cloud database storing your orders and data as JSON documents in collections |
| **Firebase Storage** | Cloud storage for files (payment proof images) |
| **Firebase Auth** | User authentication (optional; we use email/password) |
| **Security Rules** | Rules that control who can read/write to Firestore and Storage |
| **Test Mode** | Temporary mode (30 days) where anyone can read/write; fine for development |
| **Production Mode** | Rules-based security; only people with proper permissions can access data |

---

## Troubleshooting

**Q: I see "Firebase config not found or still placeholder"**
- A: Your `firebaseConfig` in `js/firebase.js` still has placeholder values. Replace it with your actual config from Firebase Console.

**Q: Admin doesn't see pending orders in Firestore**
- A: Make sure:
  1. Orders are actually in Firestore (check Firebase Console → Firestore → `pendingBankTransfers` collection)
  2. Admin is logged in as `admin@blessedshop.com`
  3. Firestore listener is running (check DevTools console for errors)
  4. Rules allow admin to read from `pendingBankTransfers`

**Q: "Firestore and Storage available via window.fb" but pending orders don't show**
- A: Orders are still in localStorage. Migrate them using the console snippet in Step 9, or create a new test order via checkout (new orders will go to Firestore).

**Q: 30-day test mode expired**
- A: Firestore will disable writes. Switch to production rules or restart test mode in Firebase Console → Firestore → Rules → check the test mode status.

---

## Next Steps

Once your Firebase is set up and working:
1. ✅ Admin can see pending orders from Firestore
2. ✅ Admin can verify/reject orders
3. Next: Update `js/payment.js` to save new orders directly to Firestore (instead of localStorage)
4. Next: Deploy to Netlify/Vercel
5. Next: Set up Cloud Functions for email notifications (optional advanced step)

---

## Need Help?

- **Firebase Docs:** https://firebase.google.com/docs
- **Firestore Security Rules:** https://firebase.google.com/docs/firestore/security/get-started
- **Firebase Storage Rules:** https://firebase.google.com/docs/storage/security/start

