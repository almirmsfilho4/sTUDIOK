import { collection, addDoc, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface PremiumContent {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: 'video' | 'course' | 'template' | 'ebook';
  category: string;
  thumbnail: string;
  content: string;
  duration?: number;
  requiredTier: 'free' | 'basic' | 'pro' | 'enterprise';
  views: number;
  createdAt: Date;
}

export interface UserSubscription {
  id: string;
  userId: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  startDate: Date;
  endDate?: Date;
  features: string[];
}

const PREMIUM_CONTENT: Omit<PremiumContent, 'id' | 'views' | 'createdAt'>[] = [
  {
    title: 'Curso: Como vender mais com Landing Pages',
    slug: 'curso-landing-pages',
    description: 'Aprenda a criar landing pages que convertem',
    type: 'course',
    category: 'Marketing',
    thumbnail: '',
    content: '',
    duration: 120,
    requiredTier: 'basic',
  },
  {
    title: 'Template: E-commerce Completo',
    slug: 'template-ecommerce',
    description: 'Template pronto de loja virtual',
    type: 'template',
    category: 'Templates',
    thumbnail: '',
    content: '',
    requiredTier: 'pro',
  },
  {
    title: ' Ebook: Guia SEO 2024',
    slug: 'ebook-seo-2024',
    description: 'Guia completo de SEO para pequenos negócios',
    type: 'ebook',
    category: 'Marketing',
    thumbnail: '',
    content: '',
    requiredTier: 'free',
  },
];

export async function getPremiumContent(tier: string): Promise<PremiumContent[]> {
  const tierLevels = { free: 0, basic: 1, pro: 2, enterprise: 3 };
  const userLevel = tierLevels[tier as keyof typeof tierLevels] || 0;
  
  const q = query(collection(db, 'premiumContent'), where('requiredTier', '<=', userLevel));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return PREMIUM_CONTENT.map((c, i) => ({
      ...c,
      id: `default-${i}`,
      views: 0,
      createdAt: new Date(),
    }));
  }
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as PremiumContent[];
}

export async function checkUserAccess(userId: string, content: PremiumContent): Promise<boolean> {
  const q = query(collection(db, 'userSubscriptions'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return content.requiredTier === 'free';
  
  const sub = snapshot.docs[0]?.data() as UserSubscription | undefined;
  if (!sub) return false;
  const tierLevels = { free: 0, basic: 1, pro: 2, enterprise: 3 };
  
  return tierLevels[sub.tier] >= tierLevels[content.requiredTier];
}

export async function upgradeTier(userId: string, tier: string): Promise<void> {
  const q = query(collection(db, 'userSubscriptions'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  const features = tier === 'basic' ? ['courses', 'ebooks'] : tier === 'pro' ? ['courses', 'ebooks', 'templates', 'support'] : ['all'];
  
  if (snapshot.empty) {
    await addDoc(collection(db, 'userSubscriptions'), {
      userId,
      tier,
      startDate: new Date(),
      features,
    });
} else {
  const docRef = snapshot.docs[0]?.ref;
  if (docRef) {
    await updateDoc(docRef, { tier, features });
  }
 }
}