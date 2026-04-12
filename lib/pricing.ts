export const PRICING = {
  projectTypes: {
    site: { basePrice: 1500, name: 'Site Institucional' },
    app: { basePrice: 5000, name: 'Aplicativo Mobile' },
    sistema: { basePrice: 8000, name: 'Sistema Web' },
    ecommerce: { basePrice: 3500, name: 'E-commerce' },
    landing: { basePrice: 800, name: 'Landing Page' },
  },
  features: {
    login: 500,
    payment: 800,
    adminPanel: 1200,
    api: 600,
    chat: 400,
    notifications: 300,
    analytics: 500,
    cms: 1000,
    blog: 400,
    seo: 600,
    responsive: 300,
    multiLanguage: 800,
  },
  complexity: {
    basic: 1,
    medium: 1.5,
    high: 2.5,
  },
  deadline: {
    urgent: 0.3,
    fast: 0.15,
    normal: 0,
  },
};

export function calculatePrice(
  projectType: string,
  features: string[],
  complexity: string,
  deadline: string
): { price: number; days: number } {
  let price = PRICING.projectTypes[projectType as keyof typeof PRICING.projectTypes]?.basePrice || 1500;

  features.forEach((feature) => {
    price += PRICING.features[feature as keyof typeof PRICING.features] || 0;
  });

  price *= PRICING.complexity[complexity as keyof typeof PRICING.complexity] || 1;
  price += price * (PRICING.deadline[deadline as keyof typeof PRICING.deadline] || 0);

  let days = 7;
  if (projectType === 'site') days = 7;
  if (projectType === 'landing') days = 7;
  if (projectType === 'app') days = 14;
  if (projectType === 'sistema') days = 21;
  if (projectType === 'ecommerce') days = 10;

  if (deadline === 'urgent') days = Math.floor(days * 0.5);
  if (deadline === 'fast') days = Math.floor(days * 0.7);
  if (deadline === 'flexible') days = Math.floor(days * 1.3);

  // Limite máximo de dias
  if (projectType === 'app') {
    days = Math.min(days, 30);
  } else if (projectType === 'sistema') {
    days = Math.min(days, 25);
  } else {
    days = Math.min(days, 10);
  }

  return {
    price: Math.round(price),
    days,
  };
}

export const PLANS = [
  {
    id: 'basico',
    name: 'Básico',
    price: 1500,
    features: [
      'Site institucional até 5 páginas',
      'Design responsivo',
      'Formulário de contato',
      'Integração com analytics',
      'Suporte por 30 dias',
    ],
    popular: false,
  },
  {
    id: 'profissional',
    name: 'Profissional',
    price: 3500,
    features: [
      'Site completo até 10 páginas',
      'Design responsivo e premium',
      'Painel administrativo (CMS)',
      'Blog integrado',
      'SEO otimizado',
      'Formulários avançados',
      'Suporte por 60 dias',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 8000,
    features: [
      'Sistema web completo',
      'Múltiplos usuários',
      'Painel administrativo',
      'Integração com APIs',
      'Banco de dados dedicado',
      'Automações',
      'Suporte prioritário',
      'Manutenção inclusa',
    ],
    popular: false,
  },
];