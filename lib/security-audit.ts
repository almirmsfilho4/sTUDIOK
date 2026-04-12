import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';

export interface SecurityEvent {
  id: string;
  type: 'login_success' | 'login_failed' | 'logout' | 'register' | 'password_change' | 'failed_login' | 'suspicious_activity' | 'rate_limit_exceeded' | 'ip_blocked';
  userId?: string;
  userEmail?: string;
  ip: string;
  userAgent: string;
  details?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
}

export async function logSecurityEvent(event: Omit<SecurityEvent, 'id'>): Promise<string> {
 const docRef = await addDoc(collection(db, 'securityEvents'), {
  ...event,
  createdAt: serverTimestamp(),
 } as unknown as SecurityEvent);

  if (event.severity === 'high' || event.severity === 'critical') {
    await sendSecurityAlert(event);
  }

  return docRef.id;
}

export async function getSecurityEvents(filters?: {
  type?: string;
  userId?: string;
  ip?: string;
  severity?: string;
}): Promise<SecurityEvent[]> {
  let q = query(collection(db, 'securityEvents'), orderBy('createdAt', 'desc'), limit(100));

  const snapshot = await getDocs(q);
  let events = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as SecurityEvent));

  if (filters?.type) {
    events = events.filter(e => e.type === filters.type);
  }
  if (filters?.userId) {
    events = events.filter(e => e.userId === filters.userId);
  }
  if (filters?.ip) {
    events = events.filter(e => e.ip === filters.ip);
  }
  if (filters?.severity) {
    events = events.filter(e => e.severity === filters.severity);
  }

  return events;
}

export async function getFailedLoginAttempts(ip: string, hours = 24): Promise<number> {
  const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
  const q = query(
    collection(db, 'securityEvents'),
    where('type', '==', 'failed_login'),
    where('ip', '==', ip)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.filter(doc => {
    const createdAt = doc.data().createdAt?.toDate();
    return createdAt && createdAt > startDate;
  }).length;
}

export async function detectSuspiciousActivity(userId: string): Promise<SecurityEvent[]> {
  const q = query(
    collection(db, 'securityEvents'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(10)
  );

  const snapshot = await getDocs(q);
  const events = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as SecurityEvent));

  const suspiciousEvents: SecurityEvent[] = [];
  
  const failedLogins = events.filter(e => e.type === 'failed_login');
  if (failedLogins.length >= 5) {
    suspiciousEvents.push(...failedLogins);
  }

  const uniqueIPs = new Set(events.map(e => e.ip));
  if (uniqueIPs.size > 3) {
    events.forEach(e => {
      if (e.type === 'login_success') {
        suspiciousEvents.push(e);
      }
    });
  }

  return suspiciousEvents;
}

async function sendSecurityAlert(event: Omit<SecurityEvent, 'id'>): Promise<void> {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

  const severityColors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#F97316',
    critical: '#EF4444',
  };

  await resend.emails.send({
    from: 'ESTUDIOK Security <security@estudiak.com>',
    to: 'almir.msfilho@hotmail.com',
    subject: `⚠️ Alerta de Segurança: ${event.severity.toUpperCase()}`,
    html: `
      <div style="font-family: Arial, padding: 20px; background: #0A0A0A; color: #fff;">
        <h2 style="color: ${severityColors[event.severity]};">Alerta de Segurança</h2>
        <p><strong>Tipo:</strong> ${event.type}</p>
        <p><strong>IP:</strong> ${event.ip}</p>
        <p><strong>Usuário:</strong> ${event.userEmail || 'N/A'}</p>
        <p><strong>Detalhes:</strong> ${event.details || 'N/A'}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    `,
  });
}

export async function getSecurityStats(): Promise<{
  totalEvents: number;
  failedLogins: number;
  suspiciousActivities: number;
  uniqueIPs: number;
}> {
  const events = await getSecurityEvents();
  
  return {
    totalEvents: events.length,
    failedLogins: events.filter(e => e.type === 'failed_login').length,
    suspiciousActivities: events.filter(e => e.type === 'suspicious_activity').length,
    uniqueIPs: new Set(events.map(e => e.ip)).size,
  };
}