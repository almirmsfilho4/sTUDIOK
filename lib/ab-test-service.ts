import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp, increment } from 'firebase/firestore';

export interface ABTest {
  id: string;
  name: string;
  description: string;
  page: string;
  variants: ABVariant[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  goal: 'conversion' | 'click' | 'time_on_page' | 'bounce';
  startDate?: Date;
  endDate?: Date;
  winner?: string;
  createdAt: Date;
}

export interface ABVariant {
  id: string;
  name: string;
  traffic: number;
  conversions: number;
  visitors: number;
  rate: number;
}

export interface ABVisitor {
  id: string;
  testId: string;
  variantId: string;
  sessionId: string;
  converted: boolean;
  timestamp: Date;
}

const DEFAULT_VARIANTS = (name: string) => [
  { id: 'control', name: 'Controle (A)', traffic: 50, conversions: 0, visitors: 0, rate: 0 },
  { id: 'variant', name: `Variação ${name} (B)`, traffic: 50, conversions: 0, visitors: 0, rate: 0 },
];

export async function createABTest(data: {
  name: string;
  description: string;
  page: string;
  goal: ABTest['goal'];
  variants?: { name: string; traffic: number }[];
}): Promise<string> {
  const variants = data.variants 
    ? data.variants.map((v, i) => ({
        id: `variant_${i}`,
        name: v.name,
        traffic: v.traffic,
        conversions: 0,
        visitors: 0,
        rate: 0,
      }))
    : DEFAULT_VARIANTS(data.name);

  const docRef = await addDoc(collection(db, 'abTests'), {
    ...data,
    variants,
    status: 'draft',
    createdAt: new Date(),
  });

  return docRef.id;
}

export async function startABTest(testId: string): Promise<void> {
  await updateDoc(doc(db, 'abTests', testId), {
    status: 'running',
    startDate: new Date(),
  });
}

export async function pauseABTest(testId: string): Promise<void> {
  await updateDoc(doc(db, 'abTests', testId), {
    status: 'paused',
  });
}

export async function completeABTest(testId: string, winnerId: string): Promise<void> {
  await updateDoc(doc(db, 'abTests', testId), {
    status: 'completed',
    winner: winnerId,
    endDate: new Date(),
  });
}

export async function getABTests(status?: ABTest['status']): Promise<ABTest[]> {
  let q;
  if (status) {
    q = query(collection(db, 'abTests'), where('status', '==', status));
  } else {
    q = query(collection(db, 'abTests'));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    startDate: doc.data().startDate?.toDate(),
    endDate: doc.data().endDate?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  } as ABTest));
}

export async function getABTest(testId: string): Promise<ABTest | null> {
 const snapshot = await getDocs(query(collection(db, 'abTests'), where('__name__', '==', testId)));
 if (snapshot.empty) return null;

 const doc = snapshot.docs[0];
 if (!doc) return null;
 const data = doc.data();
 return {
  id: doc.id,
  ...data,
  startDate: data.startDate?.toDate(),
  endDate: data.endDate?.toDate(),
  createdAt: data.createdAt?.toDate(),
 } as ABTest;
}

export async function trackABVisitor(
  testId: string,
  sessionId: string,
  convert: boolean = false
): Promise<string> {
  const test = await getABTest(testId);
if (!test || test.status !== 'running') throw new Error('Test not running');

 const hash = sessionId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
 const variantIndex = hash % test.variants.length;
 const variant = test.variants[variantIndex];
 if (!variant) throw new Error('No variant found');

 await addDoc(collection(db, 'abVisitors'), {
  testId,
  variantId: variant.id,
  sessionId,
  converted: convert,
  timestamp: new Date(),
 });

 await updateDoc(doc(db, 'abTests', testId), {
  'variants': test.variants.map(v =>
   v.id === variant.id
   ? { ...v, visitors: v.visitors + 1, conversions: v.conversions + (convert ? 1 : 0) }
   : v
  ),
 });

 return variant.id;
}

export function getABVariantForSession(test: ABTest, sessionId: string): ABVariant | null {
 const hash = sessionId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
 let cumulative = 0;

 for (const variant of test.variants) {
  cumulative += variant.traffic;
  if (hash % 100 < cumulative) {
   return variant;
  }
 }
return test.variants[0] ?? null;
}

export function calculateTestResults(test: ABTest): {
  winner: ABVariant | null;
  confidence: number;
  significant: boolean;
  stats: { variant: ABVariant; improvement: number }[];
} {
  const control = test.variants.find(v => v.id === 'control' || v.name.includes('Controle'));
  const variants = test.variants.filter(v => v.id !== 'control' && !v.name.includes('Controle'));

  const stats = test.variants.map(v => {
    const rate = v.visitors > 0 ? (v.conversions / v.visitors) * 100 : 0;
    const improvement = control && control.visitors > 0 
      ? ((rate - (control.conversions / control.visitors * 100)) / (control.conversions / control.visitors * 100)) * 100
      : 0;
    return { variant: v, improvement };
  });

  const winner = stats.reduce((best, current) => 
    current.variant.conversions > best.variant.conversions ? current : best
  ).variant;

  const controlRate = control ? (control.conversions / control.visitors * 100) : 0;
  const winnerRate = (winner.conversions / winner.visitors * 100);
  const totalVisitors = test.variants.reduce((acc, v) => acc + v.visitors, 0);
  const totalConversions = test.variants.reduce((acc, v) => acc + v.conversions, 0);
  
  const confidence = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;
  const significant = Math.abs(winnerRate - controlRate) > 5 && totalVisitors > 100;

  return { winner, confidence, significant, stats };
}

export async function deleteABTest(testId: string): Promise<void> {
  await updateDoc(doc(db, 'abTests', testId), {
    status: 'completed',
  });
}