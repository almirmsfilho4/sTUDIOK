'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const projects = [
  { name: 'Strike Arena', type: 'Multiplayer', icon: '⚔️' },
  { name: 'Duck Hunt', type: 'Arcade', icon: '🦆' },
  { name: 'Space Invaders', type: 'Classic', icon: '🚀' },
  { name: 'Puzzle Quest', type: 'Puzzle', icon: '🧩' },
];

const services = [
  { icon: '🎮', title: 'Jogos Mobile', desc: 'iOS e Android. Games casuais, puzzles, action.' },
  { icon: '🖥️', title: 'Jogos PC/Web', desc: 'Browser games, indie games, protótipos.' },
  { icon: '🎯', title: 'Game Design', desc: 'Mecânicas, levels, balancing, documentação.' },
  { icon: '🎨', title: 'Arte 2D/3D', desc: 'Personagens, cenários, animações, UI.' },
  { icon: '🔊', title: 'Áudio', desc: 'Trilhas sonoras, efeitos, voice over.' },
  { icon: '🚀', title: 'Publicação', desc: 'App Store, Google Play, Steam, itch.io.' },
];

export default function DesenvolvedorGamesPage() {
  const [form, setForm] = useState({ nome: '', whatsapp: '', segmento: '', email: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, source: 'landing-desenvolvedor-games' }) });
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
          <a href="#contato" className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 px-6 py-3 rounded-full font-bold text-white transition-colors">
            Desenvolver Meu Jogo →
          </a>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/15 via-transparent to-[#EC4899]/15"></div>
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#8B5CF6]/25 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#EC4899]/20 rounded-full blur-[120px]"></div>

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 mb-8">
                <span className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse"></span>
                <span className="text-[#8B5CF6] font-bold text-sm">🎮 Studio de Jogos</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                Transforme sua {' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899]">
                  Ideia em Jogo
                </span>
              </h1>
              
              <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                De ideia a App Store. <strong className="text-white">Desenvolvemos jogos</strong> que engajam e monetizam.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a href="#contato" className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white px-10 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3 transition-all hover:scale-105">
                  Desenvolver Meu Jogo
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {projects.map((p, i) => (
                  <div key={i} className="bg-[#0A0A0A] rounded-xl p-4 border border-white/10">
                    <div className="text-3xl mb-2">{p.icon}</div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                O que <span className="text-[#8B5CF6]">desenvolvemos</span>?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <div key={i} className="bg-[#050505] rounded-2xl p-7 border border-white/5 hover:border-[#8B5CF6]/40 transition-all hover:-translate-y-1">
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-[#8B5CF6]/10 via-[#EC4899]/10 to-[#8B5CF6]/10 rounded-3xl p-12 border border-white/10">
              <h2 className="text-3xl font-bold mb-4">Tem uma ideia de jogo?</h2>
              <p className="text-xl text-gray-400 mb-8">Milhares de jogos de sucesso nasceram de uma ideia. Vamos transformar a sua em realidade.</p>
              <a href="#contato" className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white px-10 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2">
                Falar com Especialista →
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]" id="contato">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-bold mb-6">Vamos criar seu <span className="text-[#8B5CF6]">jogo?</span></h2>
                <p className="text-xl text-gray-400 mb-8">Conte-nos sobre sua ideia.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center text-2xl">🎮</div><div><p className="font-bold">Experiência</p><p className="text-sm text-gray-400">Jogos publicados</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#EC4899]/20 flex items-center justify-center text-2xl">⚡</div><div><p className="font-bold">Entrega rápida</p><p className="text-sm text-gray-400">Protótipo em 30 dias</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">🎯</div><div><p className="font-bold">Preço justo</p><p className="text-sm text-gray-400">Sem-surpresas</p></div></div>
                </div>
              </div>
              <div className="bg-[#050505] rounded-2xl p-8 border border-white/10">
                {enviado ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                    <h3 className="text-2xl font-bold">Ideia recebida!</h3>
                    <p className="text-gray-400">Em breve retornamos.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-2xl font-bold mb-6">Desenvolver Jogo</h3>
                    <input type="text" required placeholder="Seu nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#8B5CF6] focus:outline-none" />
                    <input type="email" required placeholder="Seu email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#8B5CF6] focus:outline-none" />
                    <input type="tel" required placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#8B5CF6] focus:outline-none" />
                    <select required value={form.segmento} onChange={e => setForm({...form, segmento: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none">
                      <option value="">Tipo de jogo?</option>
                      <option value="casual">Casual/Mobile</option>
                      <option value="puzzle">Puzzle</option>
                      <option value="acao">Ação</option>
                      <option value="rpg">RPG</option>
                      <option value="estrategia">Estratégia</option>
                      <option value="outro">Outro</option>
                    </select>
                    <button type="submit" disabled={enviando} className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      {enviando ? 'Enviando...' : 'Desenvolver Meu Jogo →'}
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