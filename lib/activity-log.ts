import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';

export interface ActivityLogEntry {
  id: string;
  entityType: 'project' | 'user' | 'quote' | 'ticket' | 'payment';
  entityId: string;
  action: string;
  description: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export async function logActivity(entry: Omit<ActivityLogEntry, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'activityLogs'), {
    ...entry,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getEntityActivities(entityType: string, entityId: string, limitCount = 50): Promise<ActivityLogEntry[]> {
  const q = query(
    collection(db, 'activityLogs'),
    where('entityType', '==', entityType),
    where('entityId', '==', entityId),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(q);
  const entries = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as ActivityLogEntry));

  return limitCount ? entries.slice(0, limitCount) : entries;
}

export async function getUserActivities(userId: string, limitCount = 20): Promise<ActivityLogEntry[]> {
  const q = query(
    collection(db, 'activityLogs'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(q);
  const entries = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as ActivityLogEntry));

  return limitCount ? entries.slice(0, limitCount) : entries;
}

export async function getRecentActivities(limitCount = 20): Promise<ActivityLogEntry[]> {
  const q = query(
    collection(db, 'activityLogs'),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.slice(0, limitCount).map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as ActivityLogEntry));
}

export function formatActivityDescription(entry: ActivityLogEntry): string {
  const time = entry.createdAt?.toLocaleTimeString('pt-BR') || '';
  
  return `[${time}] ${entry.description}`;
}

export function groupActivitiesByDate(entries: ActivityLogEntry[]): { date: string; entries: ActivityLogEntry[] }[] {
  const groups: Record<string, ActivityLogEntry[]> = {};
  
  entries.forEach(entry => {
    const date = entry.createdAt?.toLocaleDateString('pt-BR') || 'Desconhecido';
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
  });

  return Object.entries(groups).map(([date, entries]) => ({ date, entries }));
}

export const ACTIVITY_ACTIONS = {
  project: {
    created: 'Projeto criado',
    updated: 'Projeto atualizado',
    delivered: 'Projeto entregue',
    completed: 'Projeto concluído',
    cancelled: 'Projeto cancelado',
  },
  quote: {
    created: 'Orçamento solicitado',
    viewed: 'Orçamento visualizado',
    responded: 'Orçamento respondido',
    converted: 'Convertido em projeto',
  },
  user: {
    login: 'Usuário logou',
    logout: 'Usuário saiu',
    registered: 'Novo usuário registrado',
    updated: 'Perfil atualizado',
  },
  payment: {
    created: 'Pagamento criado',
    completed: 'Pagamento recebido',
    failed: 'Pagamento falhou',
    refunded: 'Pagamento reembolsado',
  },
};