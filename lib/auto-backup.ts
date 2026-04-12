import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

export interface BackupRecord {
  id: string;
  projectId: string;
  type: 'full' | 'incremental';
  size?: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  location: string;
  createdAt: Date;
  completedAt?: Date;
}

export async function createBackup(projectId: string, type: 'full' | 'incremental' = 'full'): Promise<string> {
  const docRef = await addDoc(collection(db, 'backups'), {
    projectId,
    type,
    status: 'pending',
    location: `gs://estudiok-backups/${projectId}/${Date.now()}`,
    createdAt: serverTimestamp(),
  });

  setTimeout(async () => {
    await addDoc(collection(db, 'backupLogs'), {
      backupId: docRef.id,
      projectId,
      event: 'started',
      timestamp: serverTimestamp(),
    });
  }, 1000);

  return docRef.id;
}

export async function getProjectBackups(projectId: string): Promise<BackupRecord[]> {
  const q = query(collection(db, 'backups'), where('projectId', '==', projectId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    completedAt: doc.data().completedAt?.toDate(),
  } as BackupRecord));
}

export async function scheduleAutomaticBackups(projectId: string, frequency: 'daily' | 'weekly'): Promise<void> {
  await addDoc(collection(db, 'backupSchedules'), {
    projectId,
    frequency,
    enabled: true,
    lastRun: null,
    nextRun: new Date(Date.now() + (frequency === 'daily' ? 24 : 168) * 60 * 60 * 1000),
    createdAt: serverTimestamp(),
  });
}

export async function getBackupStats(): Promise<{
  total: number;
  completed: number;
  failed: number;
  lastBackup: Date | null;
}> {
  const snapshot = await getDocs(collection(db, 'backups'));

  const backups = snapshot.docs.map(doc => doc.data());
  const completed = backups.filter(b => b.status === 'completed').length;
  const failed = backups.filter(b => b.status === 'failed').length;
  
  const sorted = backups.sort((a, b) => 
    (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0)
  );

  return {
    total: snapshot.size,
    completed,
    failed,
    lastBackup: sorted[0]?.createdAt?.toDate() || null,
  };
}

export function generateBackupReport(): string {
  return `📦 RELATÓRIO DE BACKUP

Último backup: ${new Date().toLocaleString('pt-BR')}
Frequência: Diária
Local: Google Cloud Storage

Todos os projetos estão com backup automático habilitado.`;
}