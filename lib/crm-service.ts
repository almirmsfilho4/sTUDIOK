import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface CRMContact {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: 'website' | 'referral' | 'social' | 'ads' | 'organic' | 'other';
  status: 'lead' | 'contacted' | 'qualified' | 'proposal' | 'customer' | 'inactive';
  tags: string[];
  assignedTo?: string;
  lifetimeValue: number;
  lastInteraction?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CRMInteraction {
  id: string;
  contactId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'proposal' | 'invoice' | 'support';
  subject: string;
  content: string;
  outcome?: string;
  nextAction?: string;
  nextActionDate?: Date;
  createdBy: string;
  createdAt: Date;
}

export interface CRMTask {
  id: string;
  contactId: string;
  title: string;
  description?: string;
  type: 'call' | 'email' | 'meeting' | 'followup' | 'task';
  dueDate: Date;
  completed: boolean;
  assignedTo: string;
  createdAt: Date;
}

export async function createContact(contact: Omit<CRMContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = new Date();
  const docRef = await addDoc(collection(db, 'crmContacts'), {
    ...contact,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function getContacts(filters?: { status?: string; assignedTo?: string }): Promise<CRMContact[]> {
  let q = query(collection(db, 'crmContacts'), orderBy('updatedAt', 'desc'));
  
  if (filters?.status) {
    q = query(collection(db, 'crmContacts'), where('status', '==', filters.status), orderBy('updatedAt', 'desc'));
  }
  if (filters?.assignedTo) {
    q = query(collection(db, 'crmContacts'), where('assignedTo', '==', filters.assignedTo), orderBy('updatedAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    lastInteraction: doc.data().lastInteraction?.toDate(),
  } as CRMContact));
}

export async function getContactById(contactId: string): Promise<CRMContact | null> {
  const snapshot = await getDocs(query(collection(db, 'crmContacts'), where('__name__', '==', contactId)));
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    lastInteraction: data.lastInteraction?.toDate(),
  } as CRMContact;
}

export async function addInteraction(interaction: Omit<CRMInteraction, 'id' | 'createdAt'>): Promise<string> {
  const now = new Date();
  
  const [interactionRef, contactUpdate] = await Promise.all([
    addDoc(collection(db, 'crmInteractions'), {
      ...interaction,
      createdAt: now,
    }),
    updateDoc(doc(db, 'crmContacts', interaction.contactId), {
      lastInteraction: now,
      updatedAt: now,
    })
  ]);

  return interactionRef.id;
}

export async function getInteractions(contactId: string): Promise<CRMInteraction[]> {
  const q = query(
    collection(db, 'crmInteractions'),
    where('contactId', '==', contactId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    nextActionDate: doc.data().nextActionDate?.toDate(),
  } as CRMInteraction));
}

export async function createTask(task: Omit<CRMTask, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'crmTasks'), {
    ...task,
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function getTasks(assignedTo: string, includeCompleted = false): Promise<CRMTask[]> {
  let q;
  if (includeCompleted) {
    q = query(
      collection(db, 'crmTasks'),
      where('assignedTo', '==', assignedTo),
      orderBy('dueDate', 'asc')
    );
  } else {
    q = query(
      collection(db, 'crmTasks'),
      where('assignedTo', '==', assignedTo),
      where('completed', '==', false),
      orderBy('dueDate', 'asc')
    );
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    dueDate: doc.data().dueDate?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  } as CRMTask));
}

export async function completeTask(taskId: string): Promise<void> {
  await updateDoc(doc(db, 'crmTasks', taskId), { completed: true });
}

export async function updateContactStatus(contactId: string, status: CRMContact['status']): Promise<void> {
  await updateDoc(doc(db, 'crmContacts', contactId), {
    status,
    updatedAt: new Date(),
  });
}

export async function getCRMStats(): Promise<{
  total: number;
  leads: number;
  customers: number;
  pendingTasks: number;
  interactionsThisMonth: number;
}> {
  const [contacts, tasks, interactions] = await Promise.all([
    getDocs(collection(db, 'crmContacts')),
    getDocs(query(collection(db, 'crmTasks'), where('completed', '==', false))),
    getDocs(query(collection(db, 'crmInteractions')))
  ]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const interactionsThisMonth = interactions.docs.filter(doc => {
    const createdAt = doc.data().createdAt?.toDate();
    return createdAt && createdAt >= startOfMonth;
  }).length;

  return {
    total: contacts.size,
    leads: contacts.docs.filter(d => d.data().status === 'lead').length,
    customers: contacts.docs.filter(d => d.data().status === 'customer').length,
    pendingTasks: tasks.size,
    interactionsThisMonth,
  };
}