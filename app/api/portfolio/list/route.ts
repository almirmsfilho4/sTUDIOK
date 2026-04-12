import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const portfolioRef = collection(db, 'portfolio');
    const q = query(portfolioRef, orderBy('createdAt', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json([], { status: 500 });
  }
}