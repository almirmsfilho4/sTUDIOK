'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const testimonials = [
  { name: 'Carlos Silva', company: 'Restaurante Sabor Caseiro', text: 'Nosso faturamento aumentou 150% após ter o site. Clientes novos todos os dias pelo Google.', avatar: 'CS' },
  { name: 'Mariana Costa', company: 'Clínica Estética Bella', text: 'Excelente trabalho! O site superou expectativas. Recomendo para todos os colegas de profissão.', avatar: 'MC' },
  { name: 'Roberto Alves', company: 'Autopeças Rápido', text: 'Agora consigo capturar leads automaticamente. Minha agenda nunca mais ficou vazia.', avatar: 'RA' },
];

const faqs = [
  { q: 'Em quanto tempo o site fica pronto?', a: 'Em até 48 horas após aprovação do design. Trabalhamos com agilidade sem comprometer a qualidade.' },
  { q: 'O site aparece no Google?', a: 'Sim! Todos os nossos sites são otimizados para SEO e indexados automaticamente no Google.' },
  { q: 'Preciso pagar mensalidade?', a: 'Não! O site é seu para sempre. Você só paga uma única vez e não tem custos mensais.' },
  { q: 'Como funciona o pagamento?', a: '50% para iniciar o projeto e 50% após a entrega. Aceitamos PIX, cartão ou boleto.' },
];

export default function CriarSitePage() {
  const [form, setForm] = useState({ nome: '', whatsapp: '', segmento: '', email: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'landing-criar-site' })
      });
      setEnviado(true);
    } catch (err) {
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const [countdown, setCountdown] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 45, seconds: 30 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="ESTUDIOK" className="h-14 w-auto" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] bg-clip-text text-transparent">ESTUDIOK</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/planos" className="text-sm text-gray-400 hover:text-white transition-colors">Planos</Link>
              <Link href="/#portfolio" className="text-sm text-gray-400 hover:text-white transition-colors">Portfólio</Link>
              <Link href="/criar-ecommerce" className="text-sm text-gray-400 hover:text-white transition-colors">E-commerce</Link>
            </div>
            <Link href="#contato" className="btn-primary text-sm px-5 py-2.5">
              Solicitar Orçamento
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 via-transparent to-[#7B2CBF]/5"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#00D4FF]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#7B2CBF]/10 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 mb-6">
                  <span className="w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse"></span>
                  <span className="text-sm text-[#00D4FF] font-medium">🚀 Site pronto em até 48 horas</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Transforme Visitantes em{' '}
                  <span className="bg-gradient-to-r from-[#00D4FF] via-[#00D4FF] to-[#7B2CBF] bg-clip-text text-transparent">
                    Clientes Fidelizados
                  </span>
                </h1>
                
                <p className="text-xl text-gray-400 mb-8 max-w-xl">
                  Tenha um site profissional queрабатывает24/7 para seu negócio. 
                  Design moderno, SEO otimizado e conversão alta. Sem mensalidade.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <a href="#contato" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                    Criar Meu Site Agora
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <Link href="/#portfolio" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                    Ver Exemplos
                  </Link>
                </div>

                <div className="flex items-center gap-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>SSL Grátis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Domínio .com.br</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Sem mensalidade</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/20 to-[#7B2CBF]/20 blur-3xl rounded-2xl"></div>
                <div className="relative bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden">
                  <div className="bg-[#0A0A0A] px-4 py-3 border-b border-white/5 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-xs text-gray-500">seusite.com.br</span>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop" 
                    alt="Site profissional" 
                    className="w-full"
                  />
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-[#0A0A0A] rounded-xl border border-white/10 p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">+147%</p>
                      <p className="text-sm text-gray-400">Vendas média</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { num: '500+', label: 'Sites Entregues' },
                { num: '48h', label: 'Tempo Médio de Entrega' },
                { num: '98%', label: 'Clientes Satisfeitos' },
                { num: '4.9', label: 'Nota Média' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] bg-clip-text text-transparent">
                    {stat.num}
                  </p>
                  <p className="text-gray-400 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Por que empresas com site vendem <span className="text-[#00D4FF]">mais</span>?
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                A presença digital profissional é essencial no mundo moderno. Veja os benefícios que separamos para você.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🎯', title: 'Captação de Leads', desc: ' capture automaticamente contato de interessados 24h por dia, mesmo quando você dorme.' },
                { icon: '📱', title: 'Visibilidade Mobile', desc: 'Mais de 70% das buscas hoje são pelo celular. Seu site precisa funcionar perfeitamente em qualquer tela.' },
                { icon: '🏆', title: 'Credibilidade Instantânea', desc: 'Um site profissional passa confiança e autoridade. Clientes confiam 3x mais em empresas com site.' },
                { icon: '📈', title: 'Appear no Google', desc: 'Seja encontrado por clientes que buscam seus serviços. Appearing no Google é essencial para novos clientes.' },
                { icon: '💰', title: 'Sem Limites de Vendas', desc: 'Diferente de marketplaces, você não paga comissão por venda. Toda a receita é sua.' },
                { icon: '⚡', title: 'Atendimento 24/7', desc: 'Seu site работает sempre. Clientes podem ver serviços, produtos e entrar em contato a qualquer hora.' },
              ].map((benefit, i) => (
                <div key={i} className="group bg-[#0A0A0A] rounded-2xl p-6 border border-white/5 hover:border-[#00D4FF]/30 transition-all hover:transform hover:-translate-y-1">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tudo que você <span className="text-[#00D4FF]">recebe</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Design exclusivo e personalizado',
                'Responsivo (funciona em celular, tablet e PC)',
                'Otimização SEO completa',
                'SSL segurança (https) vitalício',
                'Domínio próprio (.com.br) configuração',
                'Formulário de contato automático',
                'Integração com WhatsApp',
                'Galeria de imagens ilimitada',
                'Até 5 páginas personalizadas',
                'Chat online opcional',
                'Google Analytics integrado',
                'Suporte pós-entrega'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-[#00D4FF]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-[#050505] to-[#0A0A0A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-500 font-medium">Oferta por tempo limitado</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Garanta seu site com <span className="line-through text-gray-500">R$ 997</span>
            </h2>
            <p className="text-5xl font-bold text-[#00D4FF] mb-4">R$ 497</p>
            <p className="text-gray-400 mb-8">Pagamento único. Sem mensalidade. Sem surpresas.</p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
              <span>Offer expires in:</span>
              <span className="font-mono text-lg text-white">
                {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
              </span>
            </div>

            <a href="#contato" className="btn-primary text-lg px-12 py-5 inline-flex items-center gap-2 text-lg">
              Quero Garantir Meu Desconto
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <p className="mt-4 text-sm text-gray-500 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              7 dias de garantia de satisfação
            </p>
          </div>
        </section>

        <section className="py-20 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                O que nossos <span className="text-[#00D4FF]">clientes dizem</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] flex items-center justify-center font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-400">"{t.text}"</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]" id="contato">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Pronto para <span className="text-[#00D4FF]">explodir</span> suas vendas?
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                  Preencha o formulário e nossa equipe entrará em contato em até 2 horas com uma proposta personalizada.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold">Retorno em 2 horas</p>
                      <p className="text-sm text-gray-400">Respondemos rapidinho</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-[#7B2CBF]/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#7B2CBF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold">Sem compromisso</p>
                      <p className="text-sm text-gray-400">Orçamento 100% gratuito</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold">Pagamento Seguro</p>
                      <p className="text-sm text-gray-400">PIX, cartão ou boleto</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0A0A0A] rounded-2xl p-8 border border-white/10">
                {enviado ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Solicitação Enviada!</h3>
                    <p className="text-gray-400">Em até 2 horas nossa equipe entrará em contato pelo WhatsApp.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-2xl font-bold mb-6">Solicitar Orçamento</h3>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Seu Nome Completo</label>
                      <input 
                        type="text" 
                        required
                        value={form.nome}
                        onChange={e => setForm({...form, nome: e.target.value})}
                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none"
                        placeholder="João Silva"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Seu Melhor Email</label>
                      <input 
                        type="email" 
                        required
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none"
                        placeholder="seu@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">WhatsApp com DDD</label>
                      <input 
                        type="tel" 
                        required
                        value={form.whatsapp}
                        onChange={e => setForm({...form, whatsapp: e.target.value})}
                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Tipo de Negócio</label>
                      <select 
                        required
                        value={form.segmento}
                        onChange={e => setForm({...form, segmento: e.target.value})}
                        className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#00D4FF] focus:outline-none"
                      >
                        <option value="">Selecione...</option>
                        <option value="restaurante">Restaurante / Lanchonete</option>
                        <option value="loja">Loja de Varejo</option>
                        <option value="servicos">Prestação de Serviços</option>
                        <option value="saude">Saúde / Beleza</option>
                        <option value="educacao">Educação / Cursos</option>
                        <option value="imobiliaria">Imobiliária</option>
                        <option value="outro">Outro segmento</option>
                      </select>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={enviando}
                      className="w-full py-4 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      {enviando ? (
                        'Enviando...'
                      ) : (
                        <>
                          Solicitar Orçamento Grátis
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#050505]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-[#0A0A0A] rounded-xl border border-white/5 overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between"
                  >
                    <span className="font-medium">{faq.q}</span>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4 text-gray-400">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ESTUDIOK" className="h-8 w-auto" />
            <span className="text-gray-500">© 2024 ESTUDIOK. Todos os direitos reservados.</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-white transition-colors">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}