import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  notHelpful: number;
  order: number;
  active: boolean;
  createdAt: Date;
}

export const DEFAULT_FAQS: Omit<FAQItem, 'id' | 'views' | 'helpful' | 'notHelpful' | 'createdAt'>[] = [
  {
    question: 'Quanto tempo leva para criar um site?',
    answer: 'O tempo varia conforme a complexidade. Uma landing page leva 5-7 dias, um site institucional 15-30 dias, e um e-commerce 30-60 dias.',
    category: 'Geral',
    tags: ['prazo', 'tempo', 'duração'],
    order: 1,
    active: true,
  },
  {
    question: 'Quais formas de pagamento aceitam?',
    answer: 'Aceitamos PIX, cartão de crédito (parcelado em até 12x), boleto bancário e transferência bancária.',
    category: 'Pagamento',
    tags: ['pagamento', 'parcelamento', 'cartão'],
    order: 2,
    active: true,
  },
  {
    question: 'Inclui hospedagem e domínio?',
    answer: 'Sim, incluímos 1 ano de hospedagem e domínio .com ou .com.br gratuito no primeiro ano.',
    category: 'Serviços',
    tags: ['hospedagem', 'domínio', 'incluído'],
    order: 3,
    active: true,
  },
  {
    question: 'Posso editar o site depois de pronto?',
    answer: 'Sim! Todos os nossos sites incluem um painel admin fácil de usar para você atualizar conteúdos sem conhecimento técnico.',
    category: 'Técnico',
    tags: ['CMS', 'painel', 'editar'],
    order: 4,
    active: true,
  },
  {
    question: 'O site fica otimizado para o Google (SEO)?',
    answer: 'Sim, todos os sites incluem otimização SEO básica: meta tags, sitemap, robots.txt, URLs amigáveis e estrutura semântica.',
    category: 'Marketing',
    tags: ['SEO', 'Google', 'otimização'],
    order: 5,
    active: true,
  },
  {
    question: 'E se eu precisar de alterações depois da entrega?',
    answer: 'Oferecemos 30 dias de suporte gratuito após a entrega, e alterações simples podem ser feitas nesse período.',
    category: 'Suporte',
    tags: ['suporte', 'alterações', 'garantia'],
    order: 6,
    active: true,
  },
];

export async function getFAQs(category?: string): Promise<FAQItem[]> {
  let q;
  if (category) {
    q = query(collection(db, 'faqs'), where('category', '==', category), where('active', '==', true), orderBy('order'));
  } else {
    q = query(collection(db, 'faqs'), where('active', '==', true), orderBy('order'));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as FAQItem));
}

export async function getFAQById(id: string): Promise<FAQItem | null> {
  const q = query(collection(db, 'faqs'), where('__name__', '==', id));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  return { id: doc.id, ...doc.data(), createdAt: new Date() } as FAQItem;
}

export async function searchFAQs(term: string): Promise<FAQItem[]> {
  const all = await getFAQs();
  const searchLower = term.toLowerCase();
  
  return all.filter(faq => 
    faq.question.toLowerCase().includes(searchLower) ||
    faq.answer.toLowerCase().includes(searchLower) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
}

export async function incrementFAQViews(id: string): Promise<void> {
  const { increment } = await import('firebase/firestore');
  await updateDoc(doc(db, 'faqs', id), { views: increment(1) });
}

export async function markHelpful(id: string, helpful: boolean): Promise<void> {
  const { increment } = await import('firebase/firestore');
  const field = helpful ? 'helpful' : 'notHelpful';
  await updateDoc(doc(db, 'faqs', id), { [field]: increment(1) });
}

export async function getFAQCategories(): Promise<string[]> {
  const all = await getFAQs();
  const categories = Array.from(new Set(all.map(faq => faq.category)));
  return categories;
}

export function getPopularFAQs(faqs: FAQItem[], limit = 5): FAQItem[] {
  return [...faqs].sort((a, b) => b.views - a.views).slice(0, limit);
}