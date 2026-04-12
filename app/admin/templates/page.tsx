'use client';

import { useState } from 'react';
import Link from 'next/link';

const LANDING_PAGES_ADS = [
  {
    id: 'criar-site',
    name: 'Criação de Site',
    url: 'https://estudiok.com.br/criar-site',
    description: 'Landing page para anúncios de criação de sites institucionais',
    icon: '🌐',
  },
  {
    id: 'criar-ecommerce',
    name: 'Loja Virtual',
    url: 'https://estudiok.com.br/criar-ecommerce',
    description: 'Landing page para anúncios de e-commerce',
    icon: '🛒',
  },
  {
    id: 'criar-app',
    name: 'App Mobile',
    url: 'https://estudiok.com.br/criar-app',
    description: 'Landing page para anúncios de apps mobile',
    icon: '📱',
  },
  {
    id: 'sistema-web',
    name: 'Sistema Web',
    url: 'https://estudiok.com.br/sistema-web',
    description: 'Landing page para anúncios de sistemas web',
    icon: '💻',
  },
  {
    id: 'planos',
    name: 'Planos SaaS',
    url: 'https://estudiok.com.br/planos',
    description: 'Página de planos de assinatura',
    icon: '💰',
  },
  {
    id: 'home',
    name: 'Página Principal',
    url: 'https://estudiok.com.br',
    description: 'Página inicial do site',
    icon: '🏠',
  },
];

const TEMPLATES = [
  {
    id: 'restaurante',
    name: 'Restaurante & Lanchonete',
    description: 'Template completo para restaurantes, lanchonetes e delivery',
    features: ['Cardápio digital', 'Pedidos online', 'Galeria de pratos', 'Reservas'],
    color: '#FF6B35',
    status: 'available',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Loja virtual completa com catálogo, carrinho e checkout',
    features: ['Catálogo de produtos', 'Carrinho de compras', 'Pagamentos online', 'Código promocional'],
    color: '#00D4FF',
    status: 'available',
  },
  {
    id: 'academia',
    name: 'Academia & Fitness',
    description: 'Template para academias, studios de pilates e CrossFit',
    features: ['Planos e preços', 'Modalidades', 'Professores', 'Agendamento'],
    color: '#FF006E',
    status: 'available',
  },
  {
    id: 'corretor',
    name: 'Corretor de Imóveis',
    description: 'Imobiliária ou corretor individual com gestão de imóveis',
    features: ['Catálogo de imóveis', 'Busca por bairro', 'Filtros avançados', 'Contato'],
    color: '#06D6A0',
    status: 'available',
  },
  {
    id: 'salao',
    name: 'Salão de Beleza',
    description: 'Template para salões de beleza, barbearias e spas',
    features: ['Serviços e preços', 'Galeria de trabalhos', 'Equipe', 'Agendamento online'],
    color: '#FF69B4',
    status: 'available',
  },
  {
    id: 'empresa',
    name: 'Empresa & Corporativo',
    description: 'Site institucional moderno para empresas de qualquer segmento',
    features: ['Sobre empresa', 'Serviços', 'Depoimentos', 'Contato'],
    color: '#7B2CBF',
    status: 'available',
  },
  {
    id: 'clinica',
    name: 'Clínica Médica',
    description: 'Template para clínicas, consultórios e profissionais de saúde',
    features: ['Especialidades', 'Equipe médica', 'Contato', 'Agendamento'],
    color: '#3A86FF',
    status: 'coming_soon',
  },
  {
    id: 'advogado',
    name: 'Advogado & Jurídico',
    description: 'Site para advogados, escritórios de advocacia e jurídico',
    features: ['Áreas de atuação', 'Equipe', 'Artigos', 'Contato'],
    color: '#8B5CF6',
    status: 'coming_soon',
  },
];

export default function TemplatesPage() {
  const [filter, setFilter] = useState<'all' | 'available' | 'coming_soon'>('all');

  const filteredTemplates = TEMPLATES.filter(t => 
    filter === 'all' ? true : t.status === filter
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel de Landing Pages</h1>
            <p className="text-gray-400 mt-2">
              Gerencie suas páginas para anúncios e templates
            </p>
          </div>
          <Link href="/admin" className="btn-secondary">
            ← Voltar ao Admin
          </Link>
        </div>

        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">📣 Landing Pages para Anúncios</h2>
          <p className="text-gray-400 mb-6">
            Use estas URLs para suas campanhas de anúncios pagos (Facebook, Google, Instagram)
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LANDING_PAGES_ADS.map(lp => (
              <div key={lp.id} className="bg-[#1A1A1A] rounded-xl p-4 border border-[#333]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{lp.icon}</span>
                  <div>
                    <h3 className="font-bold">{lp.name}</h3>
                    <p className="text-xs text-gray-500">{lp.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={lp.url} 
                    readOnly 
                    className="input-field text-xs flex-1"
                    onClick={e => (e.target as HTMLInputElement).select()}
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(lp.url);
                      alert('URL copiada!');
                    }}
                    className="btn-primary px-3 py-2 text-xs whitespace-nowrap"
                  >
                    Copiar
                  </button>
                  <a 
                    href={lp.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary px-3 py-2 text-xs"
                  >
                    Ver →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🎨 Templates de Sites</h2>
          <p className="text-gray-400 mb-4">
            Templates profissionais para diversos nichos de negócio
          </p>
        </div>

        <div className="flex gap-2 mb-8">
          {(['all', 'available', 'coming_soon'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === f 
                  ? 'bg-[#00D4FF] text-black' 
                  : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#242424]'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'available' ? 'Disponíveis' : 'Em Breve'}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.id} className="card overflow-hidden">
              <div 
                className="h-32 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${template.color}44 0%, ${template.color}11 100%)` }}
              >
                <span className="text-5xl">🎨</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{template.name}</h3>
                  {template.status === 'coming_soon' ? (
                    <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-500">
                      Em Breve
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-500">
                      Disponível
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.features.map((feature, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-[#1A1A1A] rounded text-gray-300">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {template.status === 'available' ? (
                    <>
                      <Link 
                        href={`/landing-pages/${template.id}`}
                        className="btn-primary flex-1 text-center text-sm"
                      >
                        Ver Demo
                      </Link>
                      <Link 
                        href={`/orcamento?template=${template.id}`}
                        className="btn-secondary flex-1 text-center text-sm"
                      >
                        Usar Template
                      </Link>
                    </>
                  ) : (
                    <button className="btn-secondary w-full" disabled>
                      Em Breve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 card p-8">
          <h2 className="text-2xl font-bold mb-4">Solicitar Novo Template</h2>
          <p className="text-gray-400 mb-6">
            Precisa de um template específico para seu nicho? Entre em contato e solicite!
          </p>
          <Link href="/orcamento" className="btn-primary">
            Solicitar Template Personalizado
          </Link>
        </div>
      </div>
    </div>
  );
}