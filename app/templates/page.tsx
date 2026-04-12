'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LandingTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  features: string[];
  price: number;
}

const templates: LandingTemplate[] = [
  {
    id: 'saas',
    name: 'SaaS Landing',
    category: 'Tecnologia',
    description: 'Página otimizada para produtos SaaS com trial gratuito',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    features: ['Hero com CTA', 'Features em grid', 'Depoimentos', 'Pricing', 'FAQ'],
    price: 997,
  },
  {
    id: 'ebook',
    name: ' Ebook Launch',
    category: 'Marketing',
    description: 'Landing page para lançamento de ebooks e infoprodutos',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    features: ['Capa do ebook', 'Benefits', 'Autor', 'Depoimentos', 'Compra'],
    price: 797,
  },
  {
    id: 'webinar',
    name: 'Webinar Signup',
    category: 'Educação',
    description: 'Capture inscrições para webinars e mentorias',
    thumbnail: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop',
    features: ['Contagem regressiva', 'O que aprender', 'Instrutor', 'Formulário', 'Social proof'],
    price: 697,
  },
  {
    id: 'app',
    name: 'App Showcase',
    category: 'Tecnologia',
    description: 'Apresente seu app com下载 links e screenshots',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    features: ['App screenshot', 'Features', 'Download buttons', 'Testimonials', 'Pricing'],
    price: 1197,
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    category: 'Restaurante',
    description: 'Landing para restaurantes com menu e reservas',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    features: ['Menu interativo', 'Galeria', 'Reservas', 'Depoimentos', 'Localização'],
    price: 897,
  },
  {
    id: 'consulting',
    name: 'Consultoria',
    category: 'Serviços',
    description: 'Landing para consultores e coaches',
    thumbnail: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop',
    features: ['Sobre o consultor', 'Resultados', 'Depoimentos', 'Formulário', 'CTA'],
    price: 797,
  },
  {
    id: 'realestate',
    name: 'Imobiliária',
    category: 'Imóveis',
    description: 'Landing para corretores e imobiliárias',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
    features: ['Imóveis em destaque', 'Filtros', 'Contato', 'Localização', 'Formulário'],
    price: 1097,
  },
  {
    id: 'course',
    name: 'Curso Online',
    category: 'Educação',
    description: 'Landing para cursos online e treinamentos',
    thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop',
    features: ['Módulo do curso', 'Professor', 'Depoimentos', 'Pricing', 'Garantia'],
    price: 897,
  },
];

const categories = ['all', 'Tecnologia', 'Marketing', 'Educação', 'Serviços', 'Imóveis'];

export default function LandingTemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPreview, setShowPreview] = useState<LandingTemplate | null>(null);

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#00D4FF] font-medium">LANDING PAGES PRONTAS</span>
          <h1 className="text-4xl font-bold mt-2">
            Templates de <span className="text-[#00D4FF]">Alta Conversão</span>
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Páginas otimizadas para vender mais. Escolha, personalize e publique em 48 horas!
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === category
                  ? 'bg-[#00D4FF] text-black'
                  : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
              }`}
            >
              {category === 'all' ? 'Todos' : category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="card group overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setShowPreview(template)}
                    className="btn-primary"
                  >
                    Ver Detalhes
                  </button>
                </div>
                <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-[#00D4FF]/20 text-[#00D4FF]">
                  {template.category}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold mb-1">{template.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-[#1A1A1A] text-gray-400">
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded bg-[#1A1A1A] text-gray-500">
                      +{template.features.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#00D4FF]">
                    R$ {template.price.toLocaleString('pt-BR')}
                  </span>
                  <Link href="/orcamento" className="btn-primary text-sm py-2">
                    Solicitar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90" onClick={() => setShowPreview(null)} />
            <div className="relative max-w-4xl w-full bg-[#1A1A1A] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowPreview(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white"
              >
                ✕
              </button>

              <img
                src={showPreview.thumbnail}
                alt={showPreview.name}
                className="w-full aspect-video object-cover"
              />

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-sm text-[#00D4FF]">{showPreview.category}</span>
                    <h2 className="text-2xl font-bold">{showPreview.name}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#00D4FF]">R$ {showPreview.price.toLocaleString('pt-BR')}</p>
                    <p className="text-sm text-gray-400">Entrega em 48h</p>
                  </div>
                </div>

                <p className="text-gray-400 mb-6">{showPreview.description}</p>

                <h3 className="font-bold mb-3">O que está incluído:</h3>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {showPreview.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/orcamento"
                  onClick={() => setShowPreview(null)}
                  className="btn-primary w-full py-4 text-center block"
                >
                  Solicitar este template →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}