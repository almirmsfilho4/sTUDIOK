import { collection, addDoc, getDocs, updateDoc, doc, query, where, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxUses: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  active: boolean;
  description?: string;
  createdAt: Date;
}

export interface CouponUse {
  id: string;
  couponId: string;
  userId: string;
  orderId: string;
  discountApplied: number;
  usedAt: Date;
}

export async function createCoupon(coupon: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'coupons'), {
    ...coupon,
    usedCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function validateCoupon(code: string, userId: string, purchaseAmount: number): Promise<{ valid: boolean; coupon?: Coupon; discount: number; message: string }> {
  const q = query(collection(db, 'coupons'), where('code', '==', code.toUpperCase()));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return { valid: false, discount: 0, message: 'Cupom não encontrado' };
  }

  const doc = snapshot.docs[0];
  if (!doc) return { valid: false, discount: 0, message: 'Cupom não encontrado' };
  const couponData = doc.data();
  const coupon: Coupon = {
    id: doc.id,
    code: couponData.code,
    discountType: couponData.discountType,
    discountValue: couponData.discountValue,
    maxUses: couponData.maxUses,
    active: couponData.active,
    usedCount: couponData.usedCount,
    validFrom: couponData.validFrom?.toDate(),
    validUntil: couponData.validUntil?.toDate(),
    createdAt: couponData.createdAt?.toDate(),
    minPurchase: couponData.minPurchase,
    description: couponData.description,
  };

  const now = new Date();

  if (!coupon.active) {
    return { valid: false, discount: 0, message: 'Cupom inativo' };
  }

  if (now < coupon.validFrom || now > coupon.validUntil) {
    return { valid: false, discount: 0, message: 'Cupom expirado' };
  }

  if (coupon.usedCount >= coupon.maxUses) {
    return { valid: false, discount: 0, message: 'Cupom atingiu o limite de uso' };
  }

  if (coupon.minPurchase && purchaseAmount < coupon.minPurchase) {
    return { valid: false, discount: 0, message: `Compra mínima de R$ ${coupon.minPurchase}` };
  }

  const usesQuery = query(
    collection(db, 'couponUses'),
    where('couponId', '==', coupon.id),
    where('userId', '==', userId)
  );
  const usesSnapshot = await getDocs(usesQuery);

  if (!usesSnapshot.empty) {
    return { valid: false, discount: 0, message: 'Você já utilizou este cupom' };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (purchaseAmount * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  return {
    valid: true,
    coupon,
    discount,
    message: `Desconto de R$ ${discount.toFixed(2)} aplicado!`,
  };
}

export async function applyCoupon(couponId: string, userId: string, orderId: string, discountApplied: number): Promise<void> {
  await Promise.all([
    addDoc(collection(db, 'couponUses'), {
      couponId,
      userId,
      orderId,
      discountApplied,
      usedAt: serverTimestamp(),
    }),
    updateDoc(doc(db, 'coupons', couponId), {
      usedCount: increment(1),
    }),
  ]);
}

export async function getCoupons(): Promise<Coupon[]> {
  const snapshot = await getDocs(collection(db, 'coupons'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    validFrom: doc.data().validFrom?.toDate(),
    validUntil: doc.data().validUntil?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Coupon));
}

export async function deactivateCoupon(couponId: string): Promise<void> {
  await updateDoc(doc(db, 'coupons', couponId), { active: false });
}