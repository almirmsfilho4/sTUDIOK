'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import PremiumIcon from '@/components/PremiumIcon';
import { trackThankYouPage } from '@/components/MarketingScripts';

function AgradecimentoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [price, setPrice] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const quoteId = searchParams.get('quoteId');
    const nameParam = searchParams.get('name');
    const projectParam = searchParams.get('projectType');
    const priceParam = searchParams.get('price');

    if (nameParam) {
      setName(nameParam);
    }
    if (projectParam) {
      setProjectType(projectParam);
    }
    if (priceParam) {
      setPrice(parseInt(priceParam));
    }

    trackThankYouPage(nameParam || '', projectParam || '', parseInt(priceParam || '0'));

    const timer = setTimeout(() => {
      setLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const projectTypes: Record<string, { name: string; icon: string; color: string }> = {
    'site': { name: 'Site Institucional', icon: 'globe', color: '#00D4FF' },
    'landing': { name: 'Landing Page', icon: 'file', color: '#7B2CBF' },
    'ecommerce': { name: 'E-commerce', icon: 'shopping-cart', color: '#22C55E' },
    'app': { name: 'App Mobile', icon: 'smartphone', color: '#F59E0B' },
    'sistema': { name: 'Sistema Web', icon: 'code', color: '#EF4444' },
  };

  const projectInfo = projectTypes[projectType] || { name: 'Projeto Personalizado', icon: 'check', color: '#00D4FF' };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-[#0A0A0A] to-[#000]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Confetti Animation */}
          <div className="relative mb-12">
            <div className="absolute inset-0 flex justify-center">
              {loaded && (
                <>
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-2 h-2 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-full animate-confetti`}
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1 + Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          <div className={`text-center transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-[#00D4FF]/20 to-[#7B2CBF]/20 rounded-full mb-8">
              <PremiumIcon name="check" className="w-12 h-12 text-[#00D4FF]" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#00D4FF] via-[#7B2CBF] to-[#00D4FF] bg-clip-text text-transparent">
              {name ? `Parabéns, ${name}! 🎉` : 'Orçamento Recebido! 🎉'}
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Recebemos seu orçamento com sucesso! Nossa equipe está analisando sua proposta e em breve entraremos em contato para discutir os próximos passos.
            </p>
          </div>

          {/* Summary Card */}
          <div className={`bg-[#111] border border-[#242424] rounded-2xl p-8 mb-10 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl font-bold mb-6">Resumo do seu Orçamento</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${projectInfo.color}20` }}>
                  <span style={{ color: projectInfo.color }}>
                    <PremiumIcon name={projectInfo.icon as any} className="w-6 h-6" />
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tipo de Projeto</p>
                  <p className="text-xl font-semibold">{projectInfo.name}</p>
                </div>
              </div>

              {price > 0 && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500/10">
                    <PremiumIcon name="credit-card" className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Valor Estimado</p>
                    <p className="text-2xl font-bold text-[#00D4FF]">R$ {price.toLocaleString('pt-BR')}</p>
                    <p className="text-gray-500 text-sm mt-1">Este valor é uma estimativa inicial</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className={`grid md:grid-cols-3 gap-6 mb-10 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-[#111] border border-[#242424] rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <PremiumIcon name="clock" className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Próximos Passos</h3>
              <p className="text-gray-400 text-sm">
                Nossa equipe analisará sua proposta em até 24 horas e entrará em contato pelo WhatsApp/Email para discutir os detalhes.
              </p>
            </div>

            <div className="bg-[#111] border border-[#242424] rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <PremiumIcon name="message" className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Fale Direto Conosco</h3>
              <p className="text-gray-400 text-sm mb-4">
                Não quer esperar? Entre em contato diretamente pelo WhatsApp:
              </p>
              <a
                href="https://wa.me/5511999999999?text=Olá! Acabei de enviar um orçamento e gostaria de conversar sobre os detalhes."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all"
              >
                <PremiumIcon name="message" className="w-4 h-4" />
                Abrir WhatsApp
              </a>
            </div>

            <div className="bg-[#111] border border-[#242424] rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <PremiumIcon name="calendar" className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Agende uma Reunião</h3>
              <p className="text-gray-400 text-sm mb-4">
                Prefere agendar uma call para discutir seu projeto com mais detalhes?
              </p>
              <Link
                href="/agendar"
                className="inline-flex items-center gap-2 bg-[#7B2CBF] hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all"
              >
                <PremiumIcon name="calendar" className="w-4 h-4" />
                Agendar Call
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className={`bg-[#111] border border-[#242424] rounded-2xl p-8 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl font-bold mb-6">Recursos para Você</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/portfolio"
                className="group bg-[#1A1A1A] hover:bg-[#242424] border border-[#333] rounded-xl p-6 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <PremiumIcon name="briefcase" className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-[#00D4FF] transition-colors">Portfólio</h3>
                    <p className="text-gray-400 text-sm">Veja projetos similares</p>
                  </div>
                </div>
                <p className="text-gray-300">Explore nosso portfólio para ver projetos que já desenvolvemos e se inspirar.</p>
              </Link>

              <Link
                href="/depoimentos"
                className="group bg-[#1A1A1A] hover:bg-[#242424] border border-[#333] rounded-xl p-6 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <PremiumIcon name="star" className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-[#00D4FF] transition-colors">Depoimentos</h3>
                    <p className="text-gray-400 text-sm">O que nossos clientes dizem</p>
                  </div>
                </div>
                <p className="text-gray-300">Leia o feedback de clientes satisfeitos com nossos serviços e resultados.</p>
              </Link>
            </div>
          </div>

          {/* Final CTA */}
          <div className={`text-center mt-12 transition-all duration-1000 delay-900 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-gray-400 mb-6">
              Obrigado por escolher a ESTUDIOK! Estamos ansiosos para transformar sua ideia em realidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 border border-[#242424] hover:border-[#00D4FF] text-white rounded-lg font-medium transition-all"
              >
                Voltar para Home
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-[#00D4FF] hover:opacity-90 text-black rounded-lg font-medium transition-all"
              >
                Acessar Dashboard
              </Link>
            </div>
          </div>

          {/* Timer */}
          <div className={`mt-8 text-center transition-all duration-1000 delay-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-gray-500 text-sm">
              Você será redirecionado para seu dashboard em <span className="text-[#00D4FF] font-bold">10 segundos</span>...
            </p>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes confetti {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(500px) rotate(360deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </>
  );
}

export default function AgradecimentoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AgradecimentoContent />
    </Suspense>
  );
}