import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  author?: string;
  tags?: string[];
}

const SITE_NAME = 'ESTUDIOK';
const SITE_URL = 'https://estudiak.com';
const DEFAULT_IMAGE = '/og-default.png';

export function generateSEO({
  title,
description = 'Criamos websites, apps e sistemas digitais para seu negócio decolar.',
 image = DEFAULT_IMAGE,
 url,
 type: pageType = 'website',
 publishedTime,
  author,
  tags = [],
}: SEOProps): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
locale: 'pt_BR',
 type: pageType === 'product' ? 'website' : pageType,
 ...(publishedTime && { publishedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: '@estudiok',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(tags.length > 0 && { keywords: tags }),
    alternates: {
      canonical: fullUrl,
      languages: {
        'pt-BR': fullUrl,
      },
    },
  };
}

export function generateSchemaOrg({
  type = 'Organization',
  name = SITE_NAME,
  url = SITE_URL,
  logo = DEFAULT_IMAGE,
  description = 'Agência digital especializada em websites, apps e sistemas.',
  contactPoint = {
    telephone: '+55-XX-XXXXX-XXXX',
    contactType: 'customer service',
    availableLanguage: 'Portuguese',
  },
  sameAs = [],
}: {
  type?: string;
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  contactPoint?: any;
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    url,
    logo,
    description,
    contactPoint,
    sameAs,
  };
}

export const schemaOrg = {
 organization: () => generateSchemaOrg({}),
  
  localBusiness: () => generateSchemaOrg({
    type: 'LocalBusiness',
    description: 'Agência digital com atendimento em São Paulo e todo Brasil',
  }),
  
  product: (name: string, description: string, price: number) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
    },
  }),
  
  breadcrumb: (items: { name: string; url: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),
  
  faq: (questions: { question: string; answer: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }),
};