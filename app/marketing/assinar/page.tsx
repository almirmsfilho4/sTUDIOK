'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 97,
    period: 'mês',
    color: '#22C55E',
    features: [
      '5 posts/mês',
      '1 canal (Instagram)',
      'Gerador de legendas IA',
      'Agendamento básico',
      'Estatísticas simples',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 197,
    period: 'mês',
    color: '#8B5CF6',
    features: [
      'Posts ilimitados',
      'Todos os canais',
      'IA completa',
      'Agendamento automático',
      'Relatórios avançados',
      'Suporte prioritário',
    ],
    popular: true,
  },
  {
    id: 'agency',
    name: 'Agência',
    price: 497,
    period: 'mês',
    color: '#F59E0B',
    features: [
      'Tudo do Profissional',
      '5 sub-contas',
      'API aberta',
      'White-label',
      'Gerente dedicado',
      'Treinamento',
    ],
    popular: false,
  },
];

export default function AssinarPage() {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="ESTUDIOK" className="h-12" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-400 hover:text-white">Entrar</Link>
            <Link href="/orcamento" className="bg-[#8B5CF6] hover:opacity-90 px-5 py-2.5 rounded-full font-bold text-white text-sm">
              Começar
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 mb-6">
                <PremiumIcon name="bolt" size={16} className="text-[#8B5CF6]" />
                <span className="text-[#8B5CF6] font-semibold text-sm">Automação de Marketing</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Sua Empresas Sempre{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]">
                  Nas Redes Sociais
                </span>
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                IA cria, agenda e posta automaticamente. Você só aprova e acompanha os resultados.
              </p>

              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                  <span className="text-2xl">📸</span>
                  <span className="text-gray-300">Instagram</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                  <span className="text-2xl">📘</span>
                  <span className="text-gray-300">Facebook</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                  <span className="text-2xl">🎵</span>
                  <span className="text-gray-300">TikTok</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                  <span className="text-2xl">💬</span>
                  <span className="text-gray-300">WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-[#0A0A0A] rounded-3xl p-8 border ${
                    plan.popular 
                      ? 'border-[#8B5CF6]/50 shadow-2xl shadow-[#8B5CF6]/10' 
                      : 'border-white/10'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#8B5CF6] rounded-full text-sm font-bold text-white">
                      Mais Popular
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-5xl font-black" style={{ color: plan.color }}>R$ {plan.price}</span>
                      <span className="text-gray-400 mb-2">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                        <PremiumIcon name="check" size={18} className="text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href={`/marketing/checkout?plan=${plan.id}`}
                    className="block w-full py-4 rounded-full font-bold text-center transition-all"
                    style={{ 
                      backgroundColor: plan.popular ? plan.color : 'transparent',
                      border: plan.popular ? 'none' : '2px solid white/20',
                      color: 'white'
                    }}
                  >
                    Assinar Agora →
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-400">
                Precisa de algo personalizado?{' '}
                <Link href="/orcamento?servico=marketing" className="text-[#8B5CF6] hover:underline">
                  Fale conosco
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">1️⃣</span>
                </div>
                <h3 className="font-bold text-white mb-2">Escolha o Plano</h3>
                <p className="text-gray-400 text-sm">Selecione o plano ideal para seu negócio</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">2️⃣</span>
                </div>
                <h3 className="font-bold text-white mb-2">Conecte as Redes</h3>
                <p className="text-gray-400 text-sm">Autorize o acesso às suas redes sociais</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">3️⃣</span>
                </div>
                <h3 className="font-bold text-white mb-2">A IA Trabalha</h3>
                <p className="text-gray-400 text-sm">Nossa IA cria e agenda conteúdo automaticamente</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">4️⃣</span>
                </div>
                <h3 className="font-bold text-white mb-2">Acompanhe Resultados</h3>
                <p className="text-gray-400 text-sm">Veja métricas de engajamento e crescimento</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src="/logo.png" alt="ESTUDIOK" className="h-8 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">© 2024 ESTUDIOK. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}