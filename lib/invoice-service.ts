import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface Invoice {
  id?: string;
  number: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientDocument: string;
  clientAddress: string;
  projectId?: string;
  projectName?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'issued' | 'paid' | 'cancelled' | 'overdue';
  dueDate: Date;
  issuedAt?: Date;
  paidAt?: Date;
  paymentMethod?: string;
  notes?: string;
  createdAt: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export async function generateInvoiceNumber(): Promise<string> {
  const snapshot = await getDocs(query(collection(db, 'invoices'), orderBy('createdAt', 'desc'), where('number', '!=', '')));
  const lastNumber = snapshot.docs[0]?.data()?.number || '0000';
  const num = parseInt(lastNumber.replace(/\D/g, '')) || 0;
  return String(num + 1).padStart(5, '0');
}

export async function createInvoice(data: Omit<Invoice, 'id' | 'createdAt' | 'number'>): Promise<string> {
  const number = await generateInvoiceNumber();
  const docRef = await addDoc(collection(db, 'invoices'), {
    ...data,
    number: `NF-${number}`,
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function getInvoices(clientId?: string): Promise<Invoice[]> {
  const q = clientId 
    ? query(collection(db, 'invoices'), where('clientId', '==', clientId), orderBy('createdAt', 'desc'))
    : query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    dueDate: doc.data().dueDate?.toDate(),
    issuedAt: doc.data().issuedAt?.toDate(),
    paidAt: doc.data().paidAt?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as Invoice[];
}

export async function updateInvoiceStatus(id: string, status: Invoice['status'], paidAt?: Date): Promise<void> {
  const docRef = doc(db, 'invoices', id);
  await updateDoc(docRef, {
    status,
    ...(paidAt && { paidAt }),
  });
}

export async function getInvoiceStats() {
  const invoices = await getInvoices();
  
  const total = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pending = invoices.filter(inv => inv.status === 'issued' || inv.status === 'draft').reduce((sum, inv) => sum + inv.total, 0);
  const overdue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);

  return { total, paid, pending, overdue, count: invoices.length };
}