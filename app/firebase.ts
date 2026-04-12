import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - use actual values if available
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDkY37OLdt9W8vBdWcQi1Ivz0Tn_FaA2B4',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'estudiok-saas.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'estudiok-saas',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '134175965723',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:134175965723:web:c1bcf1de6cc7abb1416ebe',
};

// Initialize Firebase only in browser environment
let app: any;
let auth: any;
let db: any;

// Check if we have valid Firebase configuration
const hasValidConfig = firebaseConfig.apiKey && 
                      firebaseConfig.apiKey !== 'dummy-key' &&
                      firebaseConfig.authDomain &&
                      firebaseConfig.authDomain !== 'dummy.firebaseapp.com';

if (typeof window !== 'undefined' && hasValidConfig) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Fallback to empty objects to prevent crashes
    auth = {};
    db = {};
  }
} else {
  // Server-side or invalid config: create empty objects
  auth = {};
  db = {};
}

export { auth, db };