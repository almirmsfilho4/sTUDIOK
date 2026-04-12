'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'Grátis',
    color: '#22C55E',
    features: [
      '5 posts/mês',
      '1 canal (Instagram ou Facebook)',
      'Agendamento básico',
      'Relatórios simples',
      'Suporte por email',
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
      'Todos os canais (Instagram, Facebook, TikTok)',
      'IA para criar legendas',
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
      'Múltiplos clientes',
      'Automação completa',
      'API para integrações',
      'Gerente de contas',
      'Treinamento Incluso',
    ],
    popular: false,
  },
];

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="ESTUDIOK" className="h-12" />
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition">Início</Link>
            <Link href="/precos" className="text-gray-400 hover:text-white transition">Planos</Link>
            <Link href="/orcamento" className="bg-[#8B5CF6] hover:opacity-90 px-5 py-2.5 rounded-full font-bold text-white text-sm">
              Começar
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent" />
          <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-[#8B5CF6]/15 rounded-full blur-[180px]" />

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 mb-6">
                <PremiumIcon name="bolt" size={16} className="text-[#8B5CF6]" />
                <span className="text-[#8B5CF6] font-semibold text-sm">Automação de Marketing</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Marketing Automático{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]">
                  Que Vende Sozinho
                </span>
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Nossa IA cria, agenda e posta nas suas redes sociais automaticamente.
                Você só aprova e acompanha os resultados.
              </p>

              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                  <span className="text-gray-300">Instagram</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <span className="text-gray-300">Facebook</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.74 2.73-1.52 4.02-1.95 1.61-5.02 2.38-7.49 2.38-2.47 0-5.59-.98-7.48-2.38-1.79-1.3-2.44-2.63-1.53-4.03.01-2.91-.01-5.83.02-8.75.08-1.32.65-2.76 1.53-4.01 1.1-1.1 2.63-1.56 4.2-.97V.02z"/></svg>
                  </div>
                  <span className="text-gray-300">TikTok</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <PremiumIcon name="message" size={20} className="text-green-500" />
                  </div>
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
                      {plan.price === 0 ? (
                        <span className="text-4xl font-black text-green-500">Grátis</span>
                      ) : (
                        <>
                          <span className="text-5xl font-black" style={{ color: plan.color }}>R$ {plan.price}</span>
                          <span className="text-gray-400 mb-2">/{plan.period}</span>
                        </>
                      )}
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
                    href={`/orcamento?plano=${plan.id}&servico=marketing`}
                    className="block w-full py-4 rounded-full font-bold text-center transition-all"
                    style={{ 
                      backgroundColor: plan.popular ? plan.color : 'transparent',
                      border: plan.popular ? 'none' : '2px solid white/20',
                      color: 'white'
                    }}
                  >
                    {plan.price === 0 ? 'Começar Grátis →' : 'Assinar Plano →'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Funciona</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Automação completa do seu marketing digital
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-[#050505] p-6 rounded-2xl border border-white/5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-4">
                  <PremiumIcon name="star" size={28} className="text-[#8B5CF6]" />
                </div>
                <h3 className="font-bold text-white mb-2">1. IA Cria o Conteúdo</h3>
                <p className="text-gray-400 text-sm">Nossa inteligência artificial gera textos, legendas e ideias de posts.</p>
              </div>
              <div className="bg-[#050505] p-6 rounded-2xl border border-white/5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-4">
                  <PremiumIcon name="image" size={28} className="text-[#8B5CF6]" />
                </div>
                <h3 className="font-bold text-white mb-2">2. Gera as Artes</h3>
                <p className="text-gray-400 text-sm">Cria imagens e vídeos otimizados para cada plataforma.</p>
              </div>
              <div className="bg-[#050505] p-6 rounded-2xl border border-white/5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-4">
                  <PremiumIcon name="calendar" size={28} className="text-[#8B5CF6]" />
                </div>
                <h3 className="font-bold text-white mb-2">3. Agenda Automaticamente</h3>
                <p className="text-gray-400 text-sm">Publica nos melhores horários para maximum alcance.</p>
              </div>
              <div className="bg-[#050505] p-6 rounded-2xl border border-white/5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-4">
                  <PremiumIcon name="trending-up" size={28} className="text-[#8B5CF6]" />
                </div>
                <h3 className="font-bold text-white mb-2">4. Você Acompanha</h3>
                <p className="text-gray-400 text-sm">Dashboard com métricas de engajamento e conversão.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Quer automatizar seu marketing?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Agende uma demonstração gratuita e veja como funciona na prática.
            </p>
            <Link href="/orcamento?servico=marketing" className="bg-[#8B5CF6] hover:opacity-90 text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3">
              Agendar Demo Grátis
              <PremiumIcon name="arrow-right" size={20} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="ESTUDIOK" className="h-8" />
          </div>
          <p className="text-gray-500 text-sm">© 2024 ESTUDIOK. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}