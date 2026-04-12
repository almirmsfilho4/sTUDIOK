'use client';

import { useState } from 'react';
import Link from 'next/link';

type ServiceType = 'site' | 'app' | 'sistema' | 'ecommerce';

interface PricingConfig {
  basePrice: number;
  perPage: number;
  perFeature: number;
}

const pricing: Record<ServiceType, PricingConfig> = {
  site: { basePrice: 1500, perPage: 300, perFeature: 500 },
  app: { basePrice: 5000, perPage: 800, perFeature: 1200 },
  sistema: { basePrice: 8000, perPage: 1000, perFeature: 2000 },
  ecommerce: { basePrice: 3500, perPage: 400, perFeature: 800 },
};

const features = [
  { id: 'seo', name: 'SEO Avançado', price: 800 },
  { id: 'blog', name: 'Blog/Notícias', price: 600 },
  { id: 'contact', name: 'Formulário de Contato', price: 200 },
  { id: 'whatsapp', name: 'Botão WhatsApp', price: 150 },
  { id: 'analytics', name: 'Google Analytics', price: 100 },
  { id: 'ssl', name: 'SSL Grátis', price: 0 },
  { id: 'responsive', name: 'Design Responsivo', price: 0 },
  { id: 'cms', name: 'Painel Admin', price: 500 },
  { id: 'ecommerce', name: 'E-commerce Completo', price: 2000 },
  { id: 'login', name: 'Sistema de Login', price: 800 },
  { id: 'api', name: 'Integração API', price: 1200 },
  { id: 'chat', name: 'Chat em Tempo Real', price: 600 },
];

export default function PricingCalculator() {
  const [serviceType, setServiceType] = useState<ServiceType>('site');
  const [pages, setPages] = useState(3);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['seo', 'ssl', 'responsive']);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const calculateTotal = () => {
    const config = pricing[serviceType];
    const pagesCost = (pages - 1) * config.perPage;
    const featuresCost = selectedFeatures.reduce((total, featureId) => {
      const feature = features.find(f => f.id === featureId);
      return total + (feature?.price || 0);
    }, 0);
    return config.basePrice + pagesCost + featuresCost;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <section id="calculadora" className="py-24 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#00D4FF] font-medium">CALCULADORA</span>
          <h2 className="text-4xl font-bold mt-2">Calcule o Valor do Seu Projeto</h2>
          <p className="text-gray-400 mt-4">
            Obtenha uma estimativa instantânea do seu projeto
          </p>
        </div>

        <div className="card p-8">
          <div className="space-y-8">
            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium mb-3">Tipo de Serviço</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(pricing) as ServiceType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setServiceType(type)}
                    className={`p-4 rounded-xl border transition-all ${
                      serviceType === type 
                        ? 'border-[#00D4FF] bg-[#00D4FF]/10 text-[#00D4FF]' 
                        : 'border-[#1A1A1A] text-gray-400 hover:border-[#00D4FF]/50'
                    }`}
                  >
                    <span className="font-medium capitalize">{type === 'site' ? 'Site' : type === 'app' ? 'App' : type === 'sistema' ? 'Sistema' : 'E-commerce'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pages */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Número de Páginas: <span className="text-[#00D4FF]">{pages}</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={pages}
                onChange={(e) => setPages(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#00D4FF]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>20</span>
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium mb-3">Funcionalidades Extras</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => toggleFeature(feature.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedFeatures.includes(feature.id)
                        ? 'border-[#00D4FF] bg-[#00D4FF]/10'
                        : 'border-[#1A1A1A] hover:border-[#00D4FF]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{feature.name}</span>
                      {feature.price > 0 && (
                        <span className="text-xs text-gray-500">+{formatCurrency(feature.price)}</span>
                      )}
                      {feature.price === 0 && (
                        <span className="text-xs text-green-500">Grátis</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-8 border-t border-[#1A1A1A]">
              <div className="text-center">
                <p className="text-gray-400 mb-2">Valor Estimado</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] bg-clip-text text-transparent">
                  {formatCurrency(calculateTotal())}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  *Valor pode variar conforme complexidade do projeto
                </p>
                <Link href="/orcamento" className="btn-primary mt-6 inline-block">
                  Solicitar Orçamento Detalhado
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
