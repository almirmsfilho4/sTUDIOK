'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PremiumIcon } from '@/components/PremiumIcons';
import { Badge } from '@/components/PremiumUI';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: true });
const PremiumHero = dynamic(() => import('@/components/PremiumHero'), { ssr: true });
// const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false });
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: false });
const ServiceExamples = dynamic(() => import('@/components/ServiceExamples'), { ssr: false });
const AnimatedCounters = dynamic(() => import('@/components/AnimatedCounters'), { ssr: false });
const BeforeAfterGallery = dynamic(() => import('@/components/BeforeAfterGallery'), { ssr: false });
const SocialProof = dynamic(() => import('@/components/SocialProof'), { ssr: false });
const TrustBadges = dynamic(() => import('@/components/TrustBadges'), { ssr: true });
const VagaCounter = dynamic(() => import('@/components/VagaCounter'), { ssr: true });

const services = [
  {
    icon: <PremiumIcon name="site-institucional" size={32} />,
    title: 'Sites Institucionais',
    description: 'Sites premium, responsivos e otimizados para conversão máxima. Design exclusivo que representa a essência da sua marca.',
  },
  {
    icon: <PremiumIcon name="app-mobile" size={32} />,
    title: 'Apps Mobile Premium',
    description: 'Aplicativos nativos iOS/Android com UX premium. Performance otimizada e interfaces intuitivas.',
  },
  {
    icon: <PremiumIcon name="sistema-web" size={32} />,
    title: 'Sistemas Web Inteligentes',
    description: 'ERPs, CRMs e sistemas de gestão automatizados. Soluções personalizadas com IA integrada.',
  },
  {
    icon: <PremiumIcon name="ecommerce" size={32} />,
    title: 'E-commerce Premium',
    description: 'Lojas virtuais completas com sistema de pagamento integrado, gestão inteligente e relatórios avançados.',
  },
  {
    icon: <PremiumIcon name="ai-inteligente" size={32} />,
    title: 'IA & Automação',
    description: 'Sistemas com inteligência artificial para automação de processos, chatbots inteligentes e análise de dados.',
  },
  {
    icon: <PremiumIcon name="design-premium" size={32} />,
    title: 'Design Exclusivo',
    description: 'Interfaces premium com animações personalizadas, UX otimizada e identidade visual única.',
  },
];

const benefits = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Entrega Rápida',
    description: 'Projetos concluídos no prazo certo. Aceleramos mediante taxa adicional para urgência.',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Design Profissional',
    description: 'Interfaces modernas e experiências de usuário pensadas para converter visitantes em clientes.',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Tecnologia Moderna',
    description: 'Stack tecnológico atualizado com as melhores práticas de mercado e performance.',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    title: 'Suporte Dedicado',
    description: 'Atendimento pós-projeto para garantir que tudo funcione perfeitamente.',
  },
];

const portfolio = [
  {
    title: 'Menos Imposto',
    category: 'Sistema Fiscal & Contábil',
    image: 'https://menos-imposto.vercel.app/og-image.png',
    url: 'https://menos-imposto.vercel.app',
    description: 'Sistema completo para redução legal de impostos e otimização fiscal para empresas brasileiras.',
  },
  {
    title: 'Giro Cash',
    category: 'Sistema Financeiro',
    image: '/portfolio/girocash.png',
    url: 'https://girocash.vercel.app',
    description: 'Plataforma de gestão financeira e análise de fluxo de caixa para pequenas e médias empresas.',
  },
  {
    title: 'AMS Galetos',
    category: 'E-commerce Premium',
    image: '/portfolio/AMSGALETOS.png',
    url: 'https://amsgaletos.vercel.app',
    description: 'Loja virtual premium para restaurante especializado em galetos com sistema de pedidos online.',
  },
  {
    title: 'Liberta Web',
    category: 'Sistema Financeiro',
    image: '/portfolio/LIBERTA.png',
    url: 'https://liberta-web.vercel.app',
    description: 'Sistema de empréstimos consignados com análise automatizada e gestão de contratos.',
  },
  {
    title: 'App Roleja',
    category: 'App Mobile',
    image: '/portfolio/roleja.png',
    url: 'https://approleja.vercel.app',
    description: 'Aplicativo mobile para organização de eventos e festas universitárias com sistema de ingressos.',
  },
  {
    title: 'Strike Arena',
    category: 'Jogo Online',
    image: '/portfolio/STRIKEARENA.png',
    url: 'https://www.strikearena.com.br',
    description: 'Plataforma de jogos competitivos online com sistema de torneios e ranking.',
  },
  {
    title: 'ESTUDIOK SaaS',
    category: 'Plataforma SaaS',
    image: '/portfolio/ESTUDIOK.png',
    url: 'https://estudiok.com.br',
    description: 'Sistema completo de automação de marketing e gestão premium para agências digitais.',
  },
  {
    title: 'Ride Control Pro',
    category: 'Sistema de Gestão',
    image: '/portfolio/RIDECONTROLPRO.png',
    url: 'https://ridecontrol-pro.vercel.app',
    description: 'ERP para empresas de transporte urbano com controle de frotas, motoristas e rotas.',
  },
  {
    title: 'Duck Hunt Online',
    category: 'Jogo Online',
    image: '/portfolio/duckhunt.png',
    url: 'https://duck-hunt-online.vercel.app',
    description: 'Versão moderna do clássico jogo Duck Hunt com multiplayer online e ranking global.',
  },
];

export default function Home() {
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const { getDocuments } = await import('@/lib/firebase-services');
        const data = await getDocuments('portfolio');
        if (data && data.length > 0) {
          setPortfolioItems(data);
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
      } finally {
        setLoadingPortfolio(false);
      }
    };
    loadPortfolio();
  }, []);

  const displayPortfolio = portfolioItems.length > 0 ? portfolioItems : portfolio;

  return (
    <>
      <Navbar />
      {/* <Chatbot /> */}
      
      <main className="min-h-screen">
        {/* Premium Hero Section */}
        <PremiumHero />
        
        {/* Vaga Counter & Trust Badges */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="mb-12">
            <VagaCounter />
          </div>
          
          <div className="mb-12">
            <TrustBadges variant="compact" />
          </div>
        </div>

        <AnimatedCounters />

        {/* Services Section - AGGRESSIVE */}
        <section id="servicos" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00D4FF]/5 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-sm font-bold mb-4">
                🚀 TRANSFORME SEU NEGÓCIO HOJE
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mt-2">
                <span className="text-white">O que você </span>
                <span className="text-[#00D4FF]">PRECISA</span>
                <span className="text-white"> para vender mais</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
                Não é sobre "ter um site". É sobre ter uma máquina de vendas que trabalha 24/7.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <PremiumIcon name="ecommerce" size={48} />,
                  title: 'E-COMMERCE PREMIUM',
                  subtitle: 'Venda 24/7 enquanto dorme',
                  description: 'Loja completa pronta em 10 dias. Pagamentos, logística, gestão de pedidos. Tudo integrado.',
                  price: 'A partir de R$ 3.500',
                  cta: 'Quero minha loja'
                },
                {
                  icon: <PremiumIcon name="app-mobile" size={48} />,
                  title: 'APP MOBILE PREMIUM',
                  subtitle: 'Clientes na palma da mão',
                  description: 'Seu negócio no celular dos clientes. Notificações push, Loyalty, experiência premium.',
                  price: 'A partir de R$ 5.000',
                  cta: 'Quero meu app'
                },
                {
                  icon: <PremiumIcon name="sistema-web" size={48} />,
                  title: 'SISTEMA WEB INTELIGENTE',
                  subtitle: 'Automatize tudo com IA',
                  description: 'ERP, CRM, gestão automatizada. Elimine planilhas. Dados em tempo real, decisões melhores.',
                  price: 'A partir de R$ 8.000',
                  cta: 'Quero automatizar'
                },
                {
                  icon: <PremiumIcon name="landing-page" size={48} />,
                  title: 'LANDING PAGE DE CONVERSÃO',
                  subtitle: 'Converta visitantes em clientes',
                  description: 'Página otimizada para conversão máxima. Copywriting persuasivo, design premium.',
                  price: 'A partir de R$ 800',
                  cta: 'Quero minha landing'
                },
                {
                  icon: <PremiumIcon name="site-institucional" size={48} />,
                  title: 'SITE INSTITUCIONAL PREMIUM',
                  subtitle: 'Sua marca no topo',
                  description: 'Design profissional premium, SEO otimizado, velocidade ultrarrápida. Primeira impressão que vende.',
                  price: 'A partir de R$ 1.500',
                  cta: 'Quero meu site'
                },
                {
                  icon: <PremiumIcon name="ai-inteligente" size={48} />,
                  title: 'INTEGRAÇÕES COM IA',
                  subtitle: 'Conecte tudo com inteligência',
                  description: 'APIs, automações, integrações inteligentes. Seu sistema conectado com WhatsApp, ERP, gateways.',
                  price: 'Sob consulta',
                  cta: 'Falar com especialista'
                }
              ].map((service, index) => (
                <div key={index} className="card group hover:border-[#00D4FF] hover:shadow-lg hover:shadow-[#00D4FF]/20 transition-all">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-1">{service.title}</h3>
                  <p className="text-[#00D4FF] font-medium mb-3">{service.subtitle}</p>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                  <div className="text-sm text-gray-500 mb-4">{service.price}</div>
                  <Link href="/orcamento" className="btn-primary w-full py-3 text-center block text-sm">
                    {service.cta} →
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <span className="text-red-400 font-bold">⏰ OFERTA:</span>
                <span className="text-white">30% OFF no primeiro projeto - Restam <span className="text-red-400 font-bold">8 vagas</span> este mês</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="beneficios" className="py-24 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#00D4FF] font-bold uppercase tracking-wider">POR QUE EMPRESAS INTELIGENTES</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-2">
                <span className="text-white">Escolhem a </span>
                <span className="text-[#00D4FF]">ESTUDIOK</span>
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
                Não vendemos apenas código. Entregamos resultados reais para seu negócio.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <PremiumIcon name="conversao-alta" size={36} />,
                  title: 'Conversão Premium',
                  description: 'Sites otimizados para converter visitantes em clientes. Foco em resultados reais.'
                },
                {
                  icon: <PremiumIcon name="entrega-rapida" size={36} />,
                  title: 'Entrega 3x Mais Rápida',
                  description: 'Processo eficiente, sem burocracia. Focamos em entregar valor, não em reuniões.'
                },
                {
                  icon: <PremiumIcon name="ai-inteligente" size={36} />,
                  title: 'IA Integrada',
                  description: 'Inteligência artificial para automação, análise de dados e otimização em tempo real.'
                },
                {
                  icon: <PremiumIcon name="seguranca" size={36} />,
                  title: 'Segurança Total',
                  description: 'SSL, proteção contra ataques, backup automático. Seus dados sempre seguros.'
                },
                {
                  icon: <PremiumIcon name="otimizacao-seo" size={36} />,
                  title: 'SEO Premium',
                  description: 'Otimização avançada para aparecer no topo do Google. Visibilidade que converte.'
                },
                {
                  icon: <PremiumIcon name="suporte-24h" size={36} />,
                  title: 'Suporte 24/7 Premium',
                  description: 'Equipe especializada disponível sempre que precisar. Resposta rápida e eficiente.'
                }
              ].map((benefit, index) => (
                <div key={index} className="card hover:border-[#00D4FF]/50 p-6 hover:scale-105 transition-transform">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
<Link href="/orcamento" className="btn-primary text-lg px-10 py-5 inline-flex items-center gap-2">
                 <PremiumIcon name="raio" size={20} />
                 QUERO ESTES BENEFÍCIOS PREMIUM AGORA
               </Link>
              <p className="text-gray-500 text-sm mt-4">Ou clique no WhatsApp para falar diretamente</p>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-24 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#00D4FF] font-medium">PORTFÓLIO</span>
              <h2 className="text-4xl font-bold mt-2">Projetos que entregamos</h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Alguns dos projetos que desenvolvemos para clientes satisfeitos
              </p>
            </div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {loadingPortfolio ? (
    <div className="col-span-3 text-center py-12">
      <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-gray-400 mt-4">Carregando portfólio...</p>
    </div>
  ) : displayPortfolio.map((item, index) => (
 <a
  key={index}
  href={item.url || '#'}
  target="_blank"
  rel="noopener noreferrer"
  className="group relative overflow-hidden rounded-xl aspect-video cursor-pointer block"
 >
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
  <img
   src={item.image}
   alt={item.title}
   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  />
  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
<Badge className="bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/30 text-xs">
          {item.category}
        </Badge>
        <h3 className="text-lg font-semibold mt-2 text-white">{item.title}</h3>
        <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {item.description}
        </p>
        {item.url && (
          <span className="text-xs text-gray-300 mt-3 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <PremiumIcon name="external-link" size={12} />
            Ver projeto completo
          </span>
        )}
      </div>
    </a>
  ))} 
</div>
</div>
</section>

{/* Social Proof Section */}
  <section className="py-24 bg-[#0A0A0A]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SocialProof />
    </div>
  </section>

  <ServiceExamples />
        <BeforeAfterGallery />
        <FAQ />

        {/* CTA Section - AGGRESSIVE */}
        <section className="py-24 bg-gradient-to-r from-red-900/20 via-[#7B2CBF]/20 to-[#00D4FF]/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0djJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/50 mb-8 animate-pulse">
              <span className="text-red-400 font-bold">🔥 ÚLTIMAS VAGAS</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">NÃO DEIXE </span>
              <span className="text-red-400">SEU CONCORRENTE</span>
              <br />
              <span className="text-[#00D4FF]">VENDER NA SUA FRENTE</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              A cada dia que passa, você perde clientes para quem já tem presença digital.
              <span className="text-white font-bold"> 73% dos consumidores pesquisam antes de comprar.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/orcamento" className="btn-primary text-xl px-10 py-5 shadow-lg shadow-red-500/30 hover:shadow-red-500/50">
                <PremiumIcon name="fire" size={24} />
                <span className="ml-2">GARANTIR MEU 30% OFF AGORA</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00D4FF]">500+</div>
                <div className="text-sm text-gray-400">Projetos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00D4FF]">98%</div>
                <div className="text-sm text-gray-400">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00D4FF]">24/7</div>
                <div className="text-sm text-gray-400">Suporte</div>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm">
              🔒 Orçamento sem compromisso | Sem necessidade técnica | Pagamento facilitado
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-[#0A0A0A] border-t border-[#1A1A1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                 <div className="flex items-center gap-2 mb-4">
<img 
                     src="/logo.png" 
                      alt="ESTUDIOK Logo"
                      className="w-20 h-20 object-contain"
                    />
                 </div>
                <p className="text-gray-400 text-sm">
                  Criando soluções digitais que transformam negócios.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Serviços</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#servicos" className="hover:text-[#00D4FF]">Sites Institucionais</a></li>
                  <li><a href="#servicos" className="hover:text-[#00D4FF]">Apps Mobile</a></li>
                  <li><a href="#servicos" className="hover:text-[#00D4FF]">Sistemas Web</a></li>
                  <li><a href="#servicos" className="hover:text-[#00D4FF]">E-commerce</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Links</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/orcamento" className="hover:text-[#00D4FF]">Orçamento</Link></li>
                  <li><Link href="/login" className="hover:text-[#00D4FF]">Login</Link></li>
                  <li><Link href="/cadastro" className="hover:text-[#00D4FF]">Cadastro</Link></li>
                </ul>
              </div>
              
<div>
 <h4 className="font-semibold mb-4">Contato</h4>
 <form className="space-y-3" onSubmit={async (e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const name = (form.elements.namedItem('name') as HTMLInputElement).value;
  const email = (form.elements.namedItem('email') as HTMLInputElement).value;
  const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
  
  try {
   const res = await fetch('/api/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
     to: 'estudiokgames@gmail.com',
     subject: `Contato de ${name}`,
     html: `<p><strong>Nome:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Mensagem:</strong> ${message}</p>`,
    }),
   });
   if (res.ok) {
    alert('Mensagem enviada com sucesso!');
    form.reset();
   } else {
    alert('Erro ao enviar mensagem');
   }
  } catch (err) {
   alert('Erro ao enviar mensagem');
  }
 }}>
  <input type="text" name="name" placeholder="Seu nome" required className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-sm text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none" />
  <input type="email" name="email" placeholder="Seu email" required className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-sm text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none" />
  <textarea name="message" placeholder="Sua mensagem" required rows={3} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-sm text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none resize-none"></textarea>
  <button type="submit" className="w-full py-2 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-lg text-white font-medium text-sm hover:opacity-90 transition-opacity">Enviar</button>
 </form>
</div>
            </div>
            
             <div className="mt-12 pt-8 border-t border-[#1A1A1A] text-center text-gray-400 text-sm">
                © 2024 <img src="/logo.png" alt="ESTUDIOK" className="w-10 h-10 object-contain inline-block mx-1" />. Todos os direitos reservados.
             </div>
          </div>
        </footer>
      </main>
    </>
  );
}