const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = {
  type: "service_account",
  project_id: "studiok-saas",
  private_key_id: "process.env.FIREBASE_PRIVATE_KEY_ID",
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: "firebase-adminsdk@studiok-saas.iam.gserviceaccount.com",
  client_id: "134175965723",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40studiok-saas.iam.gserviceaccount.com"
};

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const articles = [
  {
    title: "Como criar um site que converte visitantes em clientes",
    slug: "como-criar-site-que-converte",
    excerpt: "Descubra as principais estratégias para desenvolver um site que não apenas atrai visitantes, mas os transforma em clientes reais.",
    content: `## Introdução\n\nTer um site bonito não é suficiente. Você precisa de um site que converta. Neste artigo, vamos explorar as principais estratégias para criar um site que realmente vendas.\n\n### 1. Velocidade é tudo\n\nNenhum cliente vai esperar mais de 3 segundos para um site carregar.\n\n### 2. Design que cria confiança\n\nCada elemento visual deve passar profissionalismo.\n\n### 3. Call-to-Action claro\n\nTodo visitante deve saber o que fazer.\n\n## Conclusão\n\nUm site que converte é resultado de atenção aos detalhes e foco na experiência do usuário.`,
    category: 'marketing',
    tags: ['site', 'conversao', 'marketing-digital'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    createdAt: FieldValue.serverTimestamp(),
    publishedAt: FieldValue.serverTimestamp()
  },
  {
    title: "5 erros que estão afastando seus clientes do site",
    slug: "5-erros-que-afastam-clientes",
    excerpt: "Identifique e corrija os erros que estão impedindo seu site de gerar resultados.",
    content: `## Introdução\n\nSeu site pode estar sabotando suas vendas sem você perceber.\n\n### 1. Navegação confusa\n\n### 2. Formulários longos demais\n\n### 3. Sem prova social\n\n### 4. Não é responsivo\n\n### 5. Conteúdo desatualizado\n\n## Conclusão\n\nCorrigir esses erros pode dobrar suas conversões.`,
    category: 'marketing',
    tags: ['erros', 'otimizacao', 'conversao'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    createdAt: FieldValue.serverTimestamp(),
    publishedAt: FieldValue.serverTimestamp()
  },
  {
    title: "Por que seu negócio precisa de um app mobile",
    slug: "por-que-seu-negocio-precisa-de-app",
    excerpt: "Entenda como um aplicativo pode revolucionar a forma como seus clientes interagem com seu negócio.",
    content: `## O Mobile está dominando\n\nMais de 80% dos brasileiros acessam a internet pelo celular.\n\n## Benefícios de um App\n\n### 1. Fidelização\n\n### 2. Comunicação direta\n\n### 3. Experiência personalizada\n\n### 4. Offline mode\n\n## Conclusão\n\nUm app não é mais um diferencial, é uma necessidade.`,
    category: 'desenvolvimento',
    tags: ['app', 'mobile', 'negócios'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    createdAt: FieldValue.serverTimestamp(),
    publishedAt: FieldValue.serverTimestamp()
  },
  {
    title: "E-commerce: tendências para 2026",
    slug: "ecommerce-tendencias-2026",
    excerpt: "Fique à frente da concorrência conhecendo as principais tendências do e-commerce.",
    content: `## O futuro do e-commerce\n\n### 1. Commerce Conversacional\n\n### 2. Sustainability\n\n### 3. Omnichannel\n\n### 4. AI Personalization\n\n### 5. Voice Commerce\n\n## Conclusão\n\nAs empresas que se adaptarem estarão à frente.`,
    category: 'negocios',
    tags: ['e-commerce', 'tendencias', '2026'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    createdAt: FieldValue.serverTimestamp(),
    publishedAt: FieldValue.serverTimestamp()
  },
  {
    title: "Guia completo de SEO para pequenos negócios",
    slug: "guia-seo-pequenos-negocios",
    excerpt: "Aprenda a posicionar seu site nas buscas do Google sem gastar muito.",
    content: `## SEO não é só para gigantes\n\n### 1. Keywords locais\n\n### 2. Google Business\n\n### 3. Conteúdo de valor\n\n### 4. Backlinks locais\n\n### 5. Mobile first\n\n## Conclusão\n\nSEO é uma maratona, não uma corrida.`,
    category: 'marketing',
    tags: ['SEO', 'marketing-digital', 'pequenos-negocios'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800',
    createdAt: FieldValue.serverTimestamp(),
    publishedAt: FieldValue.serverTimestamp()
  }
];

async function seedArticles() {
  console.log('Adding articles with Admin SDK...');
  
  for (const article of articles) {
    try {
      const docRef = await db.collection('articles').add(article);
      console.log(`Added: ${article.title} (${docRef.id})`);
    } catch (error) {
      console.error(`Error adding ${article.title}:`, error.message);
    }
  }
  
  console.log('Done!');
}

seedArticles().catch(console.error);