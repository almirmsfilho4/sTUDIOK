const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDkY37OLdt9W8vBdWcQi1Ivz0Tn_FaA2B4",
  authDomain: "studiok-saas.firebaseapp.com",
  projectId: "studiok-saas",
  messagingSenderId: "134175965723",
  appId: "1:134175965723:web:c1bcf1de6cc7abb1416ebe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const articles = [
  {
    title: "Como criar um site que converte visitantes em clientes",
    slug: "como-criar-site-que-converte",
    excerpt: "Descubra as principais estratégias para desenvolver um site que não apenas atrai visitantes, mas os transforma em clientes reais.",
    content: `
## Introdução

Ter um site bonito não é suficiente. Você precisa de um site que converta. Neste artigo, vamos explorar as principais estratégias para criar um site que realmente vendas.

### 1. Velocidade é tudo

Nenhum cliente vai esperar mais de 3 segundos para um site carregar. Invista em:
- Otimização de imagens
- CDN para entrega de conteúdo
- Hospedagem de qualidade

### 2. Design que cria confiança

Cada elemento visual deve passar profissionalismo:
- Cores consistentes com a marca
- Tipografia legível
- Espaçamento adequado
- Imagens de alta qualidade

### 3. Call-to-Action claro

Todo visitante deve saber o que fazer:
- Botões grandes e visíveis
- Linguagem direta
- Contraste adequado

### Conclusão

Um site que converte é resultado de atenção aos detalhes e foco na experiência do usuário.
    `,
    category: 'marketing',
    tags: ['site', 'conversao', 'marketing-digital'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    createdAt: new Date(),
    publishedAt: new Date()
  },
  {
    title: "5 erros que estão afastando seus clientes do site",
    slug: "5-erros-que-afastam-clientes",
    excerpt: "Identifique e corrija os erros que estão impedindo seu site de gerar resultados.",
    content: `
## Introduction

Seu site pode estar sabotando suas vendas sem você perceber. Aqui estão os 5 erros mais comuns:

### 1. Navegação confusa

Se o cliente não encontra o que procura em 3 cliques, ele vai embora. Simplifique seu menu.

### 2. Formulários longos demais

Cada campo a mais é uma barreira. Peça apenas o necessário.

### 3. Sem prova social

Depoimentos, casos de sucesso e selos de confiança são essenciais.

### 4. Não é responsivo

Mais de 60% das visitas vêm de celulares. Seu site precisa funcionar perfeitamente em qualquer dispositivo.

### 5. Conteúdo desatualizado

Um blog parado e informações antigas transmitem falta de profissionalismo.

## Conclusão

Corrigir esses erros pode dobrar suas conversões. Invista tempo em otimizar cada um deles.
    `,
    category: 'marketing',
    tags: ['erros', 'otimizacao', 'conversao'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    createdAt: new Date(),
    publishedAt: new Date()
  },
  {
    title: "Por que seu negócio precisa de um app mobile",
    slug: "por-que-seu-negocio-precisa-de-app",
    excerpt: "Entenda como um aplicativo pode revolucionar a forma como seus clientes interagem com seu negócio.",
    content: `
## O Mobile está dominando

Mais de 80% dos brasileiros acessam a internet pelo celular. Seu negócio precisa estar onde seus clientes estão.

## Benefícios de um App

### 1. Fidelização
Um app na tela inicial do celular do cliente é um lembrete constante da sua marca.

### 2. Comunicação direta
Notificações push permitem que você alcance seus clientes instantaneamente.

### 3. Experiência personalizada
Um app permite criar experiências únicas baseadas no comportamento do usuário.

### 4. Offline mode
Sua marca disponível mesmo sem internet.

## Quando investir em um app?

- Quando você tem clientes frequentes
- Quando precisa de funcionalidades específicas do手机
- Quando quer se destacar da concorrência

## Conclusão

Um app não é mais um diferencial, é uma necessidade para negócios que querem crescer.
    `,
    category: 'desenvolvimento',
    tags: ['app', 'mobile', 'negócios'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    createdAt: new Date(),
    publishedAt: new Date()
  },
  {
    title: "E-commerce: tendências para 2026",
    slug: "ecommerce-tendencias-2026",
    excerpt: "Fique à frente da concorrência conhecendo as principais tendências do e-commerce para os próximos anos.",
    content: `
## O futuro do e-commerce

O mercado de e-commerce está em constante evolução. Veja o que esperar:

### 1. Commerce Conversacional
Chatbots e assistentes virtuais estão transformando a experiência de compra.

### 2. Sustainability
Conscientes ambientalmente, consumidores preferem marcas sustentáveis.

### 3. Omnichannel
Integração total entre online e offline.

### 4. AI Personalization
Recomendação de produtos cada vez mais precisa.

### 5. Voice Commerce
Comandos de voz para compras rápidas.

## Como se preparar

Invista em tecnologia e esteja sempre atualizado sobre as tendências do mercado.

## Conclusão

As empresas que se adaptarem às tendências estarão à frente da concorrência.
    `,
    category: 'negocios',
    tags: ['e-commerce', 'tendencias', '2026'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    createdAt: new Date(),
    publishedAt: new Date()
  },
  {
    title: "Guia completo de SEO para pequenos negócios",
    slug: "guia-seo-pequenos-negocios",
    excerpt: "Aprenda a posicionar seu site nas buscas do Google sem gastar muito.",
    content: `
## SEO não é só para gigantes

Pequenos negócios podem sim competir nas buscas do Google. Veja como:

### 1. Keywords locais
Foque em palavras-chave da sua região + serviço.

### 2. Google Business
Complete seu perfil no Google My Business.

### 3. Conteúdo de valor
Blog posts que respondem perguntas dos clientes.

### 4. Backlinks locais
Parcerias com outras empresas locais.

### 5. Mobile first
Seu site precisa funcionar perfeitamente no celular.

## Métricas importantes

- Posicionamento médio
- Tráfego orgânico
- Tempo na página
- Taxa de conversão

## Conclusão

SEO é uma maratona, não uma corrida. Comece hoje e colha resultados em alguns meses.
    `,
    category: 'marketing',
    tags: ['SEO', 'marketing-digital', 'pequenos-negocios'],
    author: 'ESTUDIOK',
    status: 'published',
    views: 0,
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800',
    createdAt: new Date(),
    publishedAt: new Date()
  }
];

async function seedArticles() {
  console.log('Adding articles to Firestore...');
  
  for (const article of articles) {
    try {
      const docRef = await addDoc(collection(db, 'articles'), article);
      console.log(`Added: ${article.title} (${docRef.id})`);
    } catch (error) {
      console.error(`Error adding ${article.title}:`, error);
    }
  }
  
  console.log('Done!');
}

seedArticles();