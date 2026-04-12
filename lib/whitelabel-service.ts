import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface WhiteLabelPartner {
  id: string;
  userId: string;
  companyName: string;
  domain?: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  email: string;
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'cancelled';
  features: string[];
  clients: number;
  projectsLimit: number;
  customDomain: boolean;
  branding: boolean;
  apiAccess: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface WhiteLabelClient {
  id: string;
  partnerId: string;
  userId: string;
  name: string;
  email: string;
  company: string;
  projectsCount: number;
  createdAt: Date;
}

export const WHITELABEL_PLANS = {
  starter: {
    name: 'Starter',
    price: 199,
    clients: 5,
    projectsPerClient: 10,
    features: ['basic_dashboard', 'email_support'],
    customDomain: false,
    apiAccess: false,
  },
  pro: {
    name: 'Professional',
    price: 499,
    clients: 20,
    projectsPerClient: 50,
    features: ['advanced_analytics', 'priority_support', 'custom_domain', 'white_label_reports'],
    customDomain: true,
    apiAccess: false,
  },
  enterprise: {
    name: 'Enterprise',
    price: 999,
    clients: -1,
    projectsPerClient: -1,
    features: ['full_analytics', '24h_support', 'custom_domain', 'api_access', 'dedicated_manager'],
    customDomain: true,
    apiAccess: true,
  },
};

export async function createWhiteLabelPartner(
  userId: string,
  data: {
    companyName: string;
    email: string;
    plan: 'starter' | 'pro' | 'enterprise';
  }
): Promise<string> {
  const planConfig = WHITELABEL_PLANS[data.plan];
  
  const docRef = await addDoc(collection(db, 'whiteLabelPartners'), {
    userId,
    companyName: data.companyName,
    email: data.email,
    primaryColor: '#00D4FF',
    secondaryColor: '#1A1A1A',
    plan: data.plan,
    status: 'active',
    features: planConfig.features,
    clients: 0,
    projectsLimit: data.plan === 'enterprise' ? -1 : 50,
    customDomain: planConfig.customDomain,
    branding: true,
    apiAccess: planConfig.apiAccess,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  
  return docRef.id;
}

export async function getWhiteLabelPartners(): Promise<WhiteLabelPartner[]> {
  const snapshot = await getDocs(collection(db, 'whiteLabelPartners'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    expiresAt: doc.data().expiresAt?.toDate(),
  } as WhiteLabelPartner));
}

export async function getWhiteLabelPartner(partnerId: string): Promise<WhiteLabelPartner | null> {
  const snapshot = await getDocs(query(collection(db, 'whiteLabelPartners'), where('__name__', '==', partnerId)));
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    expiresAt: data.expiresAt?.toDate(),
  } as WhiteLabelPartner;
}

export async function getWhiteLabelClients(partnerId: string): Promise<WhiteLabelClient[]> {
  const q = query(collection(db, 'whiteLabelClients'), where('partnerId', '==', partnerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as WhiteLabelClient));
}

export async function addWhiteLabelClient(
  partnerId: string,
  clientData: {
    userId: string;
    name: string;
    email: string;
    company: string;
  }
): Promise<string> {
  const partner = await getWhiteLabelPartner(partnerId);
  if (!partner) throw new Error('Partner not found');
  
  if (partner.clients >= (partner.plan === 'starter' ? 5 : partner.plan === 'pro' ? 20 : Infinity)) {
    throw new Error('Client limit reached for this plan');
  }
  
  const docRef = await addDoc(collection(db, 'whiteLabelClients'), {
    partnerId,
    ...clientData,
    projectsCount: 0,
    createdAt: new Date(),
  });
  
  await updateDoc(doc(db, 'whiteLabelPartners', partnerId), {
    clients: partner.clients + 1,
  });
  
  return docRef.id;
}

export async function updatePartnerStatus(partnerId: string, status: WhiteLabelPartner['status']): Promise<void> {
  await updateDoc(doc(db, 'whiteLabelPartners', partnerId), {
    status,
  });
}

export async function renewPartnerSubscription(partnerId: string, months: number = 1): Promise<void> {
  const partner = await getWhiteLabelPartner(partnerId);
  if (!partner) return;
  
  const currentExpires = partner.expiresAt || new Date();
  const newExpires = new Date(currentExpires.getTime() + months * 30 * 24 * 60 * 60 * 1000);
  
  await updateDoc(doc(db, 'whiteLabelPartners', partnerId), {
    expiresAt: newExpires,
    status: 'active',
  });
}

export function generatePartnerSubdomain(companyName: string): string {
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15);
  return `${slug}.estudiak.com`;
}

export async function getPartnerStats(partnerId: string): Promise<{
  totalClients: number;
  activeProjects: number;
  revenue: number;
  expiringSoon: boolean;
}> {
  const [partner, clients] = await Promise.all([
    getWhiteLabelPartner(partnerId),
    getWhiteLabelClients(partnerId),
  ]);
  
  return {
    totalClients: clients.length,
    activeProjects: clients.reduce((acc, c) => acc + c.projectsCount, 0),
    revenue: partner ? WHITELABEL_PLANS[partner.plan].price : 0,
    expiringSoon: partner?.expiresAt 
      ? (partner.expiresAt.getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000 
      : false,
  };
}