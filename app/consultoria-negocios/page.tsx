'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const results = [
  { num: 'R$ 2.3M', label: 'Faturamento médio clientes', icon: '💰' },
  { num: '156', label: 'Empresas atendidas', icon: '🏢' },
  { num: '89%', label: 'Taxa de sucesso', icon: '✅' },
  { num: '4.9', label: 'Nota média', icon: '⭐' },
];

const areas = [
  { icon: '📈', title: 'Crescimento', desc: 'Estratégia para escalar receita e expandir mercado' },
  { icon: '💼', title: 'Gestão', desc: 'Otimização de processos e redução de custos' },
  { icon: '👥', title: 'Vendas', desc: 'Aumento de conversão e qualificação de time' },
  { icon: '🔧', title: 'Operações', desc: 'Automação e eficiência operacional' },
  { icon: '🎯', title: 'Marketing', desc: 'Posicionamento e geração de leads' },
  { icon: '💡', title: 'Inovação', desc: 'Novos produtos e modelos de negócio' },
];

const plans = [
  { name: 'Diagnóstico', price: 'R$ 997', period: '一次性', features: ['Análise completa', 'Relatório de oportunidades', 'Plano de ação', '1 chamada de 60min'], highlight: false },
  { name: 'Mentoria', price: 'R$ 2.997', period: 'mensal', features: ['4 chamadas ao mês', 'Acesso ao grupo VIP', 'Planos de ação', 'Suporte por email'], highlight: true },
  { name: 'Consultoria', price: 'Sob consulta', period: '', features: ['Equipe dedicada', 'Projeto completo', 'Implementação', 'Acompanhamento'], highlight: false },
];

export default function ConsultoriaPage() {
  const [form, setForm] = useState({ nome: '', whatsapp: '', segmento: '', email: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, source: 'landing-consultoria' }) });
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
          <a href="#contato" className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 px-6 py-3 rounded-full font-bold text-white transition-colors">
            Falar com Consultor →
          </a>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/10 via-transparent to-[#0284C7]/10"></div>
          <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-[#0EA5E9]/20 rounded-full blur-[150px]"></div>

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 mb-8">
                <span className="w-2 h-2 bg-[#0EA5E9] rounded-full animate-pulse"></span>
                <span className="text-[#0EA5E9] font-bold text-sm">💡 Consultoria Estratégica</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                Faça seu negócio{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]">
                  Decolar
                </span>
              </h1>
              
              <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                <strong className="text-white">152 empresas</strong> já aumentaram faturamento com nossa ajuda. <strong>Seu negócio pode ser o próximo.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a href="#contato" className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white px-10 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3 transition-all hover:scale-105">
                  Quero Crescer
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                {results.map((r, i) => (
                  <div key={i} className="bg-[#0A0A0A] rounded-xl p-4 border border-[#0EA5E9]/20">
                    <p className="text-3xl font-black text-[#0EA5E9]">{r.num}</p>
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
                Areas de <span className="text-[#0EA5E9]">atuação</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areas.map((a, i) => (
                <div key={i} className="bg-[#050505] rounded-2xl p-7 border border-white/5 hover:border-[#0EA5E9]/40 transition-all hover:-translate-y-1">
                  <div className="text-4xl mb-4">{a.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{a.title}</h3>
                  <p className="text-gray-400">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Escolha seu <span className="text-[#0EA5E9]">formato</span></h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((p, i) => (
                <div key={i} className={`relative bg-[#0A0A0A] rounded-3xl p-8 border ${p.highlight ? 'border-[#0EA5E9]' : 'border-white/10'} ${p.highlight ? 'scale-105' : ''}`}>
                  {p.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0EA5E9] px-4 py-1 rounded-full text-sm font-bold">Mais Escolhido</div>}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                    <p className="text-3xl font-black text-[#0EA5E9]">{p.price}</p>
                    {p.period && <p className="text-gray-500 text-sm">{p.period}</p>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-gray-300">
                        <svg className="w-5 h-5 text-[#0EA5E9]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#contato" className={`block w-full py-4 rounded-xl font-bold text-center transition-all ${p.highlight ? 'bg-[#0EA5E9] text-white hover:opacity-90' : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#252525]'}`}>
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
                <h2 className="text-4xl font-bold mb-6">Vamos transformar seu <span className="text-[#0EA5E9]">negócio?</span></h2>
                <p className="text-xl text-gray-400 mb-8">Agende uma conversa estratégica.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#0EA5E9]/20 flex items-center justify-center text-2xl">🎯</div><div><p className="font-bold">Resultado garantido</p><p className="text-sm text-gray-400">Metas claras</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#0284C7]/20 flex items-center justify-center text-2xl">⚡</div><div><p className="font-bold">Agilidade</p><p className="text-sm text-gray-400">Implementação rapida</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">🏆</div><div><p className="font-bold">Experiência</p><p className="text-sm text-gray-400">150+ empresas atendidas</p></div></div>
                </div>
              </div>
              <div className="bg-[#050505] rounded-2xl p-8 border border-white/10">
                {enviado ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                    <h3 className="text-2xl font-bold">Contato agendado!</h3>
                    <p className="text-gray-400">Retornamos em breve.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-2xl font-bold mb-6">Agendar Consultoria</h3>
                    <input type="text" required placeholder="Seu nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#0EA5E9] focus:outline-none" />
                    <input type="email" required placeholder="Seu email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#0EA5E9] focus:outline-none" />
                    <input type="tel" required placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#0EA5E9] focus:outline-none" />
                    <select required value={form.segmento} onChange={e => setForm({...form, segmento: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:border-[#0EA5E9] focus:outline-none">
                      <option value="">Faturamento mensal?</option>
                      <option value="ate10">Até R$ 10mil</option>
                      <option value="10a50">R$ 10mil a R$ 50mil</option>
                      <option value="50a100">R$ 50mil a R$ 100mil</option>
                      <option value="100+">R$ 100mil+</option>
                    </select>
                    <button type="submit" disabled={enviando} className="w-full py-4 bg-[#0EA5E9] rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      {enviando ? 'Enviando...' : 'Agendar Consulta →'}
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