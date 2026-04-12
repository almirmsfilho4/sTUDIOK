import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface DemoProject {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'site' | 'ecommerce' | 'app' | 'sistema';
  thumbnail: string;
  previewUrl: string;
  codeUrl?: string;
  features: string[];
  framework: string;
  popular: boolean;
  createdAt: Date;
}

const DEMO_PROJECTS: Omit<DemoProject, 'id' | 'createdAt'>[] = [
  {
    name: 'E-commerce Fashion',
    slug: 'ecommerce-fashion',
    description: 'Loja virtual completa para moda e acessórios',
    category: 'ecommerce',
    thumbnail: '/demos/ecommerce-fashion.jpg',
    previewUrl: 'https://demo-estudiok.vercel.app/fashion',
    features: ['Catálogo produtos', 'Carrinho', 'Checkout', 'Painel admin', 'Blog'],
    framework: 'Next.js 14',
    popular: true,
  },
  {
    name: 'Restaurant Website',
    slug: 'restaurant-website',
    description: 'Site moderno para restaurantes com cardápio online',
    category: 'site',
    thumbnail: '/demos/restaurant.jpg',
    previewUrl: 'https://demo-estudiok.vercel.app/restaurant',
    features: ['Cardápio digital', 'Reservas', 'Galeria', 'Contato', 'SEO'],
    framework: 'Next.js 14',
    popular: true,
  },
  {
    name: 'SaaS Dashboard',
    slug: 'saas-dashboard',
    description: 'Dashboard administrativo para sistemas SaaS',
    category: 'sistema',
    thumbnail: '/demos/dashboard.jpg',
    previewUrl: 'https://demo-estudiok.vercel.app/dashboard',
    features: ['Gráficos', 'Tabelas', 'Autenticação', 'API REST', 'Dark mode'],
    framework: 'Next.js 14 + Tailwind',
    popular: true,
  },
  {
    name: 'Delivery App',
    slug: 'delivery-app',
    description: 'App de delivery com tracking em tempo real',
    category: 'app',
    thumbnail: '/demos/delivery.jpg',
    previewUrl: 'https://demo-estudiok.vercel.app/delivery',
    features: ['Cardápio', 'Carrinho', 'Rastreamento', 'Notificações', 'Avaliações'],
    framework: 'React Native',
    popular: false,
  },
  {
    name: 'Portfolio Freelancer',
    slug: 'portfolio-freelancer',
    description: 'Portfólio profissional para freelancers',
    category: 'site',
    thumbnail: '/demos/portfolio.jpg',
    previewUrl: 'https://demo-estudiok.vercel.app/portfolio',
    features: ['Showcase projetos', 'Depoimentos', 'Contato', 'Blog', 'Dark mode'],
    framework: 'Next.js 14',
    popular: false,
  },
  {
    name: 'Booking System',
    slug: 'booking-system',
    description: 'Sistema de reservas para serviços',
    category: 'sistema',
    thumbnail: '/demos/booking.jpg',
    previewUrl: 'https://demo-estudiok.vercel.app/booking',
    features: ['Calendário', 'Agendamento', 'Pagamentos', 'Email notifications'],
    framework: 'Next.js 14',
    popular: false,
  },
];

export async function getDemoProjects(category?: string): Promise<DemoProject[]> {
  let projects = DEMO_PROJECTS.map((p, i) => ({ ...p, id: `demo-${i}`, createdAt: new Date() }));
  
  if (category) {
    projects = projects.filter(p => p.category === category);
  }
  
  return projects;
}

export async function getDemoProject(slug: string): Promise<DemoProject | null> {
  const project = DEMO_PROJECTS.find(p => p.slug === slug);
  if (!project) return null;
  
  return { ...project, id: `demo-${DEMO_PROJECTS.indexOf(project)}`, createdAt: new Date() };
}

export async function forkDemoProject(projectId: string, userId: string): Promise<string> {
  const project = DEMO_PROJECTS[parseInt(projectId.replace('demo-', ''))];
  if (!project) throw new Error('Projeto não encontrado');
  
  const docRef = await addDoc(collection(db, 'forkedProjects'), {
    demoProjectId: projectId,
    userId,
    name: `${project.name} (Cópia)`,
    forkedAt: new Date(),
  });
  
  return docRef.id;
}