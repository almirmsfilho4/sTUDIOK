'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const stats = [
  { num: '3h', label: 'Tempo médio no celular', icon: '⏰' },
  { num: '85%', label: 'Preferem apps a sites', icon: '📱' },
  { num: '2x', label: 'Mais conversão em apps', icon: '💰' },
  { num: '24/7', label: 'Presença constante', icon: '🎯' },
];

const features = [
  { icon: '🔔', title: 'Notificações Push', desc: 'Manda promoções direto pra tela do celular do cliente. Taxa de abertura de 40%.' },
  { icon: '📸', title: 'Câmera Integrada', desc: 'Clientes podem fotografar produtos, fazer pedidos e enviar direto pelo app.' },
  { icon: '🛒', title: 'Carrinho & Checkout', desc: 'Experiência de compra fluida. Pagamento em 1 clique. Menos abandono.' },
  { icon: '📍', title: 'Geolocalização', desc: 'Encontre clientes próximos. Mostre lojas físicas no mapa.' },
  { icon: '🔐', title: 'Login Social', desc: 'Login com Google, Apple ou Facebook. Sem fricção.' },
  { icon: '📊', title: 'Analytics Completo', desc: 'Saiba quem usa, quando usa, o que compram. Dados reais.' },
];

const prices = [
  { name: 'Básico', price: 'R$ 2.997', features: ['App iOS + Android', 'Notificações push', 'Design exclusivo', 'Entrega em 15 dias', 'Suporte 30 dias'], highlight: false },
  { name: 'Pro', price: 'R$ 4.997', features: ['Tudo do Básico', 'Painel admin web', 'Integração API', 'Entrega em 10 dias', 'Suporte 60 dias', 'Treinamento'], highlight: true, popular: true },
  { name: 'Enterprise', price: 'Sob consulta', features: ['App completo', 'Backend personalizado', 'Manutenção mensal', 'Suporte dedicado', 'Desenvolvimento contínuo'], highlight: false },
];

export default function CriarAppPage() {
  const [form, setForm] = useState({ nome: '', whatsapp: '', segmento: '', email: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 3600), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, source: 'landing-criar-app' }) });
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
          <a href="#contato" className="bg-gradient-to-r from-[#8338EC] to-[#FF006E] hover:opacity-90 px-6 py-3 rounded-full font-bold text-white transition-colors">
            Criar Meu App →
          </a>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8338EC]/15 via-transparent to-[#FF006E]/15"></div>
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#8338EC]/30 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF006E]/20 rounded-full blur-[120px]"></div>

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8338EC]/20 border border-[#8338EC]/40 mb-8">
                <span className="w-2 h-2 bg-[#8338EC] rounded-full animate-pulse"></span>
                <span className="text-[#8338EC] font-bold text-sm">📱 Apps nativos para iOS e Android</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                Seu Negócio na{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8338EC] via-[#A855F7] to-[#FF006E]">
                  Palma da Mão
                </span>
              </h1>
              
              <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                <strong className="text-white">3 horas por dia.</strong> É o tempo que seu cliente passa no celular. Esteja lá com seu próprio app.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a href="#contato" className="bg-gradient-to-r from-[#8338EC] to-[#FF006E] hover:opacity-90 text-white px-10 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3 transition-all hover:scale-105">
                  Criar Meu App
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-8">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8338EC] to-[#FF006E]">{s.num}</p>
                    <p className="text-sm text-gray-400">{s.label}</p>
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
                Por que ter um <span className="text-[#8338EC]">App</span>?
              </h2>
              <p className="text-xl text-gray-400">Sites não prendem cliente. Apps sim.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div key={i} className="bg-[#050505] rounded-2xl p-7 border border-white/5 hover:border-[#8338EC]/40 transition-all hover:-translate-y-1">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Invista no <span className="text-[#8338EC]">futuro</span> do seu negócio</h2>
              <p className="text-xl text-gray-400">Planos claros. Sem surpresas. Sem mensalidade.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {prices.map((p, i) => (
                <div key={i} className={`relative bg-[#0A0A0A] rounded-3xl p-8 border ${p.highlight ? 'border-[#8338EC]' : 'border-white/10'} ${p.popular ? 'scale-105' : ''}`}>
                  {p.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8338EC] to-[#FF006E] px-4 py-1 rounded-full text-sm font-bold">Mais Popular</div>}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                    <p className="text-4xl font-black text-[#8338EC]">{p.price}</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-gray-300">
                        <svg className="w-5 h-5 text-[#8338EC]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#contato" className={`block w-full py-4 rounded-xl font-bold text-center transition-all ${p.highlight ? 'bg-gradient-to-r from-[#8338EC] to-[#FF006E] text-white hover:opacity-90' : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#252525]'}`}>
                    Escolher →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#050505]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gradient-to-r from-[#8338EC]/20 via-[#FF006E]/20 to-[#8338EC]/20 rounded-3xl p-12 text-center border border-white/10">
              <h2 className="text-3xl font-bold mb-4">Pronto para ter um app?</h2>
              <p className="text-xl text-gray-400 mb-8">Milhares de empresas já entraram no mobile. Não fique de fora.</p>
              <a href="#contato" className="bg-gradient-to-r from-[#8338EC] to-[#FF006E] hover:opacity-90 text-white px-10 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2">
                Criar Meu App Agora →
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]" id="contato">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-bold mb-6">Vamos criar seu <span className="text-[#8338EC]">app?</span></h2>
                <p className="text-xl text-gray-400 mb-8">conte-nos sobre seu projeto.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#8338EC]/20 flex items-center justify-center text-2xl">📱</div><div><p className="font-bold">iOS + Android</p><p className="text-sm text-gray-400">Um app para as duas plataformas</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#FF006E]/20 flex items-center justify-center text-2xl">⚡</div><div><p className="font-bold">Entrega rápida</p><p className="text-sm text-gray-400">App pronto em até 15 dias</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl"><div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">🎯</div><div><p className="font-bold">Design profissional</p><p className="text-sm text-gray-400">Feito sob medida para sua marca</p></div></div>
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
                    <h3 className="text-2xl font-bold mb-6">Desenvolver Meu App</h3>
                    <input type="text" required placeholder="Seu nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#8338EC] focus:outline-none" />
                    <input type="email" required placeholder="Seu email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#8338EC] focus:outline-none" />
                    <input type="tel" required placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#8338EC] focus:outline-none" />
                    <select required value={form.segmento} onChange={e => setForm({...form, segmento: e.target.value})} className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white focus:border-[#8338EC] focus:outline-none">
                      <option value="">Tipo de app?</option>
                      <option value="delivery">Delivery</option>
                      <option value="loja">Loja/E-commerce</option>
                      <option value="servicos">Serviços</option>
                      <option value="club">Clube/Assinatura</option>
                      <option value="outro">Outro</option>
                    </select>
                    <button type="submit" disabled={enviando} className="w-full py-4 bg-gradient-to-r from-[#8338EC] to-[#FF006E] rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      {enviando ? 'Enviando...' : 'Desenvolver Meu App →'}
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