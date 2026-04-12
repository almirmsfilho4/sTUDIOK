import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

export interface ContentPost {
  id: string;
  title: string;
  content?: string;
  type: 'blog' | 'social' | 'email' | 'video' | 'podcast';
  platform?: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'email';
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledFor: Date;
  publishedAt?: Date;
  media?: { type: 'image' | 'video'; url: string }[];
  hashtags?: string[];
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: ContentPost['type'];
  platform?: ContentPost['platform'];
  content: string;
  variables: string[];
}

export const DEFAULT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'promo_blog',
    name: 'Post de Blog - Promocional',
    type: 'blog',
    content: '🎉 Novo post no blog!\n\n{{title}}\n\n{{excerpt}}\n\nLeia mais em: {{link}}',
    variables: ['title', 'excerpt', 'link'],
  },
  {
    id: 'new_project',
    name: 'Instagram - Novo Projeto',
    type: 'social',
    platform: 'instagram',
    content: '✨ Novo projeto concluído!\n\n{{clientName}}\n\n{{description}}\n\n#webdesign #estudiok #digital',
    variables: ['clientName', 'description'],
  },
  {
    id: 'testimonial',
    name: 'LinkedIn - Depoimento',
    type: 'social',
    platform: 'linkedin',
    content: '⭐ Mais um cliente satisfecho!\n\n"{{testimonial}}"\n\n- {{clientName}}, {{company}}\n\nObrigado pela confiança! 🙏',
    variables: ['testimonial', 'clientName', 'company'],
  },
  {
    id: 'newsletter',
    name: 'Newsletter - Padrão',
    type: 'email',
    platform: 'email',
    content: 'Assunto: {{subject}}\n\nOlá {{name}}!\n\n{{content}}\n\nAbraços,\nEquipe ESTUDIOK',
    variables: ['subject', 'name', 'content'],
  },
];

export async function createContentPost(post: Omit<ContentPost, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'contentPosts'), {
    ...post,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getContentPosts(filters?: {
  status?: string;
  type?: string;
  platform?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<ContentPost[]> {
  let q = query(collection(db, 'contentPosts'), orderBy('scheduledFor', 'asc'));

  if (filters?.status) {
    q = query(collection(db, 'contentPosts'), where('status', '==', filters.status), orderBy('scheduledFor', 'asc'));
  }

  const snapshot = await getDocs(q);
  let posts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    scheduledFor: doc.data().scheduledFor?.toDate(),
    publishedAt: doc.data().publishedAt?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  } as ContentPost));

  if (filters?.type) {
    posts = posts.filter(p => p.type === filters.type);
  }
  if (filters?.platform) {
    posts = posts.filter(p => p.platform === filters.platform);
  }

  return posts;
}

export async function scheduleContentPost(
  authorId: string,
  authorName: string,
  data: {
    title: string;
    content?: string;
    type: ContentPost['type'];
    platform?: ContentPost['platform'];
    scheduledFor: Date;
    media?: ContentPost['media'];
    hashtags?: string[];
  }
): Promise<string> {
  return createContentPost({
    ...data,
    status: 'scheduled',
    authorId,
    authorName,
  });
}

export async function publishPost(postId: string): Promise<void> {
  await Promise.all([
    updateDoc(doc(db, 'contentPosts', postId), {
      status: 'published',
      publishedAt: new Date(),
    }),
  ]);
}

export async function cancelScheduledPost(postId: string): Promise<void> {
  await updateDoc(doc(db, 'contentPosts', postId), {
    status: 'draft',
  });
}

export async function getUpcomingContent(days: number = 7): Promise<ContentPost[]> {
  const now = new Date();
  const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const q = query(
    collection(db, 'contentPosts'),
    where('status', '==', 'scheduled'),
    where('scheduledFor', '>=', now),
    where('scheduledFor', '<=', endDate),
    orderBy('scheduledFor', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    scheduledFor: doc.data().scheduledFor?.toDate(),
    publishedAt: doc.data().publishedAt?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  } as ContentPost));
}

export async function getContentStats(): Promise<{
  scheduled: number;
  published: number;
  draft: number;
  byPlatform: Record<string, number>;
}> {
  const posts = await getContentPosts();

  const byPlatform: Record<string, number> = {};
  posts.forEach(p => {
    if (p.platform) {
      byPlatform[p.platform] = (byPlatform[p.platform] || 0) + 1;
    }
  });

  return {
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    byPlatform,
  };
}

export function applyTemplate(template: ContentTemplate, variables: Record<string, string>): string {
  let content = template.content;
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return content;
}