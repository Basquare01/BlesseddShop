/**
 * Firebase client initializer for BlessedShop
 *
 * Usage:
 * - Put your Firebase config in `js/firebase.js` (variable `firebaseConfig`).
 * - This file will initialize Firebase (compat SDK) if a valid config is present
 *   and expose `window.fb = { auth, db, storage }` for other scripts to use.
 * - If no valid config is present, `window.fb` will be null and the app will
 *   continue to use localStorage fallback.
 */

(function () {
    try {
        // firebaseConfig should be defined in js/firebase.js
        if (typeof firebaseConfig === 'undefined' || !firebaseConfig || firebaseConfig.apiKey === 'YOUR_API_KEY') {
            console.info('Firebase config not found or still placeholder. Firestore disabled; using localStorage fallback.');
            window.fb = null;
            return;
        }

        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK not loaded. Please include Firebase scripts before this file.');
            window.fb = null;
            return;
        }

        // Initialize Firebase app (compat)
        if (!firebase.apps || firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }

        const auth = firebase.auth();
        const db = firebase.firestore();
        const storage = firebase.storage();

        // Expose shorthand
        window.fb = { auth, db, storage, firebase };

        console.info('Firebase initialized. Firestore and Storage available via window.fb');
    } catch (err) {
        console.error('Error initializing Firebase client:', err);
        window.fb = null;
    }
})();
