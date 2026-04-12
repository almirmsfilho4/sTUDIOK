'use client';

import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

const features = [
  { icon: 'dumbbell', title: 'Aulas e Horários', desc: 'Lista completa de aulas, horários e instrutores. Cliente agenda na hora.' },
  { icon: 'smartphone', title: 'App Próprio', desc: 'Seu app na Play Store e App Store. Muito mais credibilidade.' },
  { icon: 'dollar', title: 'Planos Online', desc: 'Venda mensalidades direto pelo site. PIX, cartão, boleto.' },
  { icon: 'award', title: 'Resultados', desc: 'Depoimentos e transformações. Prova social que vende.' },
  { icon: 'map-pin', title: 'Localização', desc: 'Mapa, endereço, estacionamento. Cliente encontra fácil.' },
  { icon: 'target', title: 'Trial Grátis', desc: 'Converta visitantes em alunos com oferta de aula experimental.' },
];

export default function SiteAcademiaPage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="ESTUDIOK" className="h-12" />
          </Link>
          <Link href="/orcamento?segmento=academia" className="bg-[#FF006E] hover:opacity-90 px-6 py-3 rounded-full font-bold text-white">
            Quero Meu Site →
          </Link>
        </div>
      </nav>

      <main className="pt-20">
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF006E]/10 to-[#FF4D94]/10"></div>
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#FF006E]/20 rounded-full blur-[150px]"></div>

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF006E]/20 border border-[#FF006E]/40 mb-8">
                <PremiumIcon name="dumbbell" size={18} className="text-[#FF006E]" />
                <span className="text-[#FF006E] font-bold text-sm">Especialistas em Academias</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                Sua Academia{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FF4D94]">
                  Lotando diáriamente
                </span>
              </h1>
              
              <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                <strong className="text-white">Mais alunos = mais faturamento.</strong> Um site profissional que convierte visitantes em alunos.
              </p>

              <Link href="/orcamento?segmento=academia" className="bg-[#FF006E] hover:opacity-90 text-white px-10 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3">
                Criar Site da Minha Academia
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div key={i} className="bg-[#050505] rounded-2xl p-7 border border-white/5 hover:border-[#FF006E]/40 transition-all">
                  <PremiumIcon name={f.icon as any} size={32} className="text-[#FF006E] mb-4" />
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-4xl font-black text-[#FF006E] mb-2">R$ 497</p>
            <p className="text-gray-400 mb-6">Pagamento único. Seu para sempre.</p>
            <Link href="/orcamento?segmento=academia" className="bg-[#FF006E] hover:opacity-90 text-white px-8 py-4 rounded-full font-bold">
              Quero Agora →
            </Link>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]" id="contato">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para ter seu site?</h2>
            <p className="text-gray-400 mb-8">Solicite seu orçamento agora mesmo.</p>
            <Link href="/orcamento?segmento=academia" className="bg-[#FF006E] hover:opacity-90 text-white px-10 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3">
              Solicitar Orçamento Grátis
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-6 bg-[#0A0A0A] border-t border-white/5 text-center text-gray-500 text-sm">
        <span>© 2024 ESTUDIOK</span>
      </footer>
    </div>
  );
}