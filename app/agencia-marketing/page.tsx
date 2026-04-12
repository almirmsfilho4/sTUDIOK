'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const results = [
  { num: '312%', label: 'Aumento médio em leads', icon: '🎯' },
  { num: '5x', label: 'ROI em anúncios', icon: '💰' },
  { num: '89%', label: 'Clientes satisfeitos', icon: '⭐' },
  { num: '24h', label: 'Tempo de resposta', icon: '⚡' },
];

const services = [
  { icon: '📱', title: 'Tráfego Pago', desc: 'Facebook, Instagram, Google Ads. Campanhas otimizadas desde o primeiro dia.' },
  { icon: '📧', title: 'Email Marketing', desc: 'Sequências automáticas que nutrem Leads e vendem enquanto você dorme.' },
  { icon: '🎨', title: 'Criação de Conteúdo', desc: 'Copy, design, vídeos. Material profissional que converte.' },
  { icon: '📊', title: 'Analytics & ROI', desc: 'Relatórios claros. Veja exactly o que está funcionando.' },
  { icon: '🤖', title: 'Automação', desc: 'Chatbots, sequências, follow-ups. Tudo automatizado.' },
  { icon: '🔍', title: 'SEO', desc: 'Apare no Google. Organico e consistente ao longo do tempo.' },
];

const plans = [
  { name: 'Starter', price: 'R$ 997/mês', features: ['Gestão de anúncios', 'Relatórios mensais', '2 campanhas', 'Suporte por email'], popular: false },
  { name: 'Pro', price: 'R$ 1.997/mês', features: ['Tudo do Starter', '5 campanhas', 'Email marketing', 'Chatbot', 'Relatórios semanais'], popular: true },
  { name: 'Enterprise', price: 'Sob consulta', features: ['Campanhas ilimitadas', 'Equipe dedicada', 'Estratégia completa', 'Todas as ferramentas'], popular: false },
];

export default function AgenciaMarketingPage() {
  const [form, setForm] = useState({ nome: '', whatsapp: '', segmento: '', email: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, source: 'landing-agencia-marketing' }) });
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
          <a href="#contato" className="bg-gradient-to-r from-[#F59E0B] to-[#EF4444] hover:opacity-90 px-6 py-3 rounded-full font-bold text-white transition-colors">
            Contratar Agência →
          </a>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/10 via-transparent to-[#EF4444]/10"></div>
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#F59E0B]/20 rounded-full blur-[150px]"></div>

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40 mb-8">
                <span className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse"></span>
                <span className="text-[#F59E0B] font-bold text-sm">🏆 Agência Resultados</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                Pare de Jogar{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#EF4444]">
                  Dinheiro Fora
                </span>
              </h1>
              
              <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                <strong className="text-white">312% mais leads.</strong> É o que nossos clientes conseguem em média. Pare de gastar com anúncios que não funcionam.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a href="#contato" className="bg-gradient-to-r from-[#F59E0B] to-[#EF4444] hover:opacity-90 text-white px-10 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3 transition-all hover:scale-105">
                  Quero Mais Clientes
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                {results.map((r, i) => (
                  <div key={i} className="bg-[#0A0A0A] rounded-xl p-4 border border-[#F59E0B]/20">
                    <p className="text-3xl font-black text-[#F59E0B]">{r.num}</p>
                    <p className="text-sm text-gray-400">{r.label}</p>
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
                O que <span className="text-[#F59E0B]">fazemos</span>?
              </h2>
              <p className="text-xl text-gray-400">Tudo que você precisa para explode suas vendas</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <div key={i} className="bg-[#050505] rounded-2xl p-7 border border-white/5 hover:border-[#F59E0B]/40 transition-all hover:-translate-y-1">
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Planos <span className="text-[#F59E0B]">flexíveis</span></h2>
              <p className="text-xl text-gray-400">Escolha o que faz mais sentido pro seu negócio</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((p, i) => (
                <div key={i} className={`relative bg-[#0A0A0A] rounded-3xl p-8 border ${p.popular ? 'border-[#F59E0B]' : 'border-white/10'} ${p.popular ? 'scale-105' : ''}`}>
                  {p.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] px-4 py-1 rounded-full text-sm font-bold">Mais Escolhido</div>}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                    <p className="text-3xl font-black text-[#F59E0B]">{p.price}</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-gray-300">
                        <svg className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#contato" className={`block w-full py-4 rounded-xl font-bold text-center transition-all ${p.popular ? 'bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white hover:opacity-90' : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#252525]'}`}>
                    Escolher →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]" id="contato">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-bold mb-6">Vamos <span className="text-[#F59E0B]">explodir</span> suas vendas?</h2>
                <p className="text-xl text-gray-400 mb-8">Sua concorrência está investindo em marketing. Você não pode ficar de fora.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center text-2xl">🎯</div><div><p className="font-bold">Lead qualificado</p><p className="text-sm text-gray-400">Clientes interessados no seu produto</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#EF4444]/20 flex items-center justify-center text-2xl">📈</div><div><p className="font-bold">Resultado garantido</p><p className="text-sm text-gray-400">Metas claras e mensuráveis</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">⚡</div><div><p className="font-bold">Início rápido</p><p className="text-sm text-gray-400">Primeiros resultados em 7 dias</p></div></div>
                </div>
              </div>
              <div className="bg-[#050505] rounded-2xl p-8 border border-white/10">
                {enviado ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                    <h3 className="text-2xl font-bold">Pronto! Vamos começar!</h3>
                    <p className="text-gray-400">Em breve entramos em contato.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-2xl font-bold mb-6">Contratar Agência</h3>
                    <input type="text" required placeholder="Seu nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#F59E0B] focus:outline-none" />
                    <input type="email" required placeholder="Seu email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#F59E0B] focus:outline-none" />
                    <input type="tel" required placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#F59E0B] focus:outline-none" />
                    <select required value={form.segmento} onChange={e => setForm({...form, segmento: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:border-[#F59E0B] focus:outline-none">
                      <option value="">Faturamento mensal?</option>
                      <option value="ate5">Até R$ 5mil</option>
                      <option value="5a20">R$ 5mil a R$ 20mil</option>
                      <option value="20a50">R$ 20mil a R$ 50mil</option>
                      <option value="50+">R$ 50mil+</option>
                    </select>
                    <button type="submit" disabled={enviando} className="w-full py-4 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      {enviando ? 'Enviando...' : 'Quero Mais Clientes →'}
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