'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  category: string;
  tags: string[];
  createdAt: any;
  published: boolean;
}

export default function BlogPage() {
  const { user, userData } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const { getDocuments } = await import('@/lib/firebase-services');
      const data = await getDocuments('articles');
      
      const defaultArticles: Article[] = [
        {
          id: '1',
          title: 'Como criar um site que vende: Guia completo para 2024',
          excerpt: 'Aprenda as melhores práticas para criar um site que converte visitantes em clientes.',
          content: 'Conteúdo completo sobre criação de sites...',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
          author: 'ESTUDIOK',
          category: 'Marketing Digital',
          tags: ['site', 'marketing', 'conversão'],
          createdAt: new Date(),
          published: true,
        },
        {
          id: '2',
          title: 'Por que sua empresa precisa de um app mobile?',
          excerpt: 'Descubra os benefícios de ter um aplicativo mobile para o seu negócio.',
          content: 'Conteúdo sobre apps mobile...',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
          author: 'ESTUDIOK',
          category: 'Desenvolvimento',
          tags: ['app', 'mobile', 'negócios'],
          createdAt: new Date(Date.now() - 86400000),
          published: true,
        },
        {
          id: '3',
          title: 'SEO para sites de pequenas empresas: Guia rápido',
          excerpt: 'Aprenda a posicionar seu site no Google sem gastar muito.',
          content: 'Conteúdo sobre SEO...',
          image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=400&fit=crop',
          author: 'ESTUDIOK',
          category: 'SEO',
          tags: ['seo', 'google', 'marketing'],
          createdAt: new Date(Date.now() - 172800000),
          published: true,
        },
        {
          id: '4',
          title: 'E-commerce: 7 erros que estão destruindo suas vendas',
          excerpt: 'Evite esses erros comuns e aumente suas conversões agora mesmo.',
          content: 'Conteúdo sobre e-commerce...',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
          author: 'ESTUDIOK',
          category: 'E-commerce',
          tags: ['e-commerce', 'vendas', 'conversão'],
          createdAt: new Date(Date.now() - 259200000),
          published: true,
        },
        {
          id: '5',
          title: 'Landing page: A ferramenta mais poderosa para captar leads',
          excerpt: 'Descubra como criar landing pages que convertem visitantes em leads qualificados.',
          content: 'Conteúdo sobre landing pages...',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
          author: 'ESTUDIOK',
          category: 'Marketing Digital',
          tags: ['landing page', 'leads', 'conversão'],
          createdAt: new Date(Date.now() - 345600000),
          published: true,
        },
        {
          id: '6',
          title: 'Sistema web: Quando sua empresa precisa de um?',
          excerpt: 'Entenda quando é hora de investir em um sistema web personalizado.',
          content: 'Conteúdo sobre sistemas web...',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
          author: 'ESTUDIOK',
          category: 'Desenvolvimento',
          tags: ['sistema web', 'erp', 'gestão'],
          createdAt: new Date(Date.now() - 432000000),
          published: true,
        },
      ];

      if (data && (data as any[]).length > 0) {
        setArticles(data as Article[]);
      } else {
        setArticles(defaultArticles);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorySet = new Set(articles.map(a => a.category).filter(Boolean));
  const categories = ['all', ...Array.from(categorySet)];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="ESTUDIOK Logo"
                className="w-16 h-16 object-contain"
              />
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-[#00D4FF]">Início</Link>
              <Link href="/#servicos" className="text-gray-300 hover:text-[#00D4FF]">Serviços</Link>
              <Link href="/#portfolio" className="text-gray-300 hover:text-[#00D4FF]">Portfólio</Link>
              <Link href="/orcamento" className="btn-primary text-sm">Orçamento</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog <span className="text-[#00D4FF]">ESTUDIOK</span>
            </h1>
            <p className="text-xl text-gray-400">
              Artigos, dicas e tendências sobre tecnologia e marketing digital
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category 
                    ? 'bg-[#00D4FF] text-black' 
                    : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#242424]'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Nenhum artigo encontrado.</p>
              <p className="text-gray-500 mt-2">Em breve, novos conteúdos!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map(article => (
                <article key={article.id} className="card overflow-hidden group">
                  {article.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#00D4FF]/20 text-[#00D4FF]">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-[#00D4FF] transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <Link 
                      href={`/blog/${article.id}`}
                      className="text-[#00D4FF] text-sm font-medium hover:underline"
                    >
                      Ler mais →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 bg-[#0A0A0A] border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © 2024 <img src="/logo.png" alt="ESTUDIOK" className="w-8 h-8 object-contain inline-block mx-1" />. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
