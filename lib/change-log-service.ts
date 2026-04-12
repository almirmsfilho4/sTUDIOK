import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

export interface ChangeLogEntry {
  id: string;
  projectId: string;
  type: 'addition' | 'modification' | 'deletion' | 'fix' | 'feature';
  category: string;
  title: string;
  description: string;
  files?: string[];
  requesterId?: string;
  requesterName?: string;
  implementerId?: string;
  implementerName?: string;
  status: 'requested' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
  completedAt?: Date;
}

export async function addChangeLogEntry(entry: Omit<ChangeLogEntry, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'changeLogs'), {
    ...entry,
    createdAt: serverTimestamp(),
  });

  if (entry.requesterId) {
    await addDoc(collection(db, 'notifications'), {
      userId: entry.requesterId,
      type: 'change_request',
      title: 'Solicitação registrada',
      message: `Sua solicitação "${entry.title}" foi registrada`,
      read: false,
      createdAt: serverTimestamp(),
    });
  }

  return docRef.id;
}

export async function getProjectChangeLogs(projectId: string): Promise<ChangeLogEntry[]> {
  const q = query(
    collection(db, 'changeLogs'),
    where('projectId', '==', projectId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    completedAt: doc.data().completedAt?.toDate(),
  } as ChangeLogEntry));
}

export async function updateChangeLogStatus(
  entryId: string,
  status: ChangeLogEntry['status'],
  actualHours?: number
): Promise<void> {
  const { updateDoc, doc } = await import('firebase/firestore');
  
  const updateData: any = { status };
  if (actualHours) updateData.actualHours = actualHours;
  if (status === 'completed') updateData.completedAt = new Date();

  await updateDoc(doc(db, 'changeLogs', entryId), updateData);
}

export async function getChangeLogStats(projectId: string): Promise<{
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  totalHours: number;
}> {
  const logs = await getProjectChangeLogs(projectId);

  return {
    total: logs.length,
    completed: logs.filter(l => l.status === 'completed').length,
    inProgress: logs.filter(l => l.status === 'in_progress').length,
    pending: logs.filter(l => l.status === 'requested' || l.status === 'approved').length,
    totalHours: logs.reduce((acc, l) => acc + (l.actualHours || 0), 0),
  };
}

export async function approveChangeRequest(entryId: string): Promise<void> {
  await updateChangeLogStatus(entryId, 'approved');
}

export async function rejectChangeRequest(entryId: string): Promise<void> {
  await updateChangeLogStatus(entryId, 'rejected');
}

export async function completeChangeRequest(entryId: string, hours: number): Promise<void> {
  await updateChangeLogStatus(entryId, 'completed', hours);
}

export function generateChangeLogReport(logs: ChangeLogEntry[]): string {
  return logs.map(log => {
    const date = log.createdAt?.toLocaleDateString('pt-BR') || '';
    return `[${date}] ${log.type.toUpperCase()}: ${log.title} - ${log.status}`;
  }).join('\n');
}