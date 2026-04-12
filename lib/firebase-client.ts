import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Client-side Firebase initialization
export function getFirebaseClient() {
  if (typeof window === 'undefined') {
    // Server-side: return empty objects
    return { auth: null, db: null };
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    return {
      auth: getAuth(app),
      db: getFirestore(app)
    };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return { auth: null, db: null };
  }
}