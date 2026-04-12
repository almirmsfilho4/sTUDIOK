import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp, increment } from 'firebase/firestore';

interface RateLimitEntry {
  id: string;
  ip: string;
  endpoint: string;
  attempts: number;
  blocked: boolean;
  blockedUntil?: Date;
  firstAttempt: Date;
  lastAttempt: Date;
}

const RATE_LIMITS = {
  login: { attempts: 5, windowMinutes: 15, blockMinutes: 30 },
  register: { attempts: 3, windowMinutes: 60, blockMinutes: 60 },
  api: { attempts: 100, windowMinutes: 1, blockMinutes: 5 },
  default: { attempts: 50, windowMinutes: 1, blockMinutes: 5 },
};

const ipCache: Map<string, { count: number; resetTime: number }> = new Map();

export async function checkRateLimit(ip: string, action: string): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const limit = RATE_LIMITS[action as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
  const now = Date.now();
  const windowMs = limit.windowMinutes * 60 * 1000;

  const cached = ipCache.get(ip);
  
  if (cached && now < cached.resetTime) {
    const remaining = Math.max(0, limit.attempts - cached.count);
    if (cached.count >= limit.attempts) {
      return { allowed: false, remaining: 0, resetIn: cached.resetTime - now };
    }
    cached.count++;
    return { allowed: true, remaining: remaining - 1, resetIn: cached.resetTime - now };
  }

  ipCache.set(ip, { count: 1, resetTime: now + windowMs });
  return { allowed: true, remaining: limit.attempts - 1, resetIn: windowMs };
}

export async function recordFailedAttempt(ip: string, action: string): Promise<void> {
  const limit = RATE_LIMITS[action as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
  const cached = ipCache.get(ip);

  if (cached) {
    cached.count++;
  }

  try {
    const q = query(collection(db, 'rateLimits'), where('ip', '==', ip), where('action', '==', action));
    const snapshot = await getDocs(q);

if (snapshot.empty) {
    await addDoc(collection(db, 'rateLimits'), {
      ip,
      action,
      attempts: 1,
      blocked: false,
      firstAttempt: serverTimestamp(),
      lastAttempt: serverTimestamp(),
    });
  } else {
    const doc = snapshot.docs[0];
    if (!doc) return;
    const docRef = doc.ref;
    const data = doc.data();
    const newAttempts = data.attempts + 1;
    const blocked = newAttempts >= limit.attempts;

    await updateDoc(docRef, {
      attempts: newAttempts,
      lastAttempt: serverTimestamp(),
      blocked,
      blockedUntil: blocked ? new Date(Date.now() + limit.blockMinutes * 60 * 1000) : null,
    });
  }
  } catch (error) {
    console.error('Rate limit error:', error);
  }
}

export async function isIPBlocked(ip: string): Promise<boolean> {
  try {
    const q = query(collection(db, 'rateLimits'), where('ip', '==', ip), where('blocked', '==', true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return false;

    const doc = snapshot.docs[0];
    if (!doc) return false;
    const data = doc.data();
    if (data.blockedUntil) {
      const blockedUntil = data.blockedUntil.toDate ? data.blockedUntil.toDate() : new Date(data.blockedUntil);
      if (blockedUntil < new Date()) {
        await updateDoc(doc.ref, { blocked: false, attempts: 0 });
        return false;
      }
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function getClientIP(request: Request): string {
 const forwarded = request.headers.get('x-forwarded-for');
 if (forwarded) {
  const parts = forwarded.split(',');
  return parts[0]?.trim() || 'unknown';
 }
 return request.headers.get('x-real-ip') || 'unknown';
}

export function resetRateLimit(ip: string): void {
  ipCache.delete(ip);
}

export function getRateLimitStatus(ip: string): { attempts: number; blocked: boolean } {
  const cached = ipCache.get(ip);
  return {
    attempts: cached?.count || 0,
    blocked: cached ? cached.count >= 50 : false,
  };
}