import { NextResponse } from 'next/server';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase';

export async function GET() {
  const baseUrl = 'https://estudiak.com';
  
  type SitemapPage = { loc: string; priority: string; changefreq: string; lastmod?: string };

  const staticPages: SitemapPage[] = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/servicos', priority: '0.9', changefreq: 'weekly' },
    { loc: '/portfolio', priority: '0.8', changefreq: 'weekly' },
    { loc: '/quiz', priority: '0.7', changefreq: 'monthly' },
    { loc: '/blog', priority: '0.8', changefreq: 'daily' },
    { loc: '/conhecimento', priority: '0.7', changefreq: 'weekly' },
    { loc: '/contato', priority: '0.6', changefreq: 'monthly' },
    { loc: '/login', priority: '0.3', changefreq: 'monthly' },
    { loc: '/cadastro', priority: '0.3', changefreq: 'monthly' },
  ];

  let dynamicPages: SitemapPage[] = [...staticPages];

  try {
    const [blogPosts, portfolioItems, knowledgeArticles] = await Promise.all([
      getDocs(query(collection(db, 'blogPosts'), where('status', '==', 'published'))),
      getDocs(query(collection(db, 'portfolio'), where('active', '==', true))),
      getDocs(query(collection(db, 'knowledgeBase'), where('status', '==', 'published'))),
    ]);

    blogPosts.docs.forEach(doc => {
      const data = doc.data();
      dynamicPages.push({
        loc: `/blog/${data.slug}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    portfolioItems.docs.forEach(doc => {
      const data = doc.data();
      dynamicPages.push({
        loc: `/portfolio/${data.slug || doc.id}`,
        priority: '0.6',
        changefreq: 'monthly',
      });
    });

    knowledgeArticles.docs.forEach(doc => {
      const data = doc.data();
      dynamicPages.push({
        loc: `/conhecimento/${data.slug}`,
        priority: '0.6',
        changefreq: 'weekly',
      });
    });

    const templates = ['restaurante', 'ecommerce', 'academia', 'corretor', 'salao', 'empresa'];
    templates.forEach(template => {
      dynamicPages.push({
        loc: `/landing-pages/${template}`,
        priority: '0.5',
        changefreq: 'monthly',
      });
    });

  } catch (error) {
    console.error('Error fetching dynamic pages:', error);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${dynamicPages.map(page => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}