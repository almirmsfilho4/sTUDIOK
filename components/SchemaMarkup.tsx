'use client';

interface SchemaMarkupProps {
  type?: 'LocalBusiness' | 'ProfessionalService' | 'WebSite' | 'Product' | 'FAQ';
  name?: string;
  description?: string;
  url?: string;
  telephone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  priceRange?: string;
  openingHours?: string[];
  image?: string;
  faq?: { question: string; answer: string }[];
}

export default function SchemaMarkup({
  type = 'WebSite',
  name = 'ESTUDIOK',
  description,
  url,
  telephone,
  address,
  priceRange,
  openingHours,
  image,
  faq
}: SchemaMarkupProps) {
  let schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": type,
    "name": name,
  };

  if (description) schema.description = description;
  if (url) schema.url = url;
  if (image) schema.image = image;
  if (telephone) schema.telephone = telephone;
  if (priceRange) schema.priceRange = priceRange;

  if (address && type === 'LocalBusiness') {
    schema.address = {
      "@type": "PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.city,
      "addressRegion": address.state,
      "postalCode": address.postalCode,
      "addressCountry": address.country || 'BR'
    };
  }

  if (openingHours && type === 'LocalBusiness') {
    schema.openingHours = openingHours;
  }

  if (faq && faq.length > 0) {
    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faq.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}