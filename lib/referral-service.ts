import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerEmail: string;
  referredId?: string;
  referredName?: string;
  referredEmail: string;
  referredPhone?: string;
  status: 'pending' | 'registered' | 'converted' | 'expired';
  discountEarned: number;
  discountUsed: boolean;
  couponCode?: string;
  createdAt: Date;
  convertedAt?: Date;
  rewardPaid: boolean;
}

export interface ReferralReward {
  id: string;
  referrerId: string;
  referralId: string;
  type: 'discount' | 'cash' | 'credit';
  amount: number;
  description: string;
  createdAt: Date;
  paidAt?: Date;
}

const REWARD_CONFIG = {
  referral: { discount: 10, cash: 50, credit: 100 },
  conversion: { discount: 15, cash: 100, credit: 200 },
};

export async function createReferralLink(
  referrerId: string,
  referrerName: string,
  referrerEmail: string
): Promise<string> {
  const code = `REF${referrerName.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  
  const docRef = await addDoc(collection(db, 'referrals'), {
    referrerId,
    referrerName,
    referrerEmail,
    referredEmail: '',
    status: 'pending',
    discountEarned: REWARD_CONFIG.referral.discount,
    discountUsed: false,
    couponCode: code,
    createdAt: new Date(),
    rewardPaid: false,
  });
  
  return docRef.id;
}

export async function trackReferral(
  referrerEmail: string,
  referredEmail: string,
  referredName?: string,
  referredPhone?: string
): Promise<Referral | null> {
  const q = query(
    collection(db, 'referrals'),
    where('referrerEmail', '==', referrerEmail),
    where('status', '==', 'pending')
  );
  
  const snapshot = await getDocs(q);
  
if (snapshot.empty) return null;

 const referralDoc = snapshot.docs[0];
 if (!referralDoc) return null;
 const referralId = referralDoc.id;
  
  await updateDoc(doc(db, 'referrals', referralId), {
    referredEmail,
    referredName,
    referredPhone,
    status: 'registered',
  });
  
  const data = referralDoc.data();
  return {
    id: referralId,
    ...data,
    referredEmail,
    referredName,
    referredPhone,
    status: 'registered',
    createdAt: data.createdAt?.toDate(),
  } as Referral;
}

export async function completeReferralConversion(referralId: string, referredId: string): Promise<void> {
  const referral = await getReferralById(referralId);
  if (!referral) return;
  
  await Promise.all([
    updateDoc(doc(db, 'referrals', referralId), {
      referredId,
      status: 'converted',
      convertedAt: new Date(),
    }),
    updateDoc(doc(db, 'users', referral.referrerId), {
      referralCount: increment(1),
    }),
  ]);
}

export async function getReferralsByUser(userId: string): Promise<Referral[]> {
  const q = query(collection(db, 'referrals'), where('referrerId', '==', userId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    convertedAt: doc.data().convertedAt?.toDate(),
  } as Referral));
}

export async function getReferralById(referralId: string): Promise<Referral | null> {
  const snapshot = await getDocs(query(collection(db, 'referrals'), where('__name__', '==', referralId)));
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    convertedAt: data.cuponUsedAt?.toDate(),
  } as Referral;
}

export async function getReferralStats(userId: string): Promise<{
  total: number;
  pending: number;
  converted: number;
  rewardsEarned: number;
}> {
  const referrals = await getReferralsByUser(userId);
  
  return {
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'pending' || r.status === 'registered').length,
    converted: referrals.filter(r => r.status === 'converted').length,
    rewardsEarned: referrals.filter(r => r.rewardPaid).length * REWARD_CONFIG.conversion.cash,
  };
}

export async function generateReferralCoupon(referrerId: string, referralId: string): Promise<string> {
  const code = `INDICA${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  await addDoc(collection(db, 'coupons'), {
    code,
    discountType: 'percentage',
    discountValue: REWARD_CONFIG.referral.discount,
    maxUses: 1,
    usedCount: 0,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    active: true,
    description: `Cupom de indicação - ${REWARD_CONFIG.referral.discount}% desconto`,
    referralId,
    referrerId,
    createdAt: serverTimestamp(),
  });
  
  await updateDoc(doc(db, 'referrals', referralId), {
    couponCode: code,
    discountUsed: true,
  });
  
  return code;
}

export function getReferralLink(referrerEmail: string): string {
  return `https://estudiak.com?ref=${encodeURIComponent(referrerEmail)}`;
}

export function getReferralMessage(): string {
  return `Olá! Use meu link para ganhar ${REWARD_CONFIG.referral.discount}% de desconto: {link}`;
}