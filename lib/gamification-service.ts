import { collection, addDoc, getDocs, updateDoc, doc, query, where, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface UserProfile {
  id: string;
  userId: string;
  level: number;
  xp: number;
  points: number;
  badges: Badge[];
  achievements: Achievement[];
  stats: UserStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completedAt?: Date;
}

export interface UserStats {
  projectsCompleted: number;
  totalSpent: number;
  referralsMade: number;
  reviewsGiven: number;
  ticketsResolved: number;
  daysAsCustomer: number;
}

export const BADGES = [
  { id: 'first_project', name: 'Primeiro Projeto', description: 'Completou seu primeiro projeto', icon: '🎯', xp: 50 },
  { id: 'vip_client', name: 'Cliente VIP', description: 'Gastou mais de R$5.000', icon: '👑', xp: 200 },
  { id: 'referrer', name: 'Indicação', description: 'Indicou um amigo', icon: '🤝', xp: 100 },
  { id: 'reviewer', name: 'Avaliador', description: 'Deu sua primeira avaliação', icon: '⭐', xp: 30 },
  { id: 'early_bird', name: 'Cliente Early Bird', description: 'É cliente há mais de 6 meses', icon: '🐦', xp: 150 },
  { id: 'supporter', name: 'Suporte', description: 'Resolveu um ticket', icon: '🛟', xp: 20 },
  { id: 'social_share', name: 'Divulgador', description: 'Compartilhou nas redes sociais', icon: '📢', xp: 40 },
  { id: 'bundle_buyer', name: 'Pacote Master', description: 'Comprou 3 ou mais serviços', icon: '📦', xp: 100 },
];

export const LEVELS = [
  { level: 1, title: 'Iniciante', minXp: 0 },
  { level: 2, title: 'Bronze', minXp: 100 },
  { level: 3, title: 'Prata', minXp: 300 },
  { level: 4, title: 'Ouro', minXp: 600 },
  { level: 5, title: 'Platina', minXp: 1000 },
  { level: 6, title: 'Diamante', minXp: 2000 },
  { level: 7, title: 'Mestre', minXp: 5000 },
  { level: 8, title: 'Lendário', minXp: 10000 },
];

export async function createUserProfile(userId: string): Promise<string> {
  const docRef = await addDoc(collection(db, 'userProfiles'), {
    userId,
    level: 1,
    xp: 0,
    points: 0,
    badges: [],
    achievements: [],
    stats: {
      projectsCompleted: 0,
      totalSpent: 0,
      referralsMade: 0,
      reviewsGiven: 0,
      ticketsResolved: 0,
      daysAsCustomer: 0,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const q = query(collection(db, 'userProfiles'), where('userId', '==', userId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    badges: data.badges?.map((b: any) => ({
      ...b,
      earnedAt: b.earnedAt?.toDate(),
    })) || [],
    achievements: data.achievements?.map((a: any) => ({
      ...a,
      completedAt: a.completedAt?.toDate(),
    })) || [],
  } as UserProfile;
}

export async function addXP(userId: string, amount: number): Promise<UserProfile | null> {
  const profile = await getUserProfile(userId);
  if (!profile) return null;
  
  const newXP = profile.xp + amount;
  const newLevel = calculateLevel(newXP);
  
  await updateDoc(doc(db, 'userProfiles', profile.id), {
    xp: newXP,
    level: newLevel,
    updatedAt: new Date(),
  });
  
  return { ...profile, xp: newXP, level: newLevel };
}

export async function addPoints(userId: string, amount: number): Promise<void> {
  const profile = await getUserProfile(userId);
  if (!profile) return;
  
  await updateDoc(doc(db, 'userProfiles', profile.id), {
    points: increment(amount),
    updatedAt: new Date(),
  });
}

export async function awardBadge(userId: string, badgeId: string): Promise<Badge | null> {
  const profile = await getUserProfile(userId);
  if (!profile) return null;
  
  const alreadyHas = profile.badges.some(b => b.id === badgeId);
  if (alreadyHas) return null;
  
  const badgeTemplate = BADGES.find(b => b.id === badgeId);
  if (!badgeTemplate) return null;
  
  const newBadge: Badge = {
    ...badgeTemplate,
    earnedAt: new Date(),
  };
  
  const newBadges = [...profile.badges, newBadge];
  
  await Promise.all([
    updateDoc(doc(db, 'userProfiles', profile.id), {
      badges: newBadges,
      xp: increment(badgeTemplate.xp),
      updatedAt: new Date(),
    }),
  ]);
  
  return newBadge;
}

export async function updateUserStats(userId: string, stats: Partial<UserStats>): Promise<void> {
  const profile = await getUserProfile(userId);
  if (!profile) return;
  
  await updateDoc(doc(db, 'userProfiles', profile.id), {
    stats: { ...profile.stats, ...stats },
    updatedAt: new Date(),
  });
}

function calculateLevel(xp: number): number {
 for (let i = LEVELS.length - 1; i >= 0; i--) {
  const level = LEVELS[i];
  if (level && xp >= level.minXp) {
   return level.level;
  }
 }
 return 1;
}

export function getLevelTitle(level: number): string {
  const levelData = LEVELS.find(l => l.level === level);
  return levelData?.title || 'Iniciante';
}

export function getXPProgress(xp: number): { current: number; next: number; percentage: number } {
  const currentLevel = LEVELS.find(l => l.level === calculateLevel(xp));
  const nextLevel = LEVELS.find(l => l.level === calculateLevel(xp) + 1);
  
  const current = currentLevel?.minXp || 0;
  const next = nextLevel?.minXp || current + 100;
  
  return {
    current: xp - current,
    next: next - current,
    percentage: Math.round(((xp - current) / (next - current)) * 100),
  };
}

export function getLeaderboard(limit = 10): Promise<UserProfile[]> {
  return new Promise(async (resolve) => {
    const q = query(collection(db, 'userProfiles'),);
    const snapshot = await getDocs(q);
    const profiles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as UserProfile));
    
    const sorted = profiles.sort((a, b) => b.xp - a.xp).slice(0, limit);
    resolve(sorted);
  });
}