import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface Author {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author' | 'contributor';
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  stats: {
    posts: number;
    views: number;
  };
  active: boolean;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  status: 'draft' | 'review' | 'published' | 'archived';
  featured: boolean;
  views: number;
  readTime: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function createAuthor(author: Omit<Author, 'id' | 'stats' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'blogAuthors'), {
    ...author,
    stats: { posts: 0, views: 0 },
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function getAuthors(activeOnly = true): Promise<Author[]> {
  let q;
  if (activeOnly) {
    q = query(collection(db, 'blogAuthors'), where('active', '==', true));
  } else {
    q = query(collection(db, 'blogAuthors'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Author));
}

export async function getAuthorById(authorId: string): Promise<Author | null> {
  const snapshot = await getDocs(query(collection(db, 'blogAuthors'), where('__name__', '==', authorId)));
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
  } as Author;
}

export async function createPost(post: Omit<BlogPost, 'id' | 'views' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'blogPosts'), {
    ...post,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  await updateDoc(doc(db, 'blogAuthors', post.authorId), {
    'stats.posts': increment(1),
  });
  
  return docRef.id;
}

export async function getPosts(options?: {
  status?: string;
  authorId?: string;
  category?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  let q;
  
  if (options?.status) {
    q = query(collection(db, 'blogPosts'), where('status', '==', options.status), orderBy('publishedAt', 'desc'));
  } else {
    q = query(collection(db, 'blogPosts'), where('status', '==', 'published'), orderBy('publishedAt', 'desc'));
  }
  
  if (options?.authorId) {
    const filtered = await getDocs(query(collection(db, 'blogPosts'), where('authorId', '==', options.authorId)));
    return filtered.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as BlogPost));
  }
  
  if (options?.category) {
    const filtered = await getDocs(query(collection(db, 'blogPosts'), where('category', '==', options.category)));
    return filtered.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as BlogPost));
  }
  
  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    publishedAt: doc.data().publishedAt?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  } as BlogPost));
  
  return options?.limit ? posts.slice(0, options.limit) : posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const snapshot = await getDocs(query(collection(db, 'blogPosts'), where('slug', '==', slug)));
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    publishedAt: data.publishedAt?.toDate(),
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as BlogPost;
}

export async function publishPost(postId: string): Promise<void> {
  await Promise.all([
    updateDoc(doc(db, 'blogPosts', postId), {
      status: 'published',
      publishedAt: new Date(),
      updatedAt: new Date(),
    }),
  ]);
}

export async function incrementPostViews(postId: string): Promise<void> {
  await Promise.all([
    updateDoc(doc(db, 'blogPosts', postId), {
      views: increment(1),
    }),
  ]);
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
  const posts = await getPosts();
  const categories: Record<string, number> = {};
  
  posts.forEach(post => {
    categories[post.category] = (categories[post.category] || 0) + 1;
  });
  
  return Object.entries(categories).map(([name, count]) => ({ name, count }));
}

export async function getRelatedPosts(postId: string, limit = 3): Promise<BlogPost[]> {
  const post = (await getDocs(query(collection(db, 'blogPosts'), where('__name__', '==', postId)))).docs[0]?.data();
  if (!post) return [];
  
  const allPosts = await getPosts();
  const related = allPosts
    .filter(p => p.id !== postId && p.category === post.category)
    .slice(0, limit);
  
  return related;
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}