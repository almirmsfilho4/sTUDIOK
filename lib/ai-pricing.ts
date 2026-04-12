import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';

export interface QuoteAnalysis {
  id?: string;
  quoteId: string;
  serviceType: string;
  complexity: 'simple' | 'medium' | 'high' | 'enterprise';
  estimatedPrice: number;
  priceRange: { min: number; max: number };
  reasoning: string[];
  recommendations: string[];
  timeline: string;
  features: string[];
  excludedFeatures: string[];
  confidence: number;
  analyzedAt: Date;
}

interface PricingRule {
  basePrice: number;
  multipliers: {
    [key: string]: number;
  };
}

const SERVICE_PRICING: { [key: string]: PricingRule } = {
  'Site Institucional': { basePrice: 1500, multipliers: { simple: 0.7, medium: 1, high: 1.5, enterprise: 3 } },
  'E-commerce': { basePrice: 4500, multipliers: { simple: 0.8, medium: 1, high: 1.8, enterprise: 4 } },
  'Landing Page': { basePrice: 800, multipliers: { simple: 0.6, medium: 1, high: 1.3, enterprise: 2 } },
  'Blog': { basePrice: 2000, multipliers: { simple: 0.7, medium: 1, high: 1.4, enterprise: 2.5 } },
  'Portal': { basePrice: 8000, multipliers: { simple: 0.8, medium: 1, high: 1.6, enterprise: 3 } },
  'App Mobile': { basePrice: 12000, multipliers: { simple: 0.7, medium: 1, high: 2, enterprise: 5 } },
  'Sistema Web': { basePrice: 10000, multipliers: { simple: 0.6, medium: 1, high: 2, enterprise: 4 } },
  'Dashboard': { basePrice: 6000, multipliers: { simple: 0.7, medium: 1, high: 1.5, enterprise: 3 } },
};

const FEATURE_PRICES: { [key: string]: number } = {
  'CMS': 500,
  'Login/Autenticação': 800,
  'Chat': 1200,
  'Pagamentos': 1500,
  'Email Marketing': 600,
  'SEO': 400,
  'Blog': 800,
  'Multilingual': 1000,
  'API Integration': 1500,
  'Analytics': 300,
  'Responsivo': 400,
  'Animations': 600,
  'Admin Panel': 2000,
  'User Dashboard': 1500,
  'Notifications': 500,
  'Export PDF': 700,
  'Social Login': 400,
  '2FA': 300,
};

const COMPLEXITY_INDICATORS = {
  simple: ['1-3 páginas', 'template', 'sem banco de dados', 'estático', 'basico'],
  medium: ['5-10 páginas', 'cms', 'banco de dados simples', 'dinâmico', 'intermediário'],
  high: ['10+ páginas', 'múltiplos módulos', 'banco de dados complexo', 'api', 'avançado'],
  enterprise: ['sistema completo', 'múltiplos apps', 'microservices', 'alta escala', 'corporativo'],
};

export async function analyzeQuote(quoteData: {
  serviceType: string;
  pages?: number;
  features?: string[];
  objective?: string;
  deadline?: string;
  budget?: number;
  description?: string;
}): Promise<QuoteAnalysis> {
  const pricing = SERVICE_PRICING[quoteData.serviceType] || { basePrice: 2000, multipliers: { simple: 0.8, medium: 1, high: 1.5, enterprise: 3 } };
  
  let complexity: 'simple' | 'medium' | 'high' | 'enterprise' = 'medium';
  const allText = `${quoteData.description} ${quoteData.objective} ${quoteData.features?.join(' ')}`.toLowerCase();
  
  if (allText.match(/simples|básico|one page|estático|template/)) complexity = 'simple';
  if (allText.match(/complexo|avançado|multiplos|módulo|corporativo|enterprise|grande/)) complexity = 'high';
  if (allText.match(/sistema|plataforma|app|mobile|api/)) complexity = 'enterprise';
  
  if (quoteData.pages && quoteData.pages > 20) complexity = 'high';
  if (quoteData.pages && quoteData.pages > 50) complexity = 'enterprise';
  
  let basePrice = pricing.basePrice * (pricing.multipliers[complexity] ?? 1);
  
  if (quoteData.pages && quoteData.pages > 5) {
    basePrice += (quoteData.pages - 5) * 150;
  }
  
  let features: string[] = [];
  let excludedFeatures: string[] = [];
  
  if (quoteData.features && quoteData.features.length > 0) {
    quoteData.features.forEach(feature => {
const featureKey = Object.keys(FEATURE_PRICES).find(k =>
  feature.toLowerCase().includes(k.toLowerCase())
 );
 if (featureKey && FEATURE_PRICES[featureKey]) {
  basePrice += FEATURE_PRICES[featureKey]!;
  features.push(featureKey);
 } else {
  features.push(feature);
 }
    });
  }
  
  if (quoteData.budget && quoteData.budget < basePrice * 0.7) {
    excludedFeatures = features.slice(-2);
    features = features.slice(0, -2);
    basePrice *= 0.8;
  }
  
  const deadlineMultiplier = getDeadlineMultiplier(quoteData.deadline);
  if (deadlineMultiplier > 1) {
    basePrice *= deadlineMultiplier;
  }
  
  const priceRange = {
    min: Math.round(basePrice * 0.85),
    max: Math.round(basePrice * 1.2),
  };
  
  const reasoning = generateReasoning(quoteData, complexity, features, priceRange);
  const recommendations = generateRecommendations(quoteData, complexity);
  const timeline = estimateTimeline(quoteData, complexity);
  const confidence = calculateConfidence(quoteData);
  
  return {
    quoteId: '',
    serviceType: quoteData.serviceType,
    complexity,
    estimatedPrice: Math.round(basePrice),
    priceRange,
    reasoning,
    recommendations,
    timeline,
    features,
    excludedFeatures,
    confidence,
    analyzedAt: new Date(),
  };
}

function getDeadlineMultiplier(deadline?: string): number {
  if (!deadline) return 1;
  
  const d = deadline.toLowerCase();
  if (d.match(/urgente|immediately|48h|72h|1 dia/)) return 1.5;
  if (d.match(/rápido|fast|1 semana/)) return 1.3;
  if (d.match(/normal|padrão|2 semanas|15 dias/)) return 1;
  if (d.match(/lento|flexível|30 dias|mês/)) return 0.9;
  if (d.match(/longo|2 meses|60 dias/)) return 0.85;
  
  return 1;
}

function generateReasoning(quoteData: any, complexity: string, features: string[], priceRange: { min: number; max: number }): string[] {
  const reasoning = [
    `Serviço: ${quoteData.serviceType} (complexidade: ${complexity})`,
    `Preço base calculado a partir de média de mercado`,
  ];
  
  if (quoteData.pages) {
    reasoning.push(`${quoteData.pages} páginas planejadas`);
  }
  
  if (features.length > 0) {
    reasoning.push(`${features.length} funcionalidades inclusas: ${features.slice(0, 3).join(', ')}${features.length > 3 ? '...' : ''}`);
  }
  
  if (quoteData.deadline) {
    reasoning.push(`Prazo solicitado: ${quoteData.deadline}`);
  }
  
  reasoning.push(`Faixa de preço: R$ ${priceRange.min.toLocaleString('pt-BR')} - R$ ${priceRange.max.toLocaleString('pt-BR')}`);
  
  return reasoning;
}

function generateRecommendations(quoteData: any, complexity: string): string[] {
  const recommendations = [];
  
  if (complexity === 'simple') {
    recommendations.push('Considere adicionar um blog para SEO');
  }
  
  if (!quoteData.features?.includes('SEO')) {
    recommendations.push('Sugerimos incluir pacote SEO básico');
  }
  
  if (!quoteData.features?.includes('Responsivo')) {
    recommendations.push('Todos os sites devem ser responsivos (já incluso)');
  }
  
  if (quoteData.budget && quoteData.budget < 1000) {
    recommendations.push('Orçamento limitado: considere landing page ao invés de site completo');
  }
  
  if (quoteData.objective?.toLowerCase().includes('venda')) {
    recommendations.push('Para e-commerce, considere pacote de pagamentos integrado');
  }
  
  recommendations.push('Incluímos 30 dias de garantia pós-entrega');
  
  return recommendations;
}

function estimateTimeline(quoteData: any, complexity: string): string {
  const base: Record<string, number> = { simple: 7, medium: 14, high: 30, enterprise: 60 };
  let days = base[complexity] || 14;
  
  if (quoteData.pages && quoteData.pages > 10) days += 7;
  if (quoteData.features && quoteData.features.length > 5) days += 5;
  
  if (quoteData.deadline) {
    const d = quoteData.deadline.toLowerCase();
    if (d.match(/1 semana/)) return '7 dias';
    if (d.match(/2 semanas|15 dias/)) return '14 dias';
    if (d.match(/mês|30 dias/)) return '30 dias';
  }
  
  return `${days} dias úteis`;
}

function calculateConfidence(quoteData: any): number {
  let confidence = 50;
  
  if (quoteData.serviceType) confidence += 15;
  if (quoteData.pages) confidence += 10;
  if (quoteData.features && quoteData.features.length > 0) confidence += 15;
  if (quoteData.description && quoteData.description.length > 50) confidence += 10;
  
  return Math.min(confidence, 95);
}

export async function saveQuoteAnalysis(quoteId: string, analysis: QuoteAnalysis): Promise<string> {
  const docRef = await addDoc(collection(db, 'quoteAnalyses'), {
    ...analysis,
    quoteId,
    analyzedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getQuoteAnalysis(quoteId: string): Promise<QuoteAnalysis | null> {
  const q = query(collection(db, 'quoteAnalyses'), where('quoteId', '==', quoteId));
const snapshot = await getDocs(q);

 if (snapshot.empty) return null;

 const doc = snapshot.docs[0];
 if (!doc) return null;
 const data = doc.data();
 return {
  ...data,
  analyzedAt: data.analyzedAt?.toDate(),
 } as QuoteAnalysis;
}

export function getPricingRecommendation(serviceType: string, budget: number): string {
  const pricing = SERVICE_PRICING[serviceType];
  if (!pricing) return 'Entre em contato para orçamento personalizado';
  
  if (budget >= pricing.basePrice * 2) {
    return 'Orçamento para projeto premium';
  } else if (budget >= pricing.basePrice) {
    return 'Orçamento adequado para escopo padrão';
  } else if (budget >= pricing.basePrice * 0.7) {
    return 'Orçamento limitado - sugerimos escopo reduzido';
  } else {
    return 'Orçamento muito baixo - considere faseamento do projeto';
  }
}