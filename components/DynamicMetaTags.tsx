'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogUrl?: string;
}

const defaultMeta: PageMeta = {
  title: 'ESTUDIOK - Criação de Sites, Apps e Sistemas Sob Medida',
  description: 'Agência digital especializada em criação de sites, apps mobile e sistemas web. Seu site pronto em 48 horas!',
  keywords: ['criação de sites', 'desenvolvimento web', 'app mobile', 'sistemas web', 'e-commerce', 'marketing digital', 'agência digital'],
  ogImage: 'https://estudiok.com.br/og-image.png',
  ogUrl: 'https://estudiok.com.br'
};

const pageMetaMap: Record<string, PageMeta> = {
  '/': {
    title: 'ESTUDIOK - Sites e Apps Sob Medida com Inteligência Artificial',
    description: 'Transforme seu negócio com sites, apps e sistemas inteligentes. SEO otimizado, conversão garantida. Comece agora!',
    keywords: ['criação de sites', 'inteligência artificial', 'SEO', 'conversão', 'sites otimizados', 'agência digital'],
    ogImage: 'https://estudiok.com.br/og-home.png',
  },
  '/orcamento': {
    title: 'Solicite Seu Orçamento - ESTUDIOK',
    description: 'Receba um orçamento personalizado em minutos. Projetos sob medida com preços competitivos.',
    keywords: ['orçamento site', 'preço site', 'custo app', 'orçamento desenvolvimento'],
    ogImage: 'https://estudiok.com.br/og-orcamento.png',
  },
  '/blog': {
    title: 'Blog - Dicas e Tendências em Tecnologia - ESTUDIOK',
    description: 'Artigos sobre desenvolvimento web, marketing digital, SEO, inteligência artificial e tecnologia.',
    keywords: ['blog tecnologia', 'tendências web', 'artigos SEO', 'dicas desenvolvimento'],
    ogImage: 'https://estudiok.com.br/og-blog.png',
  },
  '/quiz': {
    title: 'Quiz: Descubra Seu Site Perfeito - ESTUDIOK',
    description: 'Responda algumas perguntas e descubra a solução digital ideal para o seu negócio.',
    keywords: ['quiz site', 'descobrir site', 'solução digital', 'teste negócio'],
    ogImage: 'https://estudiok.com.br/og-quiz.png',
  },
  '/checkout': {
    title: 'Checkout Seguro - ESTUDIOK',
    description: 'Finalize seu pagamento com segurança. Pagamento processado via Stripe com criptografia SSL.',
    keywords: ['checkout', 'pagamento seguro', 'stripe', 'compra online'],
    ogImage: 'https://estudiok.com.br/og-checkout.png',
  },
  '/admin': {
    title: 'Painel Admin - ESTUDIOK',
    description: 'Painel administrativo para gestão de projetos, leads e conteúdo.',
    keywords: ['painel admin', 'gestão projetos', 'admin dashboard'],
    ogImage: 'https://estudiok.com.br/og-admin.png',
  }
};

export default function DynamicMetaTags() {
  const pathname = usePathname();
  const [pageMeta, setPageMeta] = useState<PageMeta>(defaultMeta);
  
  useEffect(() => {
    let foundMeta = defaultMeta;
    
    for (const [path, meta] of Object.entries(pageMetaMap)) {
      if (pathname === path || (path !== '/' && pathname?.startsWith(path))) {
        foundMeta = meta;
        break;
      }
    }
    
    if (pathname?.includes('/blog/')) {
      foundMeta = {
        title: 'Artigo do Blog - ESTUDIOK',
        description: 'Leia nosso artigo completo sobre desenvolvimento web e tecnologia.',
        keywords: ['artigo', 'blog', 'tecnologia'],
        ogImage: 'https://estudiok.com.br/og-blog-article.png',
      };
    } else if (pathname?.includes('/checkout/')) {
      foundMeta = {
        title: 'Finalizar Compra - ESTUDIOK',
        description: 'Complete seu pedido com segurança. Garantia de satisfação de 7 dias.',
        keywords: ['finalizar compra', 'pagamento', 'checkout', 'segurança'],
        ogImage: 'https://estudiok.com.br/og-checkout.png',
      };
    }
    
    setPageMeta(foundMeta);
    
    document.title = foundMeta.title;
    
    const metaTags = [
      { name: 'description', content: foundMeta.description },
      { name: 'keywords', content: foundMeta.keywords.join(', ') },
      { property: 'og:title', content: foundMeta.title },
      { property: 'og:description', content: foundMeta.description },
      { property: 'og:image', content: foundMeta.ogImage || defaultMeta.ogImage! },
      { property: 'og:url', content: foundMeta.ogUrl || `${defaultMeta.ogUrl}${pathname}` },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: foundMeta.title },
      { name: 'twitter:description', content: foundMeta.description },
      { name: 'twitter:image', content: foundMeta.ogImage || defaultMeta.ogImage! },
      { name: 'robots', content: 'index, follow' },
    ];
    
    metaTags.forEach(tag => {
      if ('name' in tag && tag.name) {
        let existing = document.querySelector(`meta[name="${tag.name}"]`);
        if (existing) {
          existing.setAttribute('content', tag.content || '');
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('name', tag.name);
          meta.setAttribute('content', tag.content || '');
          document.head.appendChild(meta);
        }
      } else if ('property' in tag && tag.property) {
        let existing = document.querySelector(`meta[property="${tag.property}"]`);
        if (existing) {
          existing.setAttribute('content', tag.content || '');
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('property', tag.property);
          meta.setAttribute('content', tag.content);
          document.head.appendChild(meta);
        }
      }
    });
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'ESTUDIOK',
      'url': 'https://estudiok.com.br',
      'description': foundMeta.description,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://estudiok.com.br/blog?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };
    
    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
    if (script) {
      script.textContent = JSON.stringify(structuredData);
    } else {
      script = document.createElement('script') as HTMLScriptElement;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    
    return () => {
      document.title = defaultMeta.title;
    };
  }, [pathname]);
  
  return null;
}