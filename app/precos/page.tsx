'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

const plans = [
  {
    id: 'manutencao',
    icon: 'tool',
    title: 'Manutenção',
    color: '#06B6D4',
    desc: 'Para quem já tem um site e precisa de manutenção',
    price: '97',
    period: 'mês',
    features: [
      'Hospedagem inclusa',
      'Atualizações de segurança',
      'Alterações de conteúdo',
      'Suporte por email',
      'Backup automático',
      'SSL sempre ativo',
    ],
    popular: false,
  },
  {
    id: 'premium',
    icon: 'star',
    title: 'Premium',
    color: '#8B5CF6',
    desc: 'Tudo incluso + marketing digital',
    price: '197',
    period: 'mês',
    features: [
      'Tudo do plano Manutenção',
      'Google Ads gestionado',
      'Relatórios mensais',
      'SEO contínuo',
      'Suporte prioritário',
      'WhatsApp business integrado',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    icon: 'briefcase',
    title: 'Enterprise',
    color: '#EF4444',
    desc: 'Para empresas que precisam de tudo',
    price: '397',
    period: 'mês',
    features: [
      'Tudo do plano Premium',
      'Múltiplos sites',
      'App personalizado',
      'API exclusiva',
      'Gerente de contas',
      'Suporte 24/7',
    ],
    popular: false,
  },
];

const niches = [
  { icon: 'utensils', name: 'Restaurante', url: '/site-restaurante', color: '#EF4444' },
  { icon: 'dumbbell', name: 'Academia', url: '/site-academia', color: '#22C55E' },
  { icon: 'scissors', name: 'Salão', url: '/site-salao', color: '#EC4899' },
  { icon: 'gavel', name: 'Advogado', url: '/site-advogado', color: '#8B5CF6' },
  { icon: 'stethoscope', name: 'Clínica', url: '/site-clinica', color: '#06B6D4' },
  { icon: 'building', name: 'Imobiliária', url: '/site-imobiliaria', color: '#3B82F6' },
  { icon: 'car', name: 'Autoescola', url: '/site-autoescola', color: '#22C55E' },
  { icon: 'map-pin', name: 'Hotel', url: '/site-hotel', color: '#6366F1' },
];

const faq = [
  { q: 'Qual a forma de pagamento?', a: 'Aceitamos Pix, cartão de crédito (parcelado em até 12x), transferência bancária ou boleto.' },
  { q: 'O que está incluso na hospedagem?', a: 'Domínio .com.br, SSL, emails profissionais e backup automático.' },
  { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Sem contrato de fidelidade. Cancele quando quiser.' },
  { q: 'Como funciona o suporte?', a: 'Por email (manutenção), chat (premium) ou telefone (enterprise).' },
  { q: 'Preciso de um site novo também?', a: 'Não! Os planos funcionam para qualquer site. Mas se precisar, solicite orçamento.' },
];

export default function PrecosPage() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-white/10 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-white font-semibold hidden md:block">Pronto para ter suporte contínuo?</p>
            <Link href="/orcamento" className="bg-[#8B5CF6] hover:opacity-90 text-white px-6 py-2.5 rounded-full font-bold text-sm inline-flex items-center gap-2">
              Solicitar Orçamento <PremiumIcon name="arrow-right" size={16} />
            </Link>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="ESTUDIOK" className="h-12" />
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition">Início</Link>
            <Link href="/precos" className="text-white font-semibold">Planos</Link>
            <Link href="/orcamento" className="bg-[#8B5CF6] hover:opacity-90 px-5 py-2.5 rounded-full font-bold text-white text-sm">
              Novo Projeto
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
                <PremiumIcon name="star" size={16} className="text-[#8B5CF6]" />
                <span className="text-[#8B5CF6] font-semibold text-sm">Planos Mensais</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Sua empresa sempre{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]">
                  Online e Otimizada
                </span>
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Hospedagem, suporte e marketing digital em um só plano.
                Sem surpresas, sem mensalidades escondidas.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <PremiumIcon name="check" size={16} className="text-green-500" />
                  <span>Cancelamento livre</span>
                </div>
                <div className="flex items-center gap-2">
                  <PremiumIcon name="check" size={16} className="text-green-500" />
                  <span>Hospedagem inclusa</span>
                </div>
                <div className="flex items-center gap-2">
                  <PremiumIcon name="check" size={16} className="text-green-500" />
                  <span>Suporte dedicado</span>
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
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      <PremiumIcon name={plan.icon as any} size={32} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                    <p className="text-gray-400 text-sm">{plan.desc}</p>
                  </div>

                  <div className="text-center mb-6">
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
                    href={`/orcamento?plano=${plan.id}`}
                    className="block w-full py-4 rounded-full font-bold text-center transition-all"
                    style={{ 
                      backgroundColor: plan.popular ? plan.color : 'transparent',
                      border: plan.popular ? 'none' : '2px solid white/20',
                      color: 'white'
                    }}
                  >
                    Assinar Plano →
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-400">
                Precisa criar um site novo?{' '}
                <Link href="/orcamento" className="text-[#8B5CF6] hover:underline font-semibold">
                  Solicite um orçamento →
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Sites por Nicho</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Especialistas em cada segmento.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {niches.map((niche) => (
                <Link 
                  key={niche.url}
                  href={niche.url}
                  className="bg-[#050505] rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all text-center group"
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${niche.color}20` }}
                  >
                    <PremiumIcon name={niche.icon as any} size={28} className="text-white" />
                  </div>
                  <h3 className="font-semibold">{niche.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#050505]">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
            </div>

            <div className="space-y-4">
              {faq.map((item, i) => (
                <div key={i} className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/5">
                  <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                  <p className="text-gray-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ainda tem dúvidas?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Fale com nosso time. Avaliamos seu caso e recomendamos a melhor solução.
            </p>
            <Link href="/orcamento" className="bg-[#8B5CF6] hover:opacity-90 text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3">
              Falar com Especialista
              <PremiumIcon name="message" size={20} />
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