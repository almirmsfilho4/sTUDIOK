import { MetadataRoute } from 'next';
import { getDocuments } from '@/lib/firebase-services';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://estudiok.com';

  const staticPages = [
    { url: baseUrl, priority: 1, changefreq: 'daily' },
    { url: `${baseUrl}/login`, priority: 0.8, changefreq: 'monthly' },
    { url: `${baseUrl}/cadastro`, priority: 0.8, changefreq: 'monthly' },
    { url: `${baseUrl}/orcamento`, priority: 0.9, changefreq: 'weekly' },
    { url: `${baseUrl}/templates`, priority: 0.7, changefreq: 'monthly' },
    { url: `${baseUrl}/blog`, priority: 0.8, changefreq: 'daily' },
    { url: `${baseUrl}/cursos`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/afiliados`, priority: 0.6, changefreq: 'weekly' },
  ];

  try {
    const articles = await getDocuments('articles');
    const articleUrls = (articles as any[])
      .filter((a: any) => a.status === 'published' || a.published)
      .map((a: any) => ({
        url: `${baseUrl}/blog/${a.slug || a.id}`,
        lastModified: a.publishedAt?.toDate ? a.publishedAt.toDate() : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    return [
      ...staticPages.map(page => ({
        url: page.url,
        lastModified: new Date(),
        changeFrequency: page.changefreq as any,
        priority: page.priority,
      })),
      ...articleUrls,
    ];
  } catch (error) {
    return staticPages.map(page => ({
      url: page.url,
      lastModified: new Date(),
      changeFrequency: page.changefreq as any,
      priority: page.priority,
    }));
  }
}
