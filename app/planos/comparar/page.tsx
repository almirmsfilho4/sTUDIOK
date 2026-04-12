'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 97,
    description: 'Perfeito para pequenas empresas',
    features: [
      { name: 'Site Institucional', included: true },
      { name: 'Até 5 páginas', included: true },
      { name: 'Design Responsivo', included: true },
      { name: 'Formulário de Contato', included: true },
      { name: 'SSL Grátis', included: true },
      { name: 'Hospedagem 1 ano', included: true },
      { name: 'E-commerce', included: false },
      { name: 'Blog Integrado', included: false },
      { name: 'Chat Online', included: false },
      { name: 'Domínio Próprio', included: false },
      { name: 'Painel Admin', included: false },
      { name: 'Suporte Priority', included: false },
    ],
    popular: false,
    color: '#6B7280',
  },
  {
    id: 'profissional',
    name: 'Profissional',
    price: 197,
    description: 'Ideal para crescer no digital',
    features: [
      { name: 'Site Institucional', included: true },
      { name: 'Até 15 páginas', included: true },
      { name: 'Design Responsivo', included: true },
      { name: 'Formulário de Contato', included: true },
      { name: 'SSL Grátis', included: true },
      { name: 'Hospedagem 1 ano', included: true },
      { name: 'E-commerce Básico', included: true },
      { name: 'Blog Integrado', included: true },
      { name: 'Chat Online', included: true },
      { name: 'Domínio Próprio', included: true },
      { name: 'Painel Admin', included: true },
      { name: 'Suporte Priority', included: true },
    ],
    popular: true,
    color: '#00D4FF',
  },
  {
    id: 'business',
    name: 'Business',
    price: 397,
    description: 'Solução completa para negócios',
    features: [
      { name: 'Site Institucional', included: true },
      { name: 'Páginas Ilimitadas', included: true },
      { name: 'Design Responsivo', included: true },
      { name: 'Formulário de Contato', included: true },
      { name: 'SSL Grátis', included: true },
      { name: 'Hospedagem 1 ano', included: true },
      { name: 'E-commerce Completo', included: true },
      { name: 'Blog Integrado', included: true },
      { name: 'Chat Online', included: true },
      { name: 'Domínio Próprio', included: true },
      { name: 'Painel Admin Avançado', included: true },
      { name: 'Suporte 24/7', included: true },
    ],
    popular: false,
    color: '#7B2CBF',
  },
];

export default function PlanComparisonPage() {
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const getPrice = (price: number) => {
    if (billingPeriod === 'yearly') {
      return Math.round(price * 10);
    }
    return price;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Compare os <span className="text-[#00D4FF]">Planos</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Escolha o plano ideal para o seu negócio
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-[#1A1A1A] rounded-full">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-[#00D4FF] text-black font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                billingPeriod === 'yearly'
                  ? 'bg-[#00D4FF] text-black font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Anual
              <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded-full font-bold">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card relative overflow-hidden ${
                plan.popular ? 'border-2 border-[#00D4FF]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-center py-2 text-sm font-bold text-black">
                  Mais Popular
                </div>
              )}

              <div className={`p-6 ${plan.popular ? 'pt-12' : ''}`}>
                <h3 className="text-2xl font-bold mb-2" style={{ color: plan.color }}>
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">R$ {getPrice(plan.price)}</span>
                  <span className="text-gray-400">/mês</span>
                  {billingPeriod === 'yearly' && (
                    <p className="text-green-500 text-sm">Cobrado anualmente (R$ {getPrice(plan.price) * 12})</p>
                  )}
                </div>

                <Link
                  href={user ? '/planos' : '/cadastro?redirect=/planos'}
                  className={`block w-full py-3 rounded-lg font-bold text-center transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-black hover:opacity-90'
                      : 'bg-[#1A1A1A] text-white hover:bg-[#242424]'
                  }`}
                >
                  Escolher {plan.name}
                </Link>
              </div>

              <div className="border-t border-[#1A1A1A]">
                <table className="w-full">
                  <tbody>
                    {plan.features.map((feature, index) => (
                      <tr key={index} className="border-b border-[#1A1A1A]/50">
                        <td className="py-3 px-6 text-sm">{feature.name}</td>
                        <td className="py-3 px-6 text-right">
                          {feature.included ? (
                            <span className="text-green-500">✓</span>
                          ) : (
                            <span className="text-gray-600">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Perguntas Frequentes</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2">Posso mudar de plano depois?</h4>
              <p className="text-gray-400 text-sm">Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">O que está incluído no preço?</h4>
              <p className="text-gray-400 text-sm">Hospedagem, domínio (.com ou .com.br), SSL e suporte durante todo o período.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Tem período de teste?</h4>
              <p className="text-gray-400 text-sm">Oferecemos 7 dias de teste para o plano Profissional. Cancele a qualquer momento.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Como funciona o pagamento?</h4>
              <p className="text-gray-400 text-sm">PIX, cartão de crédito (até 12x) ou boleto. O pagamento é recorrente mensal.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">Ainda tem dúvidas?</p>
          <Link href="/support" className="text-[#00D4FF] hover:underline">
            Fale com nosso time →
          </Link>
        </div>
      </div>
    </div>
  );
}