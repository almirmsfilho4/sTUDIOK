import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface ProjectReview {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  rating: number;
  review: string;
  wouldRecommend: boolean;
  aspects: {
    quality: number;
    communication: number;
    deadline: number;
    support: number;
  };
  createdAt: Date;
}

export async function createReview(data: Omit<ProjectReview, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'projectReviews'), {
    ...data,
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function getProjectReviews(projectId?: string): Promise<ProjectReview[]> {
  let q;
  if (projectId) {
    q = query(collection(db, 'projectReviews'), where('projectId', '==', projectId), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, 'projectReviews'), orderBy('createdAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as ProjectReview[];
}

export async function getAverageRating(): Promise<{ overall: number; quality: number; communication: number; deadline: number; support: number }> {
  const reviews = await getProjectReviews();
  
  if (reviews.length === 0) {
    return { overall: 5, quality: 5, communication: 5, deadline: 5, support: 5 };
  }
  
  const totals = reviews.reduce(
    (acc, review) => ({
      quality: acc.quality + review.aspects.quality,
      communication: acc.communication + review.aspects.communication,
      deadline: acc.deadline + review.aspects.deadline,
      support: acc.support + review.aspects.support,
    }),
    { quality: 0, communication: 0, deadline: 0, support: 0 }
  );
  
  const count = reviews.length;
  return {
    overall: (totals.quality + totals.communication + totals.deadline + totals.support) / (count * 4),
    quality: totals.quality / count,
    communication: totals.communication / count,
    deadline: totals.deadline / count,
    support: totals.support / count,
  };
}

export async function getRecommendationRate(): Promise<number> {
  const reviews = await getProjectReviews();
  if (reviews.length === 0) return 100;
  
  const recommendCount = reviews.filter(r => r.wouldRecommend).length;
  return Math.round((recommendCount / reviews.length) * 100);
}