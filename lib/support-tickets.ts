import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: 'bug' | 'duvida' | 'ajuste' | 'financeiro' | 'outro';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  messages: TicketMessage[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'cliente' | 'admin';
  content: string;
  createdAt: Date;
}

export async function createTicket(data: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'supportTickets'), {
    ...data,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

export async function getUserTickets(userId: string): Promise<SupportTicket[]> {
  const q = query(
    collection(db, 'supportTickets'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      resolvedAt: data.resolvedAt?.toDate(),
    } as SupportTicket;
  });
}

export async function getAllTickets(): Promise<SupportTicket[]> {
  const q = query(collection(db, 'supportTickets'), orderBy('createdAt', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      resolvedAt: data.resolvedAt?.toDate(),
    } as SupportTicket;
  });
}

export async function addTicketMessage(ticketId: string, message: Omit<TicketMessage, 'id' | 'createdAt'>): Promise<void> {
  const ticketRef = doc(db, 'supportTickets', ticketId);
  const ticketDoc = await getDocs(query(collection(db, 'supportTickets'), where('__name__', '==', ticketId)));
  
if (ticketDoc.empty) return;

 const doc0 = ticketDoc.docs[0];
 if (!doc0) return;
 const currentData = doc0.data();
 const messages = currentData.messages || [];
  messages.push({
    ...message,
    id: Date.now().toString(),
    createdAt: new Date(),
  });
  
  await updateDoc(ticketRef, {
    messages,
    updatedAt: new Date(),
    status: message.senderType === 'cliente' ? 'in_progress' : 'waiting',
  });
}

export async function updateTicketStatus(ticketId: string, status: SupportTicket['status']): Promise<void> {
  const ticketRef = doc(db, 'supportTickets', ticketId);
  await updateDoc(ticketRef, {
    status,
    updatedAt: new Date(),
    ...(status === 'resolved' || status === 'closed' ? { resolvedAt: new Date() } : {}),
  });
}

export async function closeOldTickets(): Promise<number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const q = query(
    collection(db, 'supportTickets'),
    where('status', '==', 'resolved'),
    where('updatedAt', '<', thirtyDaysAgo)
  );
  
  const snapshot = await getDocs(q);
  let closed = 0;
  
  for (const docSnap of snapshot.docs) {
    await updateDoc(docSnap.ref, { status: 'closed' });
    closed++;
  }
  
  return closed;
}