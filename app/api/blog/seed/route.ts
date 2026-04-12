import { NextRequest, NextResponse } from 'next/server';
import { getDocuments, createDocument } from '@/lib/firebase-services';

const SAMPLE_ARTICLES = [
  {
    title: "Como criar um site que converte visitantes em clientes",
    slug: "como-criar-site-que-converte",
    excerpt: "Descubra as principais estratégias para desenvolver um site que não apenas atrai visitantes, mas os transforma em clientes reais.",
    content: "Ter um site bonito não é suficiente. Você precisa de um site que converta...\n\n### 1. Velocidade é tudo\nNenhum cliente vai esperar mais de 3 segundos para um site carregar.\n\n### 2. Design que cria confiança\nCada elemento visual deve passar profissionalismo.\n\n### 3. Call-to-Action claro\nTodo visitante deve saber o que fazer.\n\n## Conclusão\nUm site que converte é resultado de atenção aos detalhes.",
    category: 'marketing',
    tags: ['site', 'conversao', 'marketing-digital'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
  },
  {
    title: "5 erros que estão afastando seus clientes do site",
    slug: "5-erros-que-afastam-clientes",
    excerpt: "Identifique e corrija os erros que estão impedindo seu site de gerar resultados.",
    content: "Seu site pode estar sabotando suas vendas sem você perceber...\n\n### 1. Navegação confusa\n### 2. Formulários longos demais\n### 3. Sem prova social\n### 4. Não é responsivo\n### 5. Conteúdo desatualizado\n\n## Conclusão\nCorrigir esses erros pode dobrar suas conversões.",
    category: 'marketing',
    tags: ['erros', 'otimizacao', 'conversao'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
  },
  {
    title: "Por que seu negócio precisa de um app mobile",
    slug: "por-que-seu-negocio-precisa-de-app",
    excerpt: "Entenda como um aplicativo pode revolucionar a forma como seus clientes interagem com seu negócio.",
    content: "O Mobile está dominando. Mais de 80% dos brasileiros acessam a internet pelo celular...\n\n## Benefícios\n### 1. Fidelização\n### 2. Comunicação direta\n### 3. Experiência personalizada\n\n## Conclusão\nUm app não é mais um diferencial, é uma necessidade.",
    category: 'desenvolvimento',
    tags: ['app', 'mobile', 'negócios'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800'
  },
  {
    title: "E-commerce: tendências para 2026",
    slug: "ecommerce-tendencias-2026",
    excerpt: "Fique à frente da concorrência conhecendo as principais tendências do e-commerce.",
    content: "O mercado de e-commerce está em constante evolução...\n\n### 1. Commerce Conversacional\n### 2. Sustainability\n### 3. Omnichannel\n### 4. AI Personalization\n### 5. Voice Commerce\n\n## Conclusão\nAs empresas que se adaptarem estarão à frente.",
    category: 'negocios',
    tags: ['e-commerce', 'tendencias', '2026'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800'
  },
  {
    title: "Guia completo de SEO para pequenos negócios",
    slug: "guia-seo-pequenos-negocios",
    excerpt: "Aprenda a posicionar seu site nas buscas do Google sem gastar muito.",
    content: "SEO não é só para gigantes. Pequenos negócios podem sim competir...\n\n### 1. Keywords locais\n### 2. Google Business\n### 3. Conteúdo de valor\n### 4. Backlinks locais\n### 5. Mobile first\n\n## Conclusão\nSEO é uma maratona, não uma corrida.",
    category: 'marketing',
    tags: ['SEO', 'marketing-digital', 'pequenos-negocios'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800'
  }
];

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const secret = process.env.ADMIN_SECRET || 'estudiok-admin-2026';
    
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingArticles = await getDocuments('articles');
    
    if (existingArticles.length > 0) {
      return NextResponse.json({ 
        message: 'Articles already exist', 
        count: existingArticles.length 
      });
    }

    let added = 0;
    for (const article of SAMPLE_ARTICLES) {
      await createDocument('articles', {
        ...article,
        createdAt: new Date(),
        publishedAt: new Date()
      });
      added++;
    }

    return NextResponse.json({ success: true, added });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ready',
    endpoint: 'POST /api/blog/seed with {"secret": "estudiok-admin-2026"}'
  });
}