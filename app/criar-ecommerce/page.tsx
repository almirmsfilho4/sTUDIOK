'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const proofs = [
  { num: 'R$ 47mil', label: 'Faturamento médio mensal', icon: '💰' },
  { num: '312', label: 'Lojas criadas', icon: '🛒' },
  { num: '89%', label: 'Taxa de conversão média', icon: '📈' },
  { num: '24h', label: 'Loja no ar', icon: '⚡' },
];

const features = [
  { icon: '🛍️', title: 'Catálogo Ilimitado', desc: 'Cadastre quantos produtos quiser. Sem limites de estoque ou categorias.' },
  { icon: '💳', title: 'Pagamentos Automaticos', desc: 'PIX, cartão, boleto. Tudo via Mercado Pago. Dinheiro cai direto na sua conta.' },
  { icon: '🚚', title: 'Frete Automático', desc: 'Calcule fretes dos Correios e transportadoras automaticamente.' },
  { icon: '📱', title: 'Painel Completo', desc: 'Gerencie pedidos, produtos, clientes e financeiro em um só lugar.' },
  { icon: '🔔', title: 'Notificações Push', desc: 'Avise clientes sobre promoções e novos produtos pelo WhatsApp.' },
  { icon: '🎯', title: 'SEO Otimizado', desc: 'Sua loja indexada no Google. Clientes te acham sozinho.' },
];

const testimonials = [
  { name: 'Juliana Martins', result: '+180% nas vendas', text: 'Em 3 meses faturo mais do que minha loja física. Não aguento mais pedidos!', avatar: 'JM' },
  { name: 'Ricardo Souza', result: 'R$ 15mil/mês', text: 'Comecei do zero. A loja pagou ela mesma em 2 meses. Melhor investimento que fiz.', avatar: 'RS' },
  { name: 'Carla Oliveira', result: '320 pedidos/mês', text: 'Simplesmente espetacular. Entregam em 24h, nunca mais perdi venda por falta de estoque.', avatar: 'CO' },
];

export default function CriarEcommercePage() {
  const [form, setForm] = useState({ nome: '', whatsapp: '', segmento: '', email: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 900), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, source: 'landing-criar-ecommerce' }) });
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
          <a href="#contato" className="bg-[#FF006E] hover:bg-[#FF006E]/90 px-6 py-3 rounded-full font-bold text-white transition-colors">
            Criar Minha Loja →
          </a>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF006E]/10 via-transparent to-[#7B2CBF]/10"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF006E]/20 rounded-full blur-[150px]"></div>
          
          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF006E]/20 border border-[#FF006E]/40 mb-8">
                <span className="w-2 h-2 bg-[#FF006E] rounded-full animate-pulse"></span>
                <span className="text-[#FF006E] font-bold text-sm">🔥 Oferta por tempo limitado</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                Sua Loja Virtual{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF006E] to-[#FF4D94]">
                  Vendendo 24/7
                </span>
              </h1>
              
              <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Pare de perder clientes por não ter loja online. <strong className="text-white">Em 24h</strong> sua loja está no ar vendendo para o Brasil inteiro.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a href="#contato" className="bg-[#FF006E] hover:bg-[#FF006E]/90 text-white px-10 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3 transition-all hover:scale-105">
                  Criar Loja Agora
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                {proofs.map((p, i) => (
                  <div key={i} className="bg-[#0A0A0A]/80 backdrop-blur rounded-2xl p-5 border border-white/10">
                    <div className="text-3xl mb-2">{p.icon}</div>
                    <p className="text-2xl font-black text-white">{p.num}</p>
                    <p className="text-xs text-gray-400">{p.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                O que sua <span className="text-[#FF006E]">loja</span> vai ter?
              </h2>
              <p className="text-xl text-gray-400">Tudo que você precisa para vender muito online</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div key={i} className="bg-[#050505] rounded-2xl p-6 border border-white/5 hover:border-[#FF006E]/30 transition-all group">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF006E] transition-colors">{f.title}</h3>
                  <p className="text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  <span className="text-[#FF006E]">Esqueça</span> as taxas abusivas
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                  Lojas em marketplaces cobram comissão em CADA venda. Com sua própria loja, VOCÊdefine suas regras.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <span className="text-2xl">🏪</span>
                    <div>
                      <p className="font-bold text-red-400">Marketplace</p>
                      <p className="text-gray-400">15-20% de comissão por venda</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <span className="text-2xl">🛒</span>
                    <div>
                      <p className="font-bold text-green-400">Sua Loja Virtual</p>
                      <p className="text-gray-400">Sem commission. 100% seu.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#0A0A0A] rounded-2xl p-8 border border-white/10">
                <div className="text-center mb-8">
                  <p className="text-gray-400 mb-2">De</p>
                  <p className="text-3xl line-through text-gray-500">R$ 2.497</p>
                  <p className="text-6xl font-black text-[#FF006E]">R$ 797</p>
                  <p className="text-gray-400">Pagamento único</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Loja completa', 'Domínio próprio', 'SSL Grátis', 'Treinamento incluso', 'Suporte prioritário'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contato" className="block w-full bg-[#FF006E] hover:bg-[#FF006E]/90 text-white py-4 rounded-xl font-bold text-center">
                  Quero Minha Loja →
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Resultados <span className="text-[#FF006E]">reais</span> de clientes</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#FF006E] to-[#7B2CBF] flex items-center justify-center font-bold text-white">{t.avatar}</div>
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-[#FF006E] font-bold text-sm">{t.result}</p>
                    </div>
                  </div>
                  <p className="text-gray-400">"{t.text}"</p>
                  <div className="flex gap-1 mt-4">{[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A] border-y border-[#FF006E]/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/20 rounded-full border border-red-500/40 mb-8">
              <svg className="w-5 h-5 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
              <span className="text-red-400 font-bold">⚠️ Esta oferta expira em {formatTime(timeLeft)}</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Não espere mais</h2>
            <p className="text-xl text-gray-400 mb-8">Cada dia sem loja virtual é dinheiro que você está perdendo. Seus concorrentes já estão online.</p>
            <a href="#contato" className="bg-[#FF006E] hover:bg-[#FF006E]/90 text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3">
              Criar Minha Loja Agora
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </section>

        <section className="py-20 bg-[#050505]" id="contato">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl font-bold mb-6">Vamos <span className="text-[#FF006E]">declar guerra</span> às suas vendas?</h2>
                <p className="text-xl text-gray-400 mb-8">Preencha e vamos putsar sua loja em 24h.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#FF006E]/20 flex items-center justify-center">⚡</div><div><p className="font-bold">Loja no ar em 24h</p><p className="text-sm text-gray-400">Pronto para vender</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-xl"><div className="w-12 h-12 rounded-xl bg-[#7B2CBF]/20 flex items-center justify-center">💰</div><div><p className="font-bold">Sem mensalidade</p><p className="text-sm text-gray-400">Pague uma vez, use pra sempre</p></div></div>
                  <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-xl"><div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">🎯</div><div><p className="font-bold">Suporte VIP</p><p className="text-sm text-gray-400">Te ajudamos em tudo</p></div></div>
                </div>
              </div>
              <div className="bg-[#0A0A0A] rounded-2xl p-8 border border-white/10">
                {enviado ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                    <h3 className="text-2xl font-bold">Pronto! Vamos lá!</h3>
                    <p className="text-gray-400">Em breve entramos em contato.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-2xl font-bold mb-6">Criar Minha Loja</h3>
                    <input type="text" required placeholder="Seu nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none" />
                    <input type="email" required placeholder="Seu email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none" />
                    <input type="tel" required placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none" />
                    <select required value={form.segmento} onChange={e => setForm({...form, segmento: e.target.value})} className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#FF006E] focus:outline-none">
                      <option value="">O que você vende?</option>
                      <option value="roupas">Roupas/Acessórios</option>
                      <option value="beleza">Beleza/Cosméticos</option>
                      <option value="comida">Alimentação</option>
                      <option value="eletronicos">Eletrônicos</option>
                      <option value="outro">Outro</option>
                    </select>
                    <button type="submit" disabled={enviando} className="w-full py-4 bg-[#FF006E] rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      {enviando ? 'Enviando...' : 'Criar Minha Loja →'}
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