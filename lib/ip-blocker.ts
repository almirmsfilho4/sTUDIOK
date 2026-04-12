import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';

export interface BlockedIP {
  id: string;
  ip: string;
  reason: string;
  blockedBy?: string;
  blockedAt: Date;
  expiresAt?: Date;
  permanent: boolean;
}

const BLOCK_DURATION = 24 * 60 * 60 * 1000;

export async function blockIP(ip: string, reason: string, permanent = false, blockedBy?: string): Promise<string> {
  const expiresAt = permanent ? null : new Date(Date.now() + BLOCK_DURATION);

  const docRef = await addDoc(collection(db, 'blockedIPs'), {
    ip,
    reason,
    blockedBy,
    blockedAt: serverTimestamp(),
    expiresAt,
    permanent,
  });

  return docRef.id;
}

export async function unblockIP(ip: string): Promise<void> {
  const q = query(collection(db, 'blockedIPs'), where('ip', '==', ip));
  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    await updateDoc(docSnap.ref, { permanent: false, expiresAt: new Date() });
  }
}

export async function isIPBlocked(ip: string): Promise<boolean> {
  const q = query(collection(db, 'blockedIPs'), where('ip', '==', ip));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return false;

  const doc = snapshot.docs[0];
  if (!doc) return false;
  const data = doc.data();

  if (data.permanent) return true;

  if (data.expiresAt) {
    const expiresAt = data.expiresAt.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt);
    if (expiresAt < new Date()) {
      await unblockIP(ip);
      return false;
    }
    return true;
  }

  return false;
}

export async function getBlockedIPs(): Promise<BlockedIP[]> {
  const snapshot = await getDocs(collection(db, 'blockedIPs'));
  
  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
      blockedAt: doc.data().blockedAt?.toDate(),
      expiresAt: doc.data().expiresAt?.toDate(),
    } as BlockedIP))
    .filter(block => block.permanent || (block.expiresAt && block.expiresAt > new Date()));
}

export async function autoBlockSuspiciousIP(ip: string, reason: string): Promise<void> {
  const existingAttempts = await getFailedAttempts(ip);
  
  if (existingAttempts >= 10) {
    await blockIP(ip, reason + ' - Automatic block after 10 failed attempts', true);
  }
}

async function getFailedAttempts(ip: string): Promise<number> {
  const { getDocs, collection, query, where } = await import('firebase/firestore');
  const q = query(collection(db, 'securityEvents'), where('ip', '==', ip));
  const snapshot = await getDocs(q);
  
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return snapshot.docs.filter(doc => {
    const data = doc.data();
    const createdAt = data.createdAt?.toDate();
    return data.type === 'failed_login' && createdAt && createdAt > oneDayAgo;
  }).length;
}

export async function cleanupExpiredBlocks(): Promise<number> {
  const blocked = await getBlockedIPs();
  let cleaned = 0;

  for (const block of blocked) {
    if (!block.permanent && block.expiresAt && block.expiresAt < new Date()) {
      await unblockIP(block.ip);
      cleaned++;
    }
  }

  return cleaned;
}

export function getClientIPFromRequest(headers: Headers): string {
 const forwarded = headers.get('x-forwarded-for');
 if (forwarded) {
  const parts = forwarded.split(',');
  return parts[0]?.trim() || 'unknown';
 }
 return headers.get('x-real-ip') || 'unknown';
}

export const SUSPICIOUS_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /burp/i,
  /wpscan/i,
  /acunetix/i,
  /netsparker/i,
  /appscan/i,
  /havij/i,
  /pangolin/i,
];

export function detectSuspiciousUserAgent(userAgent: string): boolean {
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(userAgent));
}