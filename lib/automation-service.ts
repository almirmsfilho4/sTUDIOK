import { collection, getDocs, query, where, orderBy, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface ReferralCode {
  id?: string;
  code: string;
  userId: string;
  userName: string;
  discount: number;
  usedCount: number;
  maxUses: number;
  createdAt: Date;
}

export interface ReferralUse {
  id?: string;
  referralCode: string;
  referredUserId: string;
  referredUserEmail: string;
  discountUsed: number;
  usedAt: Date;
}

export async function createReferralCode(userId: string, userName: string): Promise<string> {
  const code = `${userName.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  
  const docRef = await addDoc(collection(db, 'referralCodes'), {
    code,
    userId,
    userName,
    discount: 10,
    usedCount: 0,
    maxUses: 10,
    createdAt: new Date(),
  });
  
  return code;
}

export async function getReferralCode(userId: string): Promise<ReferralCode | null> {
 const q = query(collection(db, 'referralCodes'), where('userId', '==', userId));
 const snapshot = await getDocs(q);

 if (snapshot.empty) return null;

 const doc = snapshot.docs[0];
 if (!doc) return null;
 const data = doc.data();
 return {
  id: doc.id,
  ...data,
  createdAt: data.createdAt?.toDate(),
 } as ReferralCode;
}

export async function validateReferralCode(code: string): Promise<ReferralCode | null> {
 const q = query(collection(db, 'referralCodes'), where('code', '==', code));
 const snapshot = await getDocs(q);

 if (snapshot.empty) return null;

 const doc = snapshot.docs[0];
 if (!doc) return null;
 const data = doc.data();
 const referral: ReferralCode = {
  id: doc.id,
  ...data,
  createdAt: data.createdAt?.toDate(),
  } as ReferralCode;
  
  if (referral.usedCount >= referral.maxUses) return null;
  
  return referral;
}

export async function useReferralCode(code: string, referredUserId: string, referredUserEmail: string): Promise<boolean> {
  const referral = await validateReferralCode(code);
  if (!referral || !referral.id) return false;
  
  await addDoc(collection(db, 'referralUses'), {
    referralCode: code,
    referredUserId,
    referredUserEmail,
    discountUsed: referral.discount,
    usedAt: new Date(),
  });
  
  const { doc, updateDoc } = await import('firebase/firestore');
  await updateDoc(doc(db, 'referralCodes', referral.id), {
    usedCount: referral.usedCount + 1,
  });
  
  return true;
}

export async function getUserReferrals(userId: string): Promise<ReferralUse[]> {
  const code = await getReferralCode(userId);
  if (!code) return [];
  
  const q = query(
    collection(db, 'referralUses'),
    where('referralCode', '==', code.code),
    orderBy('usedAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    usedAt: doc.data().usedAt?.toDate(),
  })) as ReferralUse[];
}

export async function checkWarrantyExpirations(): Promise<void> {
  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  const q = query(
    collection(db, 'projectDeliveries'),
    where('status', '==', 'warranty_active')
  );
  
  const snapshot = await getDocs(q);
  
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const warrantyEnd = data.warrantyEndDate?.toDate();
    
    if (warrantyEnd && warrantyEnd <= sevenDaysFromNow && warrantyEnd > now) {
      await addDoc(collection(db, 'notifications'), {
        userId: data.clientId,
        type: 'warning',
        title: 'Garantia expira em breve',
        message: `Sua garantia para ${data.projectName} expira em ${warrantyEnd.toLocaleDateString('pt-BR')}`,
        link: '/dashboard',
        read: false,
        createdAt: serverTimestamp(),
      });
    }
  }
}

export interface LeadSource {
  source: string;
  medium?: string;
  campaign?: string;
  count: number;
  conversions: number;
}

export async function getLeadSources(): Promise<LeadSource[]> {
  const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  const sourceMap: Record<string, LeadSource> = {};
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const source = data.utmSource || data.source || 'direct';
    const medium = data.utmMedium || 'none';
    const key = `${source}-${medium}`;
    
    if (!sourceMap[key]) {
      sourceMap[key] = { source, medium, count: 0, conversions: 0 };
    }
    sourceMap[key].count++;
  });
  
  const projectsQ = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
  const projectsSnapshot = await getDocs(projectsQ);
  
  projectsSnapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.utmSource) {
      const key = `${data.utmSource}-${data.utmMedium || 'none'}`;
      if (sourceMap[key]) {
        sourceMap[key].conversions++;
      }
    }
  });
  
  return Object.values(sourceMap).sort((a, b) => b.count - a.count);
}