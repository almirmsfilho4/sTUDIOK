'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';
import SitePriceQuiz from '@/components/SitePriceQuiz';

export default function SimuladorPage() {
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
            <p className="text-white font-semibold hidden md:block">Pronto para começar?</p>
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
            <Link href="/precos" className="text-gray-400 hover:text-white transition">Preços</Link>
            <Link href="/orcamento" className="bg-[#8B5CF6] hover:opacity-90 px-5 py-2.5 rounded-full font-bold text-white text-sm">
              Orçamento
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
                <PremiumIcon name="dollar" size={16} className="text-[#8B5CF6]" />
                <span className="text-[#8B5CF6] font-semibold text-sm">Simulador Inteligente</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Descubra o Investimento <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]">
                  do Seu Projeto
                </span>
              </h1>

              <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
                Responda a algumas perguntas rápidas e receba uma estimativa de preço instantânea para o seu site.
              </p>

              <div className="flex justify-center">
                <SitePriceQuiz />
              </div>
            </div>

            <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 text-center">
                <PremiumIcon name="bolt" size={32} className="text-[#8B5CF6] mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Cálculo Rápido</h3>
                <p className="text-gray-400 text-sm">Sua estimativa em menos de 1 minuto.</p>
              </div>
              <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 text-center">
                <PremiumIcon name="check" size={32} className="text-[#8B5CF6] mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Transparência Total</h3>
                <p className="text-gray-400 text-sm">Preços baseados no mercado real.</p>
              </div>
              <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 text-center">
                <PremiumIcon name="message" size={32} className="text-[#8B5CF6] mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Ajuste Personalizado</h3>
                <p className="text-gray-400 text-sm">Possibilidade de ajustar valores no orçamento.</p>
              </div>
            </div>
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