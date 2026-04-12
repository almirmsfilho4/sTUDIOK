'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getDocuments } from '@/lib/firebase-services';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  category: string;
  tags: string[];
  createdAt: any;
  publishedAt: any;
}

export default function BlogPostPage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const slug = params.slug as string;
    if (slug) {
      loadArticle(slug);
    }
  }, [params.slug]);

  const loadArticle = async (slug: string) => {
    try {
      const { getDocuments } = await import('@/lib/firebase-services');
      const articles = await getDocuments('articles');
      const found = (articles as Article[]).find((a: any) => a.slug === slug || a.id === slug);
      
      if (found) {
        setArticle(found);
      } else {
        setError('Artigo não encontrado');
      }
    } catch (err) {
      setError('Erro ao carregar artigo');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-[#00D4FF] mb-4">404</h1>
        <p className="text-gray-400 mb-8">Artigo não encontrado</p>
        <Link href="/blog" className="btn-primary">
          Voltar ao Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="ESTUDIOK" className="w-16 h-16 object-contain" />
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-[#00D4FF]">Início</Link>
              <Link href="/#servicos" className="text-gray-300 hover:text-[#00D4FF]">Serviços</Link>
              <Link href="/blog" className="text-[#00D4FF]">Blog</Link>
              <Link href="/orcamento" className="btn-primary text-sm">Orçamento</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <Link 
              href="/blog" 
              className="text-[#00D4FF] text-sm hover:underline mb-4 inline-block"
            >
              ← Voltar ao Blog
            </Link>
            
            {article.image && (
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-[400px] object-cover rounded-2xl mb-8"
              />
            )}

            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm px-3 py-1 rounded-full bg-[#00D4FF]/20 text-[#00D4FF]">
                {article.category}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              <span className="text-sm text-gray-500">
                Por {article.author}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {article.title}
            </h1>

            <p className="text-xl text-gray-400">
              {article.excerpt}
            </p>

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag, index) => (
                  <span key={index} className="text-sm text-gray-500">#{tag}</span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-invert max-w-none">
            <div 
              className="text-gray-300 leading-relaxed whitespace-pre-wrap"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {article.content}
            </div>
          </div>

          <footer className="mt-12 pt-8 border-t border-[#1A1A1A]">
            <div className="bg-[#1A1A1A] rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Gostou deste artigo?</h3>
              <p className="text-gray-400 mb-6">
                Precisa de ajuda para implementar essas estratégias no seu negócio?
              </p>
              <div className="flex gap-4">
                <Link href="/orcamento" className="btn-primary">
                  Solicitar Orçamento
                </Link>
                <Link href="/blog" className="btn-secondary">
                  Ver Mais Artigos
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </main>

      <footer className="py-8 bg-[#0A0A0A] border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © 2024 <img src="/logo.png" alt="ESTUDIOK" className="w-8 h-8 object-contain inline-block mx-1" />. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}