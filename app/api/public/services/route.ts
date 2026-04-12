import { NextRequest, NextResponse } from 'next/server';

const services = [
  {
    id: 'site',
    name: 'Site Institucional',
    description: 'Sites modernos e profissionais para sua empresa',
    price: { min: 1500, max: 3500 },
    features: ['Design responsivo', 'SEO básico', 'Formulários', 'Painel admin'],
    deliveryDays: 7,
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Páginas de captura e vendas de alta conversão',
    price: { min: 800, max: 1500 },
    features: ['Design persuasivo', 'Formulários', 'Integração email', 'SEO'],
    deliveryDays: 5,
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Loja virtual completa com gestão de produtos',
    price: { min: 3500, max: 8000 },
    features: ['Catálogo produtos', 'Pagamentos', 'Frete', 'Painel admin', 'Relatórios'],
    deliveryDays: 14,
  },
  {
    id: 'app',
    name: 'App Mobile',
    description: 'Aplicativos iOS e Android para seu negócio',
    price: { min: 5000, max: 15000 },
    features: ['iOS & Android', 'Notificações', 'API', 'Painel admin'],
    deliveryDays: 30,
  },
  {
    id: 'sistema',
    name: 'Sistema Web',
    description: 'Sistemas personalizados para automatizar processos',
    price: { min: 8000, max: 25000 },
    features: ['Multi usuários', 'Relatórios', 'API', 'Automação'],
    deliveryDays: 45,
  },
];

const portfolio = [
  {
    id: '1',
    title: 'Loja Virtual Fashion',
    category: 'ecommerce',
    image: '/portfolio/fashion-store.jpg',
    description: 'E-commerce completo para loja de moda',
    link: 'https://exemplo1.com',
  },
  {
    id: '2',
    title: 'Clínica Saúde',
    category: 'site',
    image: '/portfolio/clinic.jpg',
    description: 'Site institucional para clínica médica',
    link: 'https://exemplo2.com',
  },
  {
    id: '3',
    title: 'App Delivery',
    category: 'app',
    image: '/portfolio/delivery-app.jpg',
    description: 'App de delivery com tracking',
    link: 'https://exemplo3.com',
  },
  {
    id: '4',
    title: 'Portal Imobiliário',
    category: 'sistema',
    image: '/portfolio/real-estate.jpg',
    description: 'Sistema de gestão imobiliária',
    link: 'https://exemplo4.com',
  },
];

const testimonials = [
  {
    id: '1',
    name: 'João Silva',
    company: 'Fashion Store',
    avatar: '/avatars/avatar1.jpg',
    rating: 5,
    text: 'Excelente trabalho! Entregaram antes do prazo e o resultado superou expectativas.',
  },
  {
    id: '2',
    name: 'Maria Santos',
    company: 'Clínica Saúde',
    avatar: '/avatars/avatar2.jpg',
    rating: 5,
    text: 'Profissionais muito competentes. Recomendo para todos que precisam de um site.',
  },
  {
    id: '3',
    name: 'Pedro Costa',
    company: 'Delivery App',
    avatar: '/avatars/avatar3.jpg',
    rating: 4,
    text: 'Ótimo atendimento e suporte. O app ficou exatamente como imaginávamos.',
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resource = searchParams.get('resource');
  
  switch (resource) {
    case 'services':
      return NextResponse.json({ services });
    case 'portfolio':
      return NextResponse.json({ portfolio });
    case 'testimonials':
      return NextResponse.json({ testimonials });
    default:
      return NextResponse.json({
        message: 'ESTUDIOK Public API',
        availableResources: ['services', 'portfolio', 'testimonials'],
        example: '/api/public?resource=services',
      });
  }
}