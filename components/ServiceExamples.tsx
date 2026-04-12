'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const SERVICE_EXAMPLES = [
  {
    title: 'Site Institucional',
    description: 'Presença digital profissional para sua empresa',
    features: [
      'Design responsivo (mobile, tablet, desktop)',
      'Otimização para SEO',
      'Formulário de contato',
      'Integração com Google Analytics',
      'SSL gratuito',
      'Entrega em 48-72 horas',
    ],
    timeline: '2-3 dias úteis',
  },
  {
    title: 'E-commerce',
    description: 'Loja virtual completa para vender online',
    features: [
      'Catálogo de produtos ilimitado',
      'Carrinho de compras',
      'Pagamentos online (Mercado Pago)',
      'Gestão de estoque',
      'Painel administrativo',
      'Design responsivo',
    ],
    timeline: '5-7 dias úteis',
  },
  {
    title: 'App Mobile',
    description: 'Aplicativo para iOS e Android',
    features: [
      'Desenvolvimento nativo/híbrido',
      'Design exclusivo',
      'Notificações push',
      'Integração com backend',
      'Publicação nas stores',
      'Suporte pós-lançamento',
    ],
    timeline: '15-30 dias úteis',
  },
  {
    title: 'Sistema Web',
    description: 'Sistema personalizado para seu negócio',
    features: [
      'Gestão de clientes (CRM)',
      'Relatórios e dashboards',
      'Automatização de processos',
      'Controle de estoque',
      'Acessos por nível (admin/user)',
      'Backup automático',
    ],
    timeline: '7-15 dias úteis',
  },
];

export default function ServiceExamples({ showPrices = false }: { showPrices?: boolean }) {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState(0);

  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            O que <span className="text-[#00D4FF]">fazemos</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
           Veja exemplos do que já desenvolvemos para nossos clientes
          </p>
        </div>

        {/* Service Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {SERVICE_EXAMPLES.map((service, index) => (
            <button
              key={index}
              onClick={() => setSelectedService(index)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                selectedService === index
                  ? 'bg-[#00D4FF] text-black'
                  : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#242424]'
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>

{/* Service Details */}
 <div className="card p-8 md:p-12">
 <div className="grid md:grid-cols-2 gap-12">
 <div>
 <h3 className="text-2xl font-bold mb-4">{SERVICE_EXAMPLES[selectedService]?.title}</h3>
 <p className="text-gray-400 mb-6">{SERVICE_EXAMPLES[selectedService]?.description}</p>

 <div className="flex items-center gap-2 text-[#00D4FF] mb-6">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 <span className="font-medium">Entrega: {SERVICE_EXAMPLES[selectedService]?.timeline}</span>
              </div>

              {!user && (
                <div className="bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-lg p-4">
                  <p className="text-[#00D4FF] text-sm">
                    🔒 Faça login ou cadastre-se para ver os preços e fazer seu orçamento
                  </p>
                  <div className="flex gap-3 mt-3">
                    <Link href="/login" className="btn-primary text-sm py-2">
                      Entrar
                    </Link>
                    <Link href="/cadastro" className="btn-secondary text-sm py-2">
                      Cadastrar
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#00D4FF]">O que está incluído:</h4>
              <ul className="space-y-3">
                {SERVICE_EXAMPLES[selectedService]?.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {user && showPrices && (
                <div className="mt-6 pt-6 border-t border-[#1A1A1A]">
                  <Link href="/orcamento" className="btn-primary w-full text-center">
                    Fazer Orçamento →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {!user && (
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">
              Já é cliente? Faça login para acessar preços e orçamentos
            </p>
            <Link href="/login" className="btn-secondary">
              Acessar minha conta
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}