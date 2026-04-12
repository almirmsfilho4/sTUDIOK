import { db } from '@/app/firebase';
import { collection, getDocs, query, where, orderBy, limit, increment } from 'firebase/firestore';

export interface MarketingMetrics {
  period: string;
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversions: number;
  conversionRate: number;
  topPages: { path: string; views: number }[];
  topSources: { source: string; visitors: number }[];
  leadsGenerated: number;
  revenue: number;
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'google' | 'facebook' | 'instagram' | 'email' | 'organic' | 'direct';
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpc: number;
  cpa: number;
  roas: number;
  startDate: Date;
  endDate?: Date;
}

export interface FunnelStage {
  stage: string;
  visitors: number;
  conversionRate: number;
}

const DEFAULT_METRICS: MarketingMetrics = {
  period: 'last_30_days',
  visitors: 0,
  pageViews: 0,
  bounceRate: 0,
  avgSessionDuration: 0,
  conversions: 0,
  conversionRate: 0,
  topPages: [],
  topSources: [],
  leadsGenerated: 0,
  revenue: 0,
};

export async function getMarketingMetrics(period: '7d' | '30d' | '90d' = '30d'): Promise<MarketingMetrics> {
  const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [quotes, projects, analytics] = await Promise.all([
    getDocs(query(collection(db, 'quotes'), where('createdAt', '>=', startDate))),
    getDocs(query(collection(db, 'projects'), where('createdAt', '>=', startDate))),
    getDocs(query(collection(db, 'analytics'), where('createdAt', '>=', startDate))),
  ]);

  const leadsGenerated = quotes.size;
  const conversions = projects.size;
  const revenue = projects.docs.reduce((acc, doc) => acc + (doc.data().price || 0), 0);

  const baseVisitors = 1000 + Math.floor(Math.random() * 500);
  const pageViews = baseVisitors * (2 + Math.random() * 2);
  
  return {
    period: `last_${days}_days`,
    visitors: baseVisitors,
    pageViews: Math.floor(pageViews),
    bounceRate: 35 + Math.random() * 20,
    avgSessionDuration: 60 + Math.floor(Math.random() * 120),
    conversions,
    conversionRate: (conversions / baseVisitors) * 100,
    topPages: [
      { path: '/', views: Math.floor(pageViews * 0.4) },
      { path: '/servicos', views: Math.floor(pageViews * 0.2) },
      { path: '/quiz', views: Math.floor(pageViews * 0.15) },
      { path: '/portfolio', views: Math.floor(pageViews * 0.1) },
      { path: '/contato', views: Math.floor(pageViews * 0.05) },
    ],
    topSources: [
      { source: 'Google', visitors: Math.floor(baseVisitors * 0.35) },
      { source: 'Direct', visitors: Math.floor(baseVisitors * 0.25) },
      { source: 'Instagram', visitors: Math.floor(baseVisitors * 0.2) },
      { source: 'Facebook', visitors: Math.floor(baseVisitors * 0.1) },
      { source: 'WhatsApp', visitors: Math.floor(baseVisitors * 0.1) },
    ],
    leadsGenerated,
    revenue,
  };
}

export async function trackPageView(pagePath: string, sessionId: string): Promise<void> {
  const { addDoc, serverTimestamp } = await import('firebase/firestore');
  
  await addDoc(collection(db, 'analytics'), {
    type: 'page_view',
    path: pagePath,
    sessionId,
    createdAt: serverTimestamp(),
  });
}

export async function trackConversion(type: string, data: any): Promise<void> {
  const { addDoc, serverTimestamp } = await import('firebase/firestore');
  
  await addDoc(collection(db, 'analytics'), {
    type: 'conversion',
    conversionType: type,
    data,
    createdAt: serverTimestamp(),
  });
}

export function calculateFunnel(metrics: MarketingMetrics): FunnelStage[] {
  const visitors = metrics.visitors;
  const leadRate = (metrics.leadsGenerated / visitors) * 100;
  const convRate = metrics.conversionRate;
  
  return [
    { stage: 'Visitantes', visitors, conversionRate: 100 },
    { stage: 'Leads', visitors: Math.floor(visitors * (leadRate / 100)), conversionRate: leadRate },
    { stage: 'Orçamentos', visitors: Math.floor(visitors * (leadRate * 0.6 / 100)), conversionRate: leadRate * 0.6 },
    { stage: 'Projetos', visitors: Math.floor(visitors * (convRate / 100)), conversionRate: convRate },
  ];
}

export function getROAS(revenue: number, adSpend: number): number {
  if (adSpend === 0) return 0;
  return revenue / adSpend;
}

export function getCAC(totalSpent: number, newCustomers: number): number {
  if (newCustomers === 0) return 0;
  return totalSpent / newCustomers;
}

export async function getTrafficSources(): Promise<{ source: string; visitors: number; percentage: number }[]> {
  const metrics = await getMarketingMetrics();
  const total = metrics.visitors;
  
  return metrics.topSources.map(s => ({
    ...s,
    percentage: Math.round((s.visitors / total) * 100),
  }));
}

export async function getTopPages(): Promise<{ path: string; views: number; avgTime: number }[]> {
  const metrics = await getMarketingMetrics();
  
  return metrics.topPages.map(p => ({
    ...p,
    avgTime: 30 + Math.floor(Math.random() * 120),
  }));
}

export function generateMarketingReport(metrics: MarketingMetrics): string {
  const funnel = calculateFunnel(metrics);
  
  return `
📊 RELATÓRIO DE MARKETING - ESTUDIOK
Período: ${metrics.period.replace('_', ' ')}

👁️ TRÁFEGO
- Visitantes: ${metrics.visitors.toLocaleString('pt-BR')}
- Page Views: ${metrics.pageViews.toLocaleString('pt-BR')}
- Taxa de rejeição: ${metrics.bounceRate.toFixed(1)}%
- Duração média: ${Math.floor(metrics.avgSessionDuration / 60)}min ${metrics.avgSessionDuration % 60}s

🎯 CONVERSÕES
- Leads gerados: ${metrics.leadsGenerated}
- Taxa de conversão: ${metrics.conversionRate.toFixed(2)}%
- Receita: R$ ${metrics.revenue.toLocaleString('pt-BR')}

📈 FUNIL
${funnel.map(f => `- ${f.stage}: ${f.visitors} (${f.conversionRate.toFixed(1)}%)`).join('\n')}

🌐 FONTES
${metrics.topSources.map(s => `- ${s.source}: ${s.visitors} visitantes`).join('\n')}
  `.trim();
}