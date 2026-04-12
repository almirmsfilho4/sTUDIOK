'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  seller: { name: string; avatar: string; rating: number };
  deliveryTime: string;
  image: string;
  tags: string[];
}

const services: Service[] = [
  {
    id: '1',
    title: 'Criação de Logo Profissional',
    description: 'Design de logo único e profissional com até 3 revisões',
    price: 350,
    category: 'Design',
    seller: { name: 'Maria Designer', avatar: 'M', rating: 4.9 },
    deliveryTime: '3 dias',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
    tags: ['logo', 'brand', 'design']
  },
  {
    id: '2',
    title: 'Desenvolvimento de API REST',
    description: 'API REST completa com documentação Swagger',
    price: 1200,
    category: 'Programação',
    seller: { name: 'João Dev', avatar: 'J', rating: 5.0 },
    deliveryTime: '7 dias',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    tags: ['api', 'nodejs', 'backend']
  },
  {
    id: '3',
    title: 'SEO Completo do Site',
    description: 'Otimização completa para Google com relatório detalhado',
    price: 800,
    category: 'Marketing',
    seller: { name: 'Pedro SEO', avatar: 'P', rating: 4.8 },
    deliveryTime: '5 dias',
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop',
    tags: ['seo', 'marketing', 'google']
  },
  {
    id: '4',
    title: 'Copywriting para Landing Page',
    description: 'Texto persuasivo que converte visitantes em clientes',
    price: 450,
    category: 'Marketing',
    seller: { name: 'Ana Copy', avatar: 'A', rating: 4.7 },
    deliveryTime: '2 dias',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    tags: ['copy', 'texto', 'conversão']
  },
  {
    id: '5',
    title: 'App Mobile React Native',
    description: 'App completo para iOS e Android com publicação',
    price: 3500,
    category: 'Programação',
    seller: { name: 'Carlos Mobile', avatar: 'C', rating: 4.9 },
    deliveryTime: '15 dias',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    tags: ['app', 'mobile', 'react']
  },
  {
    id: '6',
    title: 'E-commerce Completo',
    description: 'Loja virtual com admin, pagamentos e logística',
    price: 2500,
    category: 'Programação',
    seller: { name: 'Rafael Ecom', avatar: 'R', rating: 5.0 },
    deliveryTime: '10 dias',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    tags: ['ecommerce', 'loja', 'pagamento']
  },
];

const categories = ['Todos', 'Design', 'Programação', 'Marketing', 'Video', 'Audio'];

export default function MarketplacePage() {
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const filteredServices = services.filter(s => {
    const matchCategory = filter === 'Todos' || s.category === filter;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                       s.tags.some(t => t.includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ESTUDIOK" className="w-12 h-12 object-contain" />
            <span className="font-bold text-xl">Marketplace</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-300 hover:text-[#00D4FF]">Dashboard</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Marketplace de <span className="text-[#00D4FF]">Serviços</span>
            </h1>
            <p className="text-gray-400">
              Encontre profissionais especializados para seu projeto
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Buscar serviços..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field flex-1"
            />
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    filter === cat ? 'bg-[#00D4FF] text-black' : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#242424]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div key={service.id} className="card overflow-hidden group">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-[#00D4FF]/20 text-[#00D4FF] rounded-full">
                      {service.category}
                    </span>
                    <span className="text-xs text-gray-500">⏱ {service.deliveryTime}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B2CBF] flex items-center justify-center text-sm font-bold">
                        {service.seller.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{service.seller.name}</p>
                        <p className="text-xs text-yellow-500">★ {service.seller.rating}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#00D4FF]">R$ {service.price}</p>
                    </div>
                  </div>
                  
                  <button className="btn-primary w-full mt-4">
                    Contratar Serviço
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400">Nenhum serviço encontrado.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
