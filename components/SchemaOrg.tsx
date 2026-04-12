'use client';

import Head from 'next/head';

interface SchemaData {
  name?: string;
  description?: string;
  url?: string;
  image?: string;
}

export default function SchemaOrg({ data }: { data?: SchemaData }) {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://estudiok.com';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ESTUDIOK",
    "description": "Agência digital especializada em criação de sites, apps mobile e sistemas web sob medida. Seu site pronto em 48 horas!",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "image": `${siteUrl}/logo.png`,
    "telephone": "+55",
    "email": "estudiokgames@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR",
      "addressRegion": "MG"
    },
    "priceRange": "$$",
    "serviceType": [
      "Criação de Sites",
      "Desenvolvimento de Apps Mobile",
      "Sistemas Web",
      "E-commerce",
      "SEO",
      "Marketing Digital"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Brasil"
    },
    "sameAs": [
      "https://instagram.com/estudiok",
      "https://facebook.com/estudiok",
      "https://linkedin.com/company/estudiok"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceSchema({ services }: { services?: { name: string; description: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": (services || [
      { name: "Sites Institucionais", description: "Sites modernos, responsivos e otimizados" },
      { name: "Apps Mobile", description: "Aplicativos para iOS e Android" },
      { name: "Sistemas Web", description: "ERPs, CRMs e sistemas sob medida" },
      { name: "E-commerce", description: "Lojas virtuais completas" }
    ]).map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service.name,
        "description": service.description
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quanto tempo leva para criar um site?",
        "answer": "Entregamos sites em até 48 horas! O tempo pode variar conforme a complexidade do projeto."
      },
      {
        "@type": "Question",
        "name": "Quais formas de pagamento vocês aceitam?",
        "answer": "Aceitamos PIX, cartão de crédito, boleto bancário e Mercado Pago. Parcelamos em até 12x no cartão."
      },
      {
        "@type": "Question",
        "name": "O site inclui hospedagem e domínio?",
        "answer": "Sim, oferecemos hospedagemgratuítapor 1 ano e ajuda na compra do domínio .com ou .com.br."
      },
      {
        "@type": "Question",
        "name": "Posso editar o site depois de pronto?",
        "answer": "Sim! Todos os nossos sites incluem um painel administrativo fácil de usar para você mesmo atualizar o conteúdo."
      },
      {
        "@type": "Question",
        "name": "Vocês fazem SEO?",
        "answer": "Sim, todos os nossos sites são otimizados para motores de busca (Google) desde a concepção."
      },
      {
        "@type": "Question",
        "name": "Oferecem suporte pós-projeto?",
        "answer": "Sim, oferecemos suporte por 30 diasgratuítopara ajustes e dúvidas após a entrega do projeto."
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
