import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { title, category, description, image, url, client, technologies } = body;
    
    if (!title || !category || !description || !image) {
      return NextResponse.json(
        { error: 'Título, categoria, descrição e imagem são obrigatórios' },
        { status: 400 }
      );
    }
    
    console.log('Firebase config:', {
      apiKey: firebaseConfig.apiKey ? 'PRESENT' : 'MISSING',
      projectId: firebaseConfig.projectId,
      hasAllConfig: !!(firebaseConfig.apiKey && firebaseConfig.projectId)
    });
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('Firestore initialized');
    
    const projectData = {
      title,
      category,
      description,
      image,
      url: url || '',
      client: client || '',
      technologies: technologies || '',
      createdAt: new Date(),
      status: 'published',
      _admin_key: 'estudiok-2026-admin-portfolio'
    };
    
    const docRef = await addDoc(collection(db, 'portfolio'), projectData);
    
    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: 'Projeto adicionado com sucesso'
    });
  } catch (error) {
    console.error('Error adding portfolio project:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao adicionar projeto',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}