import { NextResponse } from 'next/server';
import { db } from '@/app/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { type = 'manual' } = await request.json();
    
    const collections = ['projects', 'users', 'quotes', 'portfolio', 'projectDeliveries'];
    const backupData: Record<string, any[]> = {};
    
    for (const colName of collections) {
      const snapshot = await getDocs(collection(db, colName));
      backupData[colName] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    await addDoc(collection(db, 'backups'), {
      fileName: `backup-${timestamp}.json`,
      type,
      collections: collections.length,
      records: Object.values(backupData).reduce((sum, arr) => sum + arr.length, 0),
      data: backupData,
      createdAt: serverTimestamp(),
      status: 'completed',
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `Backup realizado com ${Object.values(backupData).reduce((sum, arr) => sum + arr.length, 0)} registros`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json({ error: 'Erro ao fazer backup' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const q = query(collection(db, 'backups'), orderBy('createdAt', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    
    const backups = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        fileName: data.fileName,
        type: data.type,
        records: data.records,
        status: data.status,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
      };
    });
    
    return NextResponse.json({ backups });
  } catch (error) {
    console.error('Error listing backups:', error);
    return NextResponse.json({ error: 'Erro ao listar backups' }, { status: 500 });
  }
}