import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: Date;
  time: string;
  duration: number;
  type: 'budget' | 'followup' | 'support' | 'demo';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  meetingLink?: string;
  createdAt: Date;
}

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export function getAvailableSlots(date: Date): string[] {
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return [];
  return TIME_SLOTS;
}

export async function createAppointment(data: Omit<Appointment, 'id' | 'createdAt'>): Promise<string> {
  const q = query(
    collection(db, 'appointments'),
    where('date', '==', data.date.toISOString().split('T')[0]),
    where('time', '==', data.time),
    where('status', 'in', ['pending', 'confirmed'])
  );
  
  const existing = await getDocs(q);
  if (!existing.empty) {
    throw new Error('Horário não disponível');
  }
  
  const docRef = await addDoc(collection(db, 'appointments'), {
    ...data,
    status: 'pending',
    createdAt: new Date(),
  });
  
  return docRef.id;
}

export async function getUserAppointments(userId: string): Promise<Appointment[]> {
  const q = query(
    collection(db, 'appointments'),
    where('userId', '==', userId),
    orderBy('date', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.() || new Date(doc.data().date),
    createdAt: doc.data().createdAt?.toDate(),
  })) as Appointment[];
}

export async function confirmAppointment(appointmentId: string, meetingLink: string): Promise<void> {
  const docRef = doc(db, 'appointments', appointmentId);
  await updateDoc(docRef, {
    status: 'confirmed',
    meetingLink,
  });
}

export async function cancelAppointment(appointmentId: string): Promise<void> {
  const docRef = doc(db, 'appointments', appointmentId);
  await updateDoc(docRef, { status: 'cancelled' });
}