import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';

export interface Session {
  id: string;
  userId: string;
  token: string;
  ip: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  active: boolean;
}

const SESSION_TIMEOUT = 30 * 60 * 1000;
const MAX_SESSIONS_PER_USER = 3;

export async function createSession(userId: string, token: string, ip: string, userAgent: string): Promise<string> {
  const existingSessions = await getUserSessions(userId);
  
if (existingSessions.length >= MAX_SESSIONS_PER_USER) {
 const oldestSession = existingSessions[existingSessions.length - 1];
 if (oldestSession) {
  await invalidateSession(oldestSession.id);
 }
}

  const expiresAt = new Date(Date.now() + SESSION_TIMEOUT);

  const docRef = await addDoc(collection(db, 'sessions'), {
    userId,
    token,
    ip,
    userAgent,
    createdAt: serverTimestamp(),
    expiresAt,
    lastActivity: serverTimestamp(),
    active: true,
  });

  return docRef.id;
}

export async function validateSession(token: string): Promise<Session | null> {
  const q = query(collection(db, 'sessions'), where('token', '==', token), where('active', '==', true));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  if (!docSnap) return null;
  const session = docSnap.data();
  const expiresAt = session.expiresAt?.toDate ? session.expiresAt.toDate() : new Date(session.expiresAt);
  const lastActivity = session.lastActivity?.toDate ? session.lastActivity.toDate() : new Date(session.lastActivity);

  if (expiresAt < new Date()) {
    await invalidateSession(docSnap.id);
    return null;
  }

  if (Date.now() - lastActivity.getTime() > SESSION_TIMEOUT) {
    await invalidateSession(docSnap.id);
    return null;
  }

  await updateDoc(doc(db, 'sessions', docSnap.id), {
    lastActivity: serverTimestamp(),
    expiresAt: new Date(Date.now() + SESSION_TIMEOUT),
  });

  return {
    id: docSnap.id,
    ...session,
    createdAt: session.createdAt?.toDate(),
    expiresAt,
    lastActivity,
  } as Session;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await updateDoc(doc(db, 'sessions', sessionId), {
    active: false,
  });
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
  const q = query(collection(db, 'sessions'), where('userId', '==', userId), where('active', '==', true));
  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    await updateDoc(docSnap.ref, { active: false });
  }
}

export async function getUserSessions(userId: string): Promise<Session[]> {
  const q = query(collection(db, 'sessions'), where('userId', '==', userId), where('active', '==', true));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    expiresAt: doc.data().expiresAt?.toDate(),
    lastActivity: doc.data().lastActivity?.toDate(),
  } as Session));
}

export async function cleanupExpiredSessions(): Promise<number> {
  const q = query(collection(db, 'sessions'), where('active', '==', true));
  const snapshot = await getDocs(q);

  let cleaned = 0;
  const now = new Date();

  for (const docSnap of snapshot.docs) {
    const expiresAt = docSnap.data().expiresAt?.toDate ? docSnap.data().expiresAt.toDate() : new Date(docSnap.data().expiresAt);
    
    if (expiresAt < now) {
      await updateDoc(docSnap.ref, { active: false });
      cleaned++;
    }
  }

  return cleaned;
}

export function getTimeUntilExpiration(lastActivity: Date): number {
  const diff = Date.now() - lastActivity.getTime();
  return Math.max(0, SESSION_TIMEOUT - diff);
}

export function formatTimeRemaining(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function isSessionExpiringSoon(lastActivity: Date): boolean {
  const timeRemaining = getTimeUntilExpiration(lastActivity);
  return timeRemaining < 5 * 60 * 1000;
}