'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const works = [
  { name: 'TechHub', category: 'Tecnologia', icon: '💻' },
  { name: 'Sabor Local', category: 'Restaurante', icon: '🍕' },
  { name: 'FitLife', category: 'Academia', icon: '💪' },
  { name: 'BeautyPro', category: 'Beleza', icon: '💅' },
  { name: 'EducaMais', category: 'Educação', icon: '📚' },
  { name: 'AutoPeças', category: 'Automotivo', icon: '🚗' },
];

const includes = [
  'Logo principal + variações (horizontal, vertical, ícone)',
  'Manual de marca (cores, fontes, uso)',
  'Arquivos em alta resolução (AI, EPS, PDF, PNG, JPG)',
  'Cartão de visita digital',
  'Assinatura de email',
  'Rosa do vento',
];

export default function CriarLogoPage() {
  const [form, setForm] = useState({ nome: '', whatsapp: '', segmento: '', email: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, source: 'landing-criar-logo' }) });
      setEnviado(true);
    } catch (err) { console.error(err); }
    finally { setEnviando(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="ESTUDIOK" className="h-12" />
            <span className="text-xl font-bold text-white">ESTUDIOK</span>
          </Link>
          <a href="#contato" className="bg-[#10B981] hover:bg-[#10B981]/90 px-6 py-3 rounded-full font-bold text-white transition-colors">
            Criar Meu Logo →
          </a>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 via-transparent to-[#059669]/10"></div>
          <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-[#10B981]/20 rounded-full blur-[150px]"></div>

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 mb-8">
                <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
                <span className="text-[#10B981] font-bold text-sm">✨ Design profissional</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                Seu Logo Vale{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399]">
                  Milhões
                </span>
              </h1>
              
              <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                O primeiro impacto do seu cliente. <strong className="text-white">Um logo profissional</strong> passa credibilidade e vende mais.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a href="#contato" className="bg-[#10B981] hover:bg-[#10B981]/90 text-white px-10 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3 transition-all hover:scale-105">
                  Criar Meu Logo
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Trabalhos <span className="text-[#10B981]">recentes</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {works.map((w, i) => (
                <div key={i} className="bg-[#050505] rounded-2xl p-8 border border-white/5 hover:border-[#10B981]/40 transition-all hover:-translate-y-1 group">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                    {w.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center">{w.name}</h3>
                  <p className="text-[#10B981] text-center text-sm">{w.category}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#050505]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">O que você <span className="text-[#10B981]">recebe</span></h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {includes.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-[#10B981]/10 to-[#34D399]/10 rounded-3xl p-12 border border-[#10B981]/20">
              <p className="text-gray-400 mb-2">De</p>
              <p className="text-3xl line-through text-gray-500">R$ 997</p>
              <p className="text-6xl font-black text-[#10B981] mb-4">R$ 297</p>
              <p className="text-gray-400 mb-8">Pagamento único. Seu para sempre.</p>
              <a href="#contato" className="bg-[#10B981] hover:bg-[#10B981]/90 text-white px-10 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2">
                Criar Meu Logo Agora →
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]" id="contato">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-bold mb-6">Vamos criar sua <span className="text-[#10B981]">marca?</span></h2>
                <p className="text-xl text-gray-400 mb-8">Conte-nos sobre seu negócio.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-2xl">🎨</div><div><p className="font-bold">Design exclusivo</p><p className="text-sm text-gray-400">100% personalizado</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#059669]/20 flex items-center justify-center text-2xl">⚡</div><div><p className="font-bold">Entrega em 3 dias</p><p className="text-sm text-gray-400">Rápido e eficiente</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">🔄</div><div><p className="font-bold">Revisões inclusas</p><p className="text-sm text-gray-400">Ate ficar perfeito</p></div></div>
                </div>
              </div>
              <div className="bg-[#050505] rounded-2xl p-8 border border-white/10">
                {enviado ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                    <h3 className="text-2xl font-bold">Projeto iniciado!</h3>
                    <p className="text-gray-400">Em breve entramos em contato.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-2xl font-bold mb-6">Criar Meu Logo</h3>
                    <input type="text" required placeholder="Seu nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#10B981] focus:outline-none" />
                    <input type="email" required placeholder="Seu email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#10B981] focus:outline-none" />
                    <input type="tel" required placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#10B981] focus:outline-none" />
                    <select required value={form.segmento} onChange={e => setForm({...form, segmento: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:border-[#10B981] focus:outline-none">
                      <option value="">Tipo de negócio?</option>
                      <option value="tecnologia">Tecnologia</option>
                      <option value="restaurante">Restaurante</option>
                      <option value="varejo">Varejo</option>
                      <option value="servicos">Serviços</option>
                      <option value="outro">Outro</option>
                    </select>
                    <button type="submit" disabled={enviando} className="w-full py-4 bg-[#10B981] rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      {enviando ? 'Enviando...' : 'Criar Meu Logo →'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-[#0A0A0A] border-t border-white/5 text-center text-gray-500">
        <div className="flex items-center justify-center gap-2"><img src="/logo.png" alt="" className="h-8" /><span>© 2024 ESTUDIOK</span></div>
      </footer>
    </div>
  );
}