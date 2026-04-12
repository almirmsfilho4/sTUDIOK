'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getProject, getProjectFiles } from '@/lib/firebase-services';
import PremiumIcon from '@/components/PremiumIcon';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface FileData {
  id: string;
  name: string;
  url: string;
  type: string;
}

const docsByType: Record<string, { title: string; icon: string; content: string }[]> = {
  site: [
    { title: 'Guia de Uso do Site', icon: 'book', content: 'Aprenda a gerenciar conteúdo, imagens e textos do seu site institucional.' },
    { title: 'Atualização de Conteúdo', icon: 'edit', content: 'Tutorial passo a passo para adicionar novas páginas e textos.' },
    { title: 'Troca de Imagens', icon: 'image', content: 'Como substituir fotos e banners do site de forma simples.' },
    { title: 'Configurações de SEO', icon: 'target', content: 'Guide para otimizar seu site para mecanismos de busca.' },
  ],
  ecommerce: [
    { title: 'Gerenciar Produtos', icon: 'shopping-cart', content: 'Como adicionar, editar e remover produtos da loja.' },
    { title: 'Configurar Pagamentos', icon: 'credit-card', content: 'Configure gateways de pagamento e formas de entrega.' },
    { title: 'Cupons de Desconto', icon: 'tag', content: 'Criar e gerenciar códigos de desconto para sua loja.' },
    { title: 'Painel de Pedidos', icon: 'package', content: 'Acompanhar e gerenciar pedidos da sua loja virtual.' },
  ],
  app: [
    { title: 'Publicar na App Store', icon: 'smartphone', content: 'Passo a passo para submeter seu app às lojas.' },
    { title: 'Notificações Push', icon: 'bell', content: 'Enviar notificações para os usuários do app.' },
    { title: 'Atualizar Conteúdo', icon: 'refresh', content: 'Atualizar textos e imagens sem precisar recompilar.' },
  ],
  sistema: [
    { title: 'Manual do Usuário', icon: 'book', content: 'Guia completo de todas as funcionalidades do sistema.' },
    { title: 'Gerenciar Usuários', icon: 'users', content: 'Como criar, editar e remover usuários do sistema.' },
    { title: 'Relatórios e Analytics', icon: 'chart', content: 'Gerar e exportar relatórios do sistema.' },
    { title: 'Backup de Dados', icon: 'save', content: 'Como fazer backup e restaurar dados do sistema.' },
  ],
};

export default function DocumentacaoPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDoc, setExpandedDoc] = useState<number | null>(null);

  const projectId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && projectId) {
      loadData();
    }
  }, [user, projectId]);

  const loadData = async () => {
    try {
      const projectData = await getProject(projectId);
      if (projectData) {
        setProject(projectData as Project);
        const projectFiles = await getProjectFiles(projectId);
        setFiles(projectFiles as FileData[]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectType = () => {
    if (!project) return 'site';
    const name = project.name?.toLowerCase() || '';
    if (name.includes('ecommerce') || name.includes('loja')) return 'ecommerce';
    if (name.includes('app') || name.includes('mobile')) return 'app';
    if (name.includes('sistema') || name.includes('erp')) return 'sistema';
    return 'site';
  };

  const docs = docsByType[getProjectType()] || docsByType.site;

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/projetos/${projectId}`} className="p-2 hover:bg-[#1A1A1A] rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Documentação</h1>
              <p className="text-sm text-gray-400">{project.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="card mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center">
              <PremiumIcon name="file" size={24} className="text-[#00D4FF]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Manuais e Tutoriais</h2>
              <p className="text-sm text-gray-400">Guias para usar seu projeto</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {(docs || []).map((doc, index) => (
            <div key={index} className="card">
              <button
                onClick={() => setExpandedDoc(expandedDoc === index ? null : index)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  <PremiumIcon name={doc.icon as any} size={20} className="text-[#00D4FF]" />
                  <span className="font-semibold text-left">{doc.title}</span>
                </div>
                <PremiumIcon 
                  name={expandedDoc === index ? 'arrow-down' : 'chevron-right'} 
                  size={20} 
                  className="text-gray-400"
                />
              </button>
              
              {expandedDoc === index && (
                <div className="px-4 pb-4">
                  <div className="p-4 bg-[#050505] rounded-xl">
                    <p className="text-gray-300 mb-4">{doc.content}</p>
                    <div className="flex gap-2">
                      <button className="text-[#00D4FF] text-sm hover:underline flex items-center gap-1">
                        <PremiumIcon name="download" size={14} />
                        Baixar PDF
                      </button>
                      <button className="text-[#00D4FF] text-sm hover:underline flex items-center gap-1">
                        <PremiumIcon name="external-link" size={14} />
                        Ver Tutorial
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Arquivos do Projeto</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {files.map(file => (
                <a 
                  key={file.id} 
                  href={file.url} 
                  target="_blank"
                  className="card p-4 flex items-center gap-4 hover:border-[#00D4FF]"
                >
                  <PremiumIcon name="file" size={24} className="text-[#00D4FF]" />
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-400">{file.type}</p>
                  </div>
                  <PremiumIcon name="download" size={20} className="text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-xl">
          <div className="flex items-start gap-4">
            <PremiumIcon name="message" size={24} className="text-[#00D4FF]" />
            <div>
              <h4 className="font-bold mb-2">Precisa de ajuda?</h4>
              <p className="text-sm text-gray-400 mb-3">
                Se tiver dúvidas sobre o projeto, nossa equipe está disponível para ajudar.
              </p>
              <Link 
                href="/dashboard/support"
                className="text-[#00DFF] text-sm hover:underline"
              >
                Falar com suporte →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}