export interface CompetitorPrice {
  competitor: string;
  service: string;
  price: number;
  features: string[];
  url?: string;
}

export interface PriceComparison {
  service: string;
  marketMin: number;
  marketMax: number;
  marketAverage: number;
  ourPrice: number;
  competitive: boolean;
  recommendation: string;
}

export const MARKET_PRICES: CompetitorPrice[] = [
  { competitor: 'Agências Premium', service: 'Site Institucional', price: 15000, features: ['CMS', 'SEO', 'Responsivo'] },
  { competitor: 'Agências Médias', service: 'Site Institucional', price: 8000, features: ['CMS', 'SEO'] },
  { competitor: 'Freelancers', service: 'Site Institucional', price: 3000, features: ['Básico'] },
  { competitor: 'Construtores (Wix)', service: 'Site Institucional', price: 1500, features: ['Template'] },
  
  { competitor: 'Agências Premium', service: 'E-commerce', price: 25000, features: ['Pagamentos', 'Estoque', 'Admin'] },
  { competitor: 'Agências Médias', service: 'E-commerce', price: 12000, features: ['Pagamentos', 'Estoque'] },
  { competitor: 'Shopify', service: 'E-commerce', price: 5000, features: ['Plataforma', 'Pagamentos'] },
  { competitor: 'Freelancers', service: 'E-commerce', price: 6000, features: ['Básico'] },
  
  { competitor: 'Agências Premium', service: 'Landing Page', price: 5000, features: ['Design', 'Otimização'] },
  { competitor: 'Agências Médias', service: 'Landing Page', price: 2500, features: ['Design'] },
  { competitor: 'Freelancers', service: 'Landing Page', price: 1200, features: ['Template'] },
  { competitor: 'Construtores', service: 'Landing Page', price: 500, features: ['Template'] },
  
  { competitor: 'Agências Premium', service: 'Sistema Web', price: 30000, features: ['Completo', 'API', 'Admin'] },
  { competitor: 'Agências Médias', service: 'Sistema Web', price: 15000, features: ['Completo', 'Admin'] },
  { competitor: 'Freelancers', service: 'Sistema Web', price: 8000, features: ['Básico'] },
];

export function comparePrices(serviceType: string, ourPrice: number): PriceComparison {
  const servicePrices = MARKET_PRICES.filter(p => 
    p.service.toLowerCase().includes(serviceType.toLowerCase())
  );

  if (servicePrices.length === 0) {
    return {
      service: serviceType,
      marketMin: 0,
      marketMax: 0,
      marketAverage: ourPrice,
      ourPrice,
      competitive: true,
      recommendation: 'Preço baseado em análise personalizada',
    };
  }

  const prices = servicePrices.map(p => p.price);
  const marketMin = Math.min(...prices);
  const marketMax = Math.max(...prices);
  const marketAverage = prices.reduce((a, b) => a + b, 0) / prices.length;

  const competitive = ourPrice <= marketAverage;

  let recommendation = '';
  if (ourPrice < marketMin) {
    recommendation = 'Preço muito abaixo do mercado - considere aumentar';
  } else if (ourPrice < marketAverage * 0.8) {
    recommendation = 'Preço competitivo - excelente para aquisição';
  } else if (ourPrice <= marketAverage) {
    recommendation = 'Preço justo - competitivo no mercado';
  } else if (ourPrice <= marketAverage * 1.2) {
    recommendation = 'Preço levemente acima - justificado por qualidade';
  } else {
    recommendation = 'Preço premium - emphasize diferenciais';
  }

  return {
    service: serviceType,
    marketMin,
    marketMax,
    marketAverage: Math.round(marketAverage),
    ourPrice,
    competitive,
    recommendation,
  };
}

export function getCompetitorAnalysis(): { service: string; competitors: number; avgPrice: number }[] {
  const services = ['Site Institucional', 'E-commerce', 'Landing Page', 'Sistema Web'];
  
  return services.map(service => {
    const prices = MARKET_PRICES.filter(p => p.service === service);
    return {
      service,
      competitors: prices.length,
      avgPrice: Math.round(prices.reduce((a, b) => a + b.price, 0) / prices.length),
    };
  });
}

export function generatePricingReport(): string {
  const services = ['Site Institucional', 'E-commerce', 'Landing Page'];
  
  let report = '📊 RELATÓRIO DE PREÇOS - MERCADO\n\n';
  
  for (const service of services) {
    const comparison = comparePrices(service, getOurPrice(service));
    report += `${service}:\n`;
    report += `  Mercado: R$ ${comparison.marketMin.toLocaleString('pt-BR')} - R$ ${comparison.marketMax.toLocaleString('pt-BR')}\n`;
    report += `  Média: R$ ${comparison.marketAverage.toLocaleString('pt-BR')}\n`;
    report += `  Nosso: R$ ${comparison.ourPrice.toLocaleString('pt-BR')}\n`;
    report += `  ${comparison.competitive ? '✅' : '⚠️'} ${comparison.recommendation}\n\n`;
  }
  
  return report;
}

function getOurPrice(service: string): number {
  const prices: Record<string, number> = {
    'Site Institucional': 2500,
    'E-commerce': 6997,
    'Landing Page': 997,
    'Sistema Web': 7997,
  };
  return prices[service] || 2000;
}

export function getMarketPosition(price: number, serviceType: string): string {
  const comparison = comparePrices(serviceType, price);
  
  if (comparison.marketMin === 0) return 'custom';
  
  const ratio = price / comparison.marketAverage;
  
  if (ratio < 0.5) return 'budget';
  if (ratio < 0.8) return 'economy';
  if (ratio < 1.2) return 'mid-market';
  if (ratio < 2) return 'premium';
  return 'luxury';
}