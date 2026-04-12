import { collection, query, where, orderBy, getDocs, Timestamp, DocumentData, limit } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { Project, User } from '@/types';

const COLLECTIONS = {
  users: 'users',
  projects: 'projects',
  quotes: 'quotes',
  messages: 'messages',
  files: 'files',
};

export interface AdvancedStats {
  // Basic stats
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  
  // Advanced metrics
  conversionRate: number;
  averageProjectValue: number;
  monthlyRevenue: number;
  quarterlyRevenue: number;
  yearlyRevenue: number;
  
  // Project metrics
  averageProjectDuration: number;
  projectCompletionRate: number;
  
  // Client metrics
  returningClients: number;
  clientSatisfaction: number;
  
  // Timeline data
  revenueByMonth: { month: string; revenue: number }[];
  projectsByStatus: { status: string; count: number }[];
  projectsByType: { type: string; count: number }[];
}

export interface ProjectAnalytics {
  id: string;
  name: string;
  status: string;
  progress: number;
  price: number;
  paidAmount: number;
  createdAt: Date;
  deadline?: Date;
  completedAt?: Date;
  duration?: number; // days
  profitMargin?: number;
}

export interface ClientAnalytics {
  id: string;
  name: string;
  email: string;
  totalProjects: number;
  totalSpent: number;
  averageProjectValue: number;
  firstProjectDate?: Date;
  lastProjectDate?: Date;
  projectCompletionRate: number;
}

export async function getAdvancedStats(): Promise<AdvancedStats> {
  const [
    projectsSnapshot,
    usersSnapshot,
    quotesSnapshot
  ] = await Promise.all([
    getDocs(collection(db, COLLECTIONS.projects)),
    getDocs(collection(db, COLLECTIONS.users)),
    getDocs(collection(db, COLLECTIONS.quotes))
  ]);

  const projects = projectsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    deadline: doc.data().deadline?.toDate(),
    completedAt: doc.data().completedAt?.toDate(),
    paidAmount: doc.data().paidAmount || 0,
    status: doc.data().status || 'unknown',
    user_id: doc.data().user_id,
    name: doc.data().name,
  }));

  const users = usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    role: doc.data().role || 'client',
    name: doc.data().name || '',
    email: doc.data().email || '',
  }));

  const quotes = quotesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  }));

  // Calculate basic metrics
  let totalRevenue = 0;
  let activeProjects = 0;
  let completedProjects = 0;
  let totalProjectDuration = 0;
  let completedProjectsCount = 0;

  projects.forEach(project => {
    totalRevenue += project.paidAmount || 0;
    
    if (project.status === 'in_progress' || project.status === 'review') {
      activeProjects++;
    }
    
    if (project.status === 'completed') {
      completedProjects++;
      
      // Calculate project duration for completed projects
      if (project.createdAt && project.completedAt) {
        const durationMs = project.completedAt.getTime() - project.createdAt.getTime();
        const durationDays = durationMs / (1000 * 60 * 60 * 24);
        totalProjectDuration += durationDays;
        completedProjectsCount++;
      }
    }
  });

  // Calculate conversion rate (quotes to projects)
  const conversionRate = projects.length > 0 ? (projects.length / quotes.length) * 100 : 0;

  // Calculate average project value
  const averageProjectValue = projects.length > 0 ? totalRevenue / projects.length : 0;

  // Calculate average project duration
  const averageProjectDuration = completedProjectsCount > 0 
    ? totalProjectDuration / completedProjectsCount 
    : 0;

  // Calculate project completion rate
  const projectCompletionRate = projects.length > 0 
    ? (completedProjects / projects.length) * 100 
    : 0;

  // Calculate monthly revenue (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const monthlyRevenue = projects
    .filter(project => project.createdAt && project.createdAt >= thirtyDaysAgo)
    .reduce((sum, project) => sum + (project.paidAmount || 0), 0);

  // Calculate quarterly revenue (last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  const quarterlyRevenue = projects
    .filter(project => project.createdAt && project.createdAt >= ninetyDaysAgo)
    .reduce((sum, project) => sum + (project.paidAmount || 0), 0);

  // Calculate yearly revenue (last 365 days)
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);
  
  const yearlyRevenue = projects
    .filter(project => project.createdAt && project.createdAt >= oneYearAgo)
    .reduce((sum, project) => sum + (project.paidAmount || 0), 0);

  // Calculate returning clients
  const clientProjects = projects.reduce((acc, project) => {
    const clientId = project.user_id;
    if (clientId) {
      acc[clientId] = (acc[clientId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const returningClients = Object.values(clientProjects).filter(count => count > 1).length;

  // Generate revenue by month data (last 6 months)
  const revenueByMonth = generateRevenueByMonth(projects);

  // Generate projects by status
  const projectsByStatus = generateProjectsByStatus(projects);

  // Generate projects by type (if type data is available)
  const projectsByType = generateProjectsByType(projects);

  return {
    totalClients: users.filter(u => u.role !== 'admin').length,
    totalProjects: projects.length,
    activeProjects,
    completedProjects,
    totalRevenue,
    
    conversionRate: Math.round(conversionRate),
    averageProjectValue: Math.round(averageProjectValue),
    monthlyRevenue: Math.round(monthlyRevenue),
    quarterlyRevenue: Math.round(quarterlyRevenue),
    yearlyRevenue: Math.round(yearlyRevenue),
    
    averageProjectDuration: Math.round(averageProjectDuration),
    projectCompletionRate: Math.round(projectCompletionRate),
    
    returningClients,
    clientSatisfaction: calculateClientSatisfaction(projects), // Placeholder
    
    revenueByMonth,
    projectsByStatus,
    projectsByType,
  };
}

function generateRevenueByMonth(projects: any[]): { month: string; revenue: number }[] {
  const months: Record<string, number> = {};
  const now = new Date();
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    months[monthKey] = 0;
  }
  
  // Sum revenue by month
  projects.forEach(project => {
    if (project.createdAt && project.paidAmount) {
      const monthKey = project.createdAt.toLocaleDateString('pt-BR', { 
        month: 'short', 
        year: '2-digit' 
      });
      
      if (months[monthKey] !== undefined) {
        months[monthKey] += project.paidAmount;
      }
    }
  });
  
  return Object.entries(months).map(([month, revenue]) => ({
    month,
    revenue: Math.round(revenue)
  }));
}

function generateProjectsByStatus(projects: any[]): { status: string; count: number }[] {
  const statusCounts: Record<string, number> = {};
  
  projects.forEach(project => {
    const status = project.status || 'unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count
  }));
}

function generateProjectsByType(projects: any[]): { type: string; count: number }[] {
  // This is a placeholder - in a real implementation, you'd extract project types
  // from project data or use a separate field
  const typeCounts: Record<string, number> = {
    'website': 0,
    'app': 0,
    'system': 0,
    'ecommerce': 0,
    'other': 0
  };
  
projects.forEach(project => {
 // Simple heuristic to determine project type from name
 const name = (project.name || '').toLowerCase();

 if (name.includes('site') || name.includes('web') || name.includes('landing')) {
  typeCounts['website'] = (typeCounts['website'] ?? 0) + 1;
 } else if (name.includes('app') || name.includes('mobile')) {
  typeCounts['app'] = (typeCounts['app'] ?? 0) + 1;
 } else if (name.includes('sistema') || name.includes('system') || name.includes('erp') || name.includes('crm')) {
  typeCounts['system'] = (typeCounts['system'] ?? 0) + 1;
 } else if (name.includes('ecommerce') || name.includes('loja')) {
  typeCounts['ecommerce'] = (typeCounts['ecommerce'] ?? 0) + 1;
 } else {
  typeCounts['other'] = (typeCounts['other'] ?? 0) + 1;
 }
});
  
  return Object.entries(typeCounts)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      type,
      count
    }));
}

function calculateClientSatisfaction(projects: any[]): number {
  // Placeholder - in a real implementation, you'd use actual satisfaction data
  // from reviews, surveys, or completion rates
  const completedProjects = projects.filter(p => p.status === 'completed');
  
  if (completedProjects.length === 0) return 85; // Default
  
  // Simple heuristic based on project completion and rehire rate
  const baseSatisfaction = 80;
  const rehireBonus = 5; // Bonus for clients with multiple projects
  
  return Math.min(100, baseSatisfaction + rehireBonus);
}

export async function getTopClients(limit: number = 5): Promise<ClientAnalytics[]> {
  const projectsSnapshot = await getDocs(collection(db, COLLECTIONS.projects));
  const usersSnapshot = await getDocs(collection(db, COLLECTIONS.users));
  
  const projects = projectsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    user_id: doc.data().user_id,
    status: doc.data().status || 'unknown',
    paidAmount: doc.data().paidAmount || 0,
  }));

  const users = usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    role: doc.data().role || 'client',
    name: doc.data().name || '',
    email: doc.data().email || '',
  })).filter(user => user.role !== 'admin');
  
  const clientStats = users.map(user => {
    const clientProjects = projects.filter(project => project.user_id === user.id);
    const completedProjects = clientProjects.filter(p => p.status === 'completed');
    const totalSpent = clientProjects.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    
    return {
      id: user.id,
      name: user.name || 'Cliente',
      email: user.email,
      totalProjects: clientProjects.length,
      totalSpent,
      averageProjectValue: clientProjects.length > 0 ? totalSpent / clientProjects.length : 0,
      projectCompletionRate: clientProjects.length > 0 
        ? (completedProjects.length / clientProjects.length) * 100 
        : 0,
    };
  });
  
  return clientStats
    .filter(client => client.totalProjects > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
}

export async function getRecentActivity(itemsLimit: number = 10) {
  const q = query(
    collection(db, COLLECTIONS.projects),
    orderBy('createdAt', 'desc'),
    limit(itemsLimit)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  }));
}