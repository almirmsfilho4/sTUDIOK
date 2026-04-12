import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/app/firebase';
import { uploadFileToBlob, deleteFileFromBlob } from './blob-storage';

// Check if we're in browser environment and Firebase is available
const isFirebaseAvailable = () => {
  return typeof window !== 'undefined' && db && typeof db.collection === 'function';
};

const COLLECTIONS = {
  users: 'users',
  projects: 'projects',
  quotes: 'quotes',
  messages: 'messages',
  files: 'files',
  notifications: 'notifications',
  coupons: 'coupons',
  subscriptions: 'subscriptions',
};

// Projects
export async function createProject(data: {
  userId: string;
  name: string;
  description?: string;
  price: number;
  paidAmount?: number;
  deadline?: Date;
  features?: string[];
}) {
  if (!isFirebaseAvailable()) return null;
  
  const projectData = {
    user_id: data.userId,
    name: data.name,
    description: data.description || '',
    status: 'pending',
    progress: 0,
    price: data.price,
    paidAmount: data.paidAmount || 0,
    deadline: data.deadline ? Timestamp.fromDate(data.deadline) : null,
    features: data.features || [],
    timeline: [
      { phase: 'Briefing', description: 'Coleta de requisitos', completed: false },
      { phase: 'Design', description: 'Criação de protótipos', completed: false },
      { phase: 'Desenvolvimento', description: 'Programação', completed: false },
      { phase: 'Testes', description: 'QA e ajustes', completed: false },
      { phase: 'Entrega', description: 'Deploy e lançamento', completed: false },
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.projects), projectData);
  return docRef.id;
}

export async function getProject(projectId: string) {
  const docSnap = await getDoc(doc(db, COLLECTIONS.projects, projectId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function getUserProjects(userId: string) {
  const q = query(
    collection(db, COLLECTIONS.projects),
    where('user_id', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getAllProjects() {
  const q = query(
    collection(db, COLLECTIONS.projects),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateProject(projectId: string, data: Partial<{
  name: string;
  description: string;
  status: string;
  progress: number;
  price: number;
  paidAmount: number;
  deadline: Date;
  features: string[];
  timeline: any[];
  paymentId?: string;
  paymentStatus?: string;
  paymentDate?: Date;
}>) {
  const updateData: any = { ...data, updatedAt: serverTimestamp() };
  if (data.deadline) {
    updateData.deadline = Timestamp.fromDate(data.deadline);
  }
  await updateDoc(doc(db, COLLECTIONS.projects, projectId), updateData);
}

export async function deleteProject(projectId: string) {
  await deleteDoc(doc(db, COLLECTIONS.projects, projectId));
}

// Quotes
export async function createQuote(data: {
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  features?: string[];
  complexity?: string;
  deadline?: string;
  price?: number;
  estimatedDays?: number;
  userId?: string;
  sessionId?: string;
  referralCode?: string | null;
  couponCode?: string | null;
  source?: string;
  description?: string;
  budget?: string;
}) {
  const quoteData = {
    ...data,
    user_id: data.userId || null,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.quotes), quoteData);
  return docRef.id;
}

export async function getQuote(quoteId: string) {
  const docSnap = await getDoc(doc(db, COLLECTIONS.quotes, quoteId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function getUserQuotes(userId: string) {
  const q = query(
    collection(db, COLLECTIONS.quotes),
    where('user_id', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateQuote(quoteId: string, data: Partial<{
  status: string;
  user_id: string;
}>) {
  await updateDoc(doc(db, COLLECTIONS.quotes, quoteId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Messages
export async function createMessage(data: {
  projectId: string;
  senderId: string;
  content: string;
  type?: 'text' | 'file' | 'system';
}) {
  const messageData = {
    project_id: data.projectId,
    sender_id: data.senderId,
    content: data.content,
    type: data.type || 'text',
    read: false,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.messages), messageData);
  return docRef.id;
}

export async function getProjectMessages(projectId: string) {
  const q = query(
    collection(db, COLLECTIONS.messages),
    where('project_id', '==', projectId),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function markMessagesAsRead(projectId: string, userId: string) {
  const q = query(
    collection(db, COLLECTIONS.messages),
    where('project_id', '==', projectId),
    where('sender_id', '!=', userId),
    where('read', '==', false)
  );
  const snapshot = await getDocs(q);
  snapshot.docs.forEach(async (messageDoc) => {
    await updateDoc(doc(db, COLLECTIONS.messages, messageDoc.id), { read: true });
  });
}

export async function getUnreadCount(projectId: string, userId: string) {
  const q = query(
    collection(db, COLLECTIONS.messages),
    where('project_id', '==', projectId),
    where('sender_id', '!=', userId),
    where('read', '==', false)
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Files
export async function uploadFile(projectId: string, userId: string, file: File) {
  const fileName = `${Date.now()}_${file.name}`;
  const { url } = await uploadFileToBlob(file, projectId, fileName);

  const fileData = {
    project_id: projectId,
    name: file.name,
    url,
    type: file.type,
    size: file.size,
    uploadedBy: userId,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.files), fileData);
  return docRef.id;
}

export async function getProjectFiles(projectId: string) {
  const q = query(
    collection(db, COLLECTIONS.files),
    where('project_id', '==', projectId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function deleteFile(fileId: string, projectId: string, fileName: string, fileUrl?: string) {
  if (fileUrl) {
    try {
      await deleteFileFromBlob(fileUrl);
    } catch (e) {
      console.log('File not in blob storage');
    }
  }
  await deleteDoc(doc(db, COLLECTIONS.files, fileId));
}

// Stats for Admin
export async function getStats() {
  const projectsSnapshot = await getDocs(collection(db, COLLECTIONS.projects));
  const usersSnapshot = await getDocs(collection(db, COLLECTIONS.users));
  
  let totalRevenue = 0;
  let activeProjects = 0;
  let completedProjects = 0;
  
  projectsSnapshot.docs.forEach(doc => {
    const data = doc.data();
    totalRevenue += data.paidAmount || 0;
    if (data.status === 'in_progress' || data.status === 'review') {
      activeProjects++;
    }
    if (data.status === 'completed') {
      completedProjects++;
    }
  });

  return {
    totalClients: usersSnapshot.size - 1,
    totalProjects: projectsSnapshot.size,
    activeProjects,
    completedProjects,
    totalRevenue,
  };
}

// All Users (for Admin)
export async function getAllUsers() {
  const q = query(
    collection(db, COLLECTIONS.users),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
// Promote user to admin
export async function promoteToAdmin(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, COLLECTIONS.users, userId);
    await updateDoc(userRef, {
      role: 'admin',
      updatedAt: serverTimestamp()
    });
    
    console.log('User promoted to admin:', userId);
    return true;
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    return false;
  }
}

// Demote user from admin
export async function demoteFromAdmin(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, COLLECTIONS.users, userId);
    await updateDoc(userRef, {
      role: 'client',
      updatedAt: serverTimestamp()
    });
    
    console.log('User demoted from admin:', userId);
    return true;
  } catch (error) {
    console.error('Error demoting user from admin:', error);
    return false;
  }
}

// Generic CRUD functions
export async function getDocuments(collectionName: string) {
  if (!isFirebaseAvailable()) return [];
  const COLLECTIONS_EXTENDED = { ...COLLECTIONS, portfolio: 'portfolio', articles: 'articles' };
  const colRef = collection(db, COLLECTIONS_EXTENDED[collectionName as keyof typeof COLLECTIONS_EXTENDED] || collectionName);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createDocument(collectionName: string, data: any) {
  if (!isFirebaseAvailable()) return null;
  const COLLECTIONS_EXTENDED = { ...COLLECTIONS, portfolio: 'portfolio', articles: 'articles' };
  const colRef = collection(db, COLLECTIONS_EXTENDED[collectionName as keyof typeof COLLECTIONS_EXTENDED] || collectionName);
  return await addDoc(colRef, { ...data, createdAt: serverTimestamp() });
}

export async function updateDocument(collectionName: string, docId: string, data: any) {
  if (!isFirebaseAvailable()) return;
  const COLLECTIONS_EXTENDED = { ...COLLECTIONS, portfolio: 'portfolio', articles: 'articles' };
  const docRef = doc(db, COLLECTIONS_EXTENDED[collectionName as keyof typeof COLLECTIONS_EXTENDED] || collectionName, docId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(collectionName: string, docId: string) {
  if (!isFirebaseAvailable()) return;
  const COLLECTIONS_EXTENDED = { ...COLLECTIONS, portfolio: 'portfolio', articles: 'articles' };
  const docRef = doc(db, COLLECTIONS_EXTENDED[collectionName as keyof typeof COLLECTIONS_EXTENDED] || collectionName, docId);
  await deleteDoc(docRef);
}

// Notifications
export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type: 'payment' | 'project' | 'system';
  link?: string;
}) {
  if (!isFirebaseAvailable()) return null;
  
  const notificationData = {
    user_id: data.userId,
    title: data.title,
    message: data.message,
    type: data.type,
    link: data.link || null,
    read: false,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.notifications), notificationData);
  return docRef.id;
}

export async function getUserNotifications(userId: string) {
  if (!isFirebaseAvailable()) return [];
  
  const q = query(
    collection(db, COLLECTIONS.notifications),
    where('user_id', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function markNotificationRead(notificationId: string) {
  if (!isFirebaseAvailable()) return;
  await updateDoc(doc(db, COLLECTIONS.notifications, notificationId), { read: true });
}

// Coupons
export async function createCoupon(data: {
  code: string;
  discount: number;
  discountType: 'percent' | 'fixed';
  validUntil: Date;
  maxUses?: number;
  usedCount?: number;
}) {
  if (!isFirebaseAvailable()) return null;
  
  const couponData = {
    code: data.code.toUpperCase(),
    discount: data.discount,
    discountType: data.discountType,
    validUntil: Timestamp.fromDate(data.validUntil),
    maxUses: data.maxUses || null,
    usedCount: data.usedCount || 0,
    active: true,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.coupons), couponData);
  return docRef.id;
}

export async function validateCoupon(code: string) {
  if (!isFirebaseAvailable()) return null;
  
  const q = query(
    collection(db, COLLECTIONS.coupons),
    where('code', '==', code.toUpperCase()),
    where('active', '==', true)
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const docSnap = snapshot.docs[0];
  if (!docSnap) return null;
  
  const coupon = docSnap.data();
  const validUntil = coupon.validUntil?.toDate?.();
  
  if (validUntil && validUntil < new Date()) return null;
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return null;
  
  return { id: docSnap.id, ...coupon };
}

export async function useCoupon(couponId: string) {
  if (!isFirebaseAvailable()) return;
  const docRef = doc(db, COLLECTIONS.coupons, couponId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    await updateDoc(docRef, { usedCount: (data.usedCount || 0) + 1 });
  }
}

// Subscriptions (Maintenance Plans)
export async function createSubscription(data: {
  userId: string;
  projectId: string;
  plan: 'basic' | 'professional' | 'premium';
  price: number;
  billingCycle: 'monthly' | 'yearly';
}) {
  if (!isFirebaseAvailable()) return null;
  
  const startDate = new Date();
  const endDate = data.billingCycle === 'monthly' 
    ? new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    : new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
  
  const subscriptionData = {
    user_id: data.userId,
    project_id: data.projectId,
    plan: data.plan,
    price: data.price,
    billingCycle: data.billingCycle,
    status: 'active',
    startDate: Timestamp.fromDate(startDate),
    endDate: Timestamp.fromDate(endDate),
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.subscriptions), subscriptionData);
  return docRef.id;
}

export async function getUserSubscriptions(userId: string) {
  if (!isFirebaseAvailable()) return [];
  
  const q = query(
    collection(db, COLLECTIONS.subscriptions),
    where('user_id', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
