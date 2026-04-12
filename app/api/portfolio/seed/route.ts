import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDkY37OLdt9W8vBdWcQi1Ivz0Tn_FaA2B4',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'estudiok-saas.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'estudiok-saas',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, image, description, url, client } = body;

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const docRef = await addDoc(collection(db, 'portfolio'), {
      title: title || 'Menos Imposto',
      category: category || 'SaaS',
      image: image || '/portfolio/MENOSIMPOSTO.png',
      description: description || 'Sistema de gestão tributária inteligente',
      url: url || 'https://menos-imposto.vercel.app/',
      client: client || 'Menos Imposto',
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      message: 'Portfolio item added successfully' 
    });
  } catch (error) {
    console.error('Error adding portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to add portfolio item' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to add portfolio item',
    example: {
      title: 'Menos Imposto',
      category: 'SaaS',
      image: '/portfolio/MENOSIMPOSTO.png',
      description: 'Sistema de gestão tributária inteligente',
      url: 'https://menos-imposto.vercel.app/',
      client: 'Menos Imposto'
    }
  });
}
