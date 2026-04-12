'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const benefits = [
  { icon: '⏱️', title: 'Economize 20h/semana', desc: 'Automação de tarefas repetitivas. O sistema faz o trabalho pesado.' },
  { icon: '💸', title: 'Corte custos', desc: 'Elimine planilhas, ferramentas caras e processos manuais.' },
  { icon: '📊', title: 'Decisões baseadas em dados', desc: 'Relatórios em tempo real. Veja o que funciona e ajuste rápido.' },
  { icon: '👥', title: 'Escalabilidade', desc: 'Cresça sem dor de cabeça. Sistema cresce com seu negócio.' },
  { icon: '🔒', title: 'Dados seguros', desc: 'Cloud seguro com backup automático. Sua informação protegida.' },
  { icon: '🌐', title: 'Acesso Anywhere', desc: 'Trabalhe de qualquer lugar. PC, tablet ou celular.' },
];

const modules = [
  { name: 'Financeiro', desc: 'Contas a pagar/receber, fluxo de caixa, gestão de fornecedores', icon: '💰' },
  { name: 'Estoque', desc: 'Controle de produtos, alertas de reposição, inventário', icon: '📦' },
  { name: 'Vendas/CRM', desc: 'Funil de vendas, histórico de clientes, propostas', icon: '🛒' },
  { name: 'Projetos', desc: 'Gestão de projetos, tarefas, prazos e equipes', icon: '📋' },
  { name: 'RH', desc: 'Funcionários, ponto, folha de pagamento', icon: '👥' },
  { name: 'Relatórios', desc: 'Dashboards, gráficos, exportação de dados', icon: '📈' },
];

export default function SistemaWebPage() {
  const [form, setForm] = useState({ nome: '', whatsapp: '', segmento: '', email: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, source: 'landing-sistema-web' }) });
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
          <a href="#contato" className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 px-6 py-3 rounded-full font-bold text-black transition-colors">
            Criar Sistema →
          </a>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/10 via-transparent to-[#00D4FF]/10"></div>
          <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-[#00D4FF]/20 rounded-full blur-[150px]"></div>

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00D4FF]/20 border border-[#00D4FF]/40 mb-8">
                <span className="w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse"></span>
                <span className="text-[#00D4FF] font-bold text-sm">💻 Sistemas 100% personalizados</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                Auge seu negócio com um{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#00FFE0]">
                  Sistema Sob Medida
                </span>
              </h1>
              
              <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                <strong className="text-white">Pare de trabalhar IN the business.</strong> Comece a trabalhar ON the business. Um sistema que faz Tudo por você.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a href="#contato" className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black px-10 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3 transition-all hover:scale-105">
                  Criar Meu Sistema
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <div className="bg-[#0A0A0A] rounded-xl p-4 border border-[#00D4FF]/20">
                  <p className="text-3xl font-black text-[#00D4FF]">20h</p>
                  <p className="text-sm text-gray-400">Economia semanal</p>
                </div>
                <div className="bg-[#0A0A0A] rounded-xl p-4 border border-[#00D4FF]/20">
                  <p className="text-3xl font-black text-[#00D4FF]">70%</p>
                  <p className="text-sm text-gray-400">Redução de erros</p>
                </div>
                <div className="bg-[#0A0A0A] rounded-xl p-4 border border-[#00D4FF]/20">
                  <p className="text-3xl font-black text-[#00D4FF]">3x</p>
                  <p className="text-sm text-gray-400">Mais produtividade</p>
                </div>
                <div className="bg-[#0A0A0A] rounded-xl p-4 border border-[#00D4FF]/20">
                  <p className="text-3xl font-black text-[#00D4FF]">100%</p>
                  <p className="text-sm text-gray-400">Personalizável</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                O que <span className="text-[#00D4FF]">automatizamos</span>?
              </h2>
              <p className="text-xl text-gray-400">Módulos para todas as áreas do seu negócio</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((m, i) => (
                <div key={i} className="bg-[#050505] rounded-2xl p-6 border border-white/5 hover:border-[#00D4FF]/30 transition-all group">
                  <div className="text-4xl mb-4">{m.icon}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#00D4FF] transition-colors">{m.name}</h3>
                  <p className="text-gray-400">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Por que ter um <span className="text-[#00D4FF]">sistema próprio?</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((b, i) => (
                <div key={i} className="bg-[#0A0A0A] rounded-2xl p-8 border border-white/5 hover:-translate-y-2 transition-all">
                  <div className="text-5xl mb-4">{b.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{b.title}</h3>
                  <p className="text-gray-400 text-lg">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-gradient-to-r from-[#00D4FF]/10 to-[#00FFE0]/10 rounded-3xl p-12 text-center border border-[#00D4FF]/20">
              <h2 className="text-3xl font-bold mb-4">Cansado de sistema caro que não serve?</h2>
              <p className="text-xl text-gray-400 mb-8">Pare de pagar mensalidade por funcionalidades que você não usa. Tenha um sistema feito Exactly do jeito que você precisa.</p>
              <a href="#contato" className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black px-10 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2">
                Falar com especialista →
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]" id="contato">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-bold mb-6">Vamos automatizar seu <span className="text-[#00D4FF]">negócio?</span></h2>
                <p className="text-xl text-gray-400 mb-8">Conta pra gente o que você precisa. Nossa equipe analiza e cria uma proposta.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center text-2xl">💻</div><div><p className="font-bold">100% Personalizado</p><p className="text-sm text-gray-400">Feito Exactamente como você precisa</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#00FFE0]/20 flex items-center justify-center text-2xl">⚡</div><div><p className="font-bold">Entrega rápida</p><p className="text-sm text-gray-400">Sistema operacional em até 30 dias</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">🔒</div><div><p className="font-bold">Seu para sempre</p><p className="text-sm text-gray-400">Sem mensalidade. É seu.</p></div></div>
                </div>
              </div>
              <div className="bg-[#050505] rounded-2xl p-8 border border-white/10">
                {enviado ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                    <h3 className="text-2xl font-bold">Proposta a caminho!</h3>
                    <p className="text-gray-400">Nossa equipe vai te contactar em breve.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-2xl font-bold mb-6">Desenvolver Sistema</h3>
                    <input type="text" required placeholder="Seu nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none" />
                    <input type="email" required placeholder="Seu email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none" />
                    <input type="tel" required placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none" />
                    <select required value={form.segmento} onChange={e => setForm({...form, segmento: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:border-[#00D4FF] focus:outline-none">
                      <option value="">Área principal?</option>
                      <option value="vendas">Vendas/Comercial</option>
                      <option value="financeiro">Financeiro</option>
                      <option value="estoque">Estoque/Logística</option>
                      <option value="rh">RH/Recursos Humanos</option>
                      <option value="produção">Produção/Fábrica</option>
                      <option value="outro">Outro</option>
                    </select>
                    <button type="submit" disabled={enviando} className="w-full py-4 bg-[#00D4FF] rounded-xl font-bold text-lg text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      {enviando ? 'Enviando...' : 'Solicitar Orçamento →'}
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