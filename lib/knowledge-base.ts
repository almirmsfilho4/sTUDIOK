import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  coverImage?: string;
  readTime: number;
  views: number;
  createdAt: Date;
}

const DEFAULT_ARTICLES: Omit<Article, 'id' | 'createdAt'>[] = [
  {
    title: 'Como ter um site Profissional em 48 horas',
    slug: 'como-ter-site-profissional-48-horas',
    excerpt: 'Aprenda o passo a passo para ter seu site pronto rapidamente com resultados profissionais.',
    content: `
# Como ter um site profissional em 48 horas

Ter um site profissional é essencial para qualquer negócio hoje em dia. Com as ferramentas certas e um processo eficiente, é possível ter seu site上线 em apenas 48 horas.

## Passo 1: Defina seu objetivo

Antes de tudo, pense no objetivo do seu site:
- Vendendo produtos? → E-commerce
- Gerando leads? → Landing page
- Informando clientes? → Site institucional

## Passo 2: Escolha os elementos essenciais

- Design responsivo (funciona no mobile)
- Formulário de contato
- Otimização para SEO
- SSL de segurança

## Passo 3: Conte com profissionais experientes

Na ESTUDIOK, temos processos otimizados para entregar sites de alta qualidade em tempo rekord.
    `,
    category: 'Guias',
    tags: ['site', 'profissional', '48 horas', 'guia'],
    author: 'ESTUDIOK',
    readTime: 5,
    views: 1250,
  },
  {
    title: 'SEO para pequenos negócios: Guia completo',
    slug: 'seo-para-pequenos-negocios',
    excerpt: 'Aprenda as técnicas de SEO que podem colocar seu negócio nas primeiras posições do Google.',
    content: `
# SEO para pequenos negócios

SEO (Search Engine Optimization) não é apenas para grandes empresas. Pequenos negócios podem se beneficiar muito com as técnicas certas.

## O que é SEO?

SEO é o conjunto de técnicas que ajudam seu site a aparecer nas primeiras posições do Google quando alguém busca seus serviços.

## Principais técnicas

1. **Palavras-chave relevantes** - Use termos que seus clientes buscam
2. **Conteúdo de qualidade** - Posts que respondem dúvidas
3. **Velocidade do site** - Sites rápidos rankeiam melhor
4. **Mobile-first** - Seu site precisa funcionar bem no celular
    `,
    category: 'Marketing Digital',
    tags: ['seo', 'google', 'marketing', 'visibilidade'],
    author: 'ESTUDIOK',
    readTime: 8,
    views: 890,
  },
  {
    title: 'Por que ter um app para seu negócio?',
    slug: 'por-que-ter-app-negocio',
    excerpt: 'Descubra as vantagens de ter um aplicativo móvel para sua empresa e como isso pode aumentar suas vendas.',
    content: `
# Por que ter um app para seu negócio?

Um aplicativo móvel pode transformar a forma como você interage com seus clientes.

## Vantagens do App

- **Presença constante** - Seu cliente sempre tem você na mão
- **Notificações push** - Mande promoções diretas
- **Experiência personalizada** - Use dados para oferecer melhor experiência
- **Diferencial competitivo** - Mostre inovação
    `,
    category: 'App Mobile',
    tags: ['app', 'mobile', 'negócio', 'vendas'],
    author: 'ESTUDIOK',
    readTime: 6,
    views: 720,
  },
];

export async function getArticles(category?: string): Promise<Article[]> {
  let q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
  
  if (category) {
    q = query(collection(db, 'articles'), where('category', '==', category), orderBy('createdAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return DEFAULT_ARTICLES.map((article, index) => ({
      ...article,
      id: `default-${index}`,
      createdAt: new Date(),
    }));
  }
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const q = query(collection(db, 'articles'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  
if (snapshot.empty) {
    const defaultArticle = DEFAULT_ARTICLES.find(a => a.slug === slug);
    if (defaultArticle) {
      return { ...defaultArticle, id: 'default', createdAt: new Date() };
    }
    return null;
  }

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return { id: doc.id, ...data, createdAt: data.createdAt?.toDate() } as Article;
}

export async function createArticle(article: Omit<Article, 'id' | 'createdAt' | 'views'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'articles'), {
    ...article,
    views: 0,
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function incrementArticleViews(articleId: string): Promise<void> {
  const docRef = doc(db, 'articles', articleId);
  await updateDoc(docRef, {
    views: increment(1),
  });
}

function increment(n: number) {
  return { __increment: n };
}