'use client';

import { useState } from 'react';

interface DownloadItem {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'zip' | 'image' | 'doc';
  size: string;
  category: string;
  downloads: number;
}

const downloads: DownloadItem[] = [
  {
    id: '1',
    title: 'Modelo de Proposta Comercial',
    description: 'Template editável em Word para proposals profissionais',
    fileUrl: '#',
    fileType: 'doc',
    size: '2.5 MB',
    category: 'Templates',
    downloads: 342
  },
  {
    id: '2',
    title: 'Guia SEO Completo 2024',
    description: 'PDF com todas as técnicas de otimização para motores de busca',
    fileUrl: '#',
    fileType: 'pdf',
    size: '5.2 MB',
    category: 'Guias',
    downloads: 567
  },
  {
    id: '3',
    title: ' pack de Ícones PNG',
    description: 'Coleção de 500 ícones em berbagaias resoluções',
    fileUrl: '#',
    fileType: 'zip',
    size: '15 MB',
    category: 'Recursos',
    downloads: 890
  },
  {
    id: '4',
    title: 'Wireframes Kit',
    description: 'Templates de wireframe para Figma e Sketch',
    fileUrl: '#',
    fileType: 'zip',
    size: '8.5 MB',
    category: 'Design',
    downloads: 234
  },
  {
    id: '5',
    title: 'Checklist de Lançamento',
    description: 'Lista completa de tarefas para lançar qualquer projeto digital',
    fileUrl: '#',
    fileType: 'pdf',
    size: '1.2 MB',
    category: 'Guias',
    downloads: 156
  },
  {
    id: '6',
    title: 'Contrato de Prestação de Serviços',
    description: 'Modelo de contrato jurídico para freelancers',
    fileUrl: '#',
    fileType: 'doc',
    size: '800 KB',
    category: 'Jurídico',
    downloads: 445
  },
];

const typeIcons: Record<string, string> = {
  pdf: '📄',
  zip: '📦',
  doc: '📝',
  image: '🖼️'
};

export default function DownloadsPage() {
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...Array.from(new Set(downloads.map(d => d.category)))];
  const filteredDownloads = filter === 'all' 
    ? downloads 
    : downloads.filter(d => d.category === filter);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ESTUDIOK" className="w-12 h-12 object-contain" />
            <span className="font-bold text-xl">Downloads</span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Materiais <span className="text-[#00D4FF]">Gratuitos</span>
            </h1>
            <p className="text-gray-400">
              Recursos gratuitos para ajudar no seu negócio
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm ${
                  filter === cat 
                    ? 'bg-[#00D4FF] text-black' 
                    : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#242424]'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredDownloads.map(item => (
              <div key={item.id} className="card p-6 flex items-center gap-6">
                <div className="text-4xl">{typeIcons[item.fileType]}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-[#1A1A1A] rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📦 {item.size}</span>
                    <span>⬇️ {item.downloads} downloads</span>
                  </div>
                </div>
                <button className="btn-primary text-sm whitespace-nowrap">
                  Baixar
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
