'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

const benefits = [
{ icon: 'shopping-cart', title: 'Loja Online Completa', desc: 'Catálogo de produtos, carrinho, checkout. Tudo que uma loja precisa.' },
{ icon: 'credit-card', title: 'Pagamentos Online', desc: 'Aceita Pix, cartão, boleto. Receba de qualquer lugar.' },
{ icon: 'smartphone', title: 'Funciona no Celular', desc: 'Design responsivo. Clientes compram pelo celular facilmente.' },
{ icon: 'chart', title: 'Gestão de Estoque', desc: 'Controle produtos, pedidos e clientes em um só lugar.' },
];

const features = [
{ icon: 'shopping-cart', title: 'Catálogo de Produtos', desc: 'Liste todos os produtos com fotos, valores, variações.' },
{ icon: 'credit-card', title: 'Pagamentos Online', desc: 'Pix, cartão, boleto. integração com principais gateways.' },
{ icon: 'truck', title: 'Frete Automático', desc: 'Calculo de frete automático. Cliente escolhe a entrega.' },
{ icon: 'chart', title: 'Dashboard de Vendas', desc: 'Acompanhe vendas, produtos mais vendidos, clientes.' },
{ icon: 'package', title: 'Gestão de Estoque', desc: 'Controle de estoque automatico. Alerta de reposição.' },
{ icon: 'mail', title: 'E-mails Automáticos', desc: 'Confirmação de pedido, status de entrega. Automático.' },
];

const socialProof = [
{ number: '200+', label: 'Lojas Criadas' },
{ number: '95%', label: 'Clientes Satisfeitos' },
{ number: 'R$5M+', label: 'Em Vendas Online' },
{ number: '50K+', label: 'Produtos Vendidos' },
];

const howItWorks = [
{ step: '1', title: 'Briefing', desc: 'Você envia os produtos e fotos.' },
{ step: '2', title: 'Criamos', desc: 'Em até 10 dias sua loja fica pronta.' },
{ step: '3', title: 'Você Aprova', desc: 'Revisamos juntos e ajustamos o que precisar.' },
{ step: '4', title: 'No Ar!', desc: 'Pronto para vender!' },
];

const testimonials = [
{ name: 'Lucas Mendes', role: 'Loja de Roupas', text: 'Em 60 dias vendemos R$15mil. O melhor investimento que fiz.', avatar: 'LM', rating: 5 },
{ name: 'Carla Souza', role: 'Cosméticos Natura', text: 'Minha loja funciona 24h. Acordo com pedidos todos os dias.', avatar: 'CS', rating: 5 },
{ name: 'Pedro Santos', role: 'Acessórios', text: 'Super recomendo! Interface linda e fácil de gerenciar.', avatar: 'PS', rating: 5 },
];

const faq = [
{ q: 'Quanto tempo leva para criar a loja?', a: 'Em até 10 dias úteis sua loja estará no ar.' },
{ q: 'Quais formas de pagamento aceita?', a: 'Pix, cartão de crédito, cartão de débito e boleto.' },
{ q: 'Preciso ter produtos físicos?', a: 'Não! Também funciona para vender produtos digitais.' },
{ q: 'Tem mensalidade?', a: 'Não! Pagamento único. Sua loja é sua para sempre.' },
];

export default function SiteEcommercePage() {
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
<div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#F59E0B]/30 py-3 px-4">
<div className="max-w-7xl mx-auto flex items-center justify-between">
<p className="text-white font-semibold hidden md:block">Pronto para vender mais?</p>
<Link href="/orcamento?segmento=ecommerce" className="bg-[#F59E0B] hover:opacity-90 text-black px-6 py-2.5 rounded-full font-bold text-sm inline-flex items-center gap-2">
Criar Loja Agora <PremiumIcon name="arrow-right" size={16} />
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
<Link href="/orcamento?segmento=ecommerce" className="bg-[#F59E0B] hover:opacity-90 px-5 py-2.5 rounded-full font-bold text-black text-sm">
Solicitar Orçamento
</Link>
</div>
</div>
</nav>

<main className="pt-20">
<section className="py-20 lg:py-32 relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/10 to-transparent" />
<div className="absolute top-40 right-0 w-[600px] h-[600px] bg-[#F59E0B]/15 rounded-full blur-[180px]" />

<div className="max-w-7xl mx-auto px-4 relative">
<div className="grid lg:grid-cols-2 gap-12 items-center">
<div>
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/30 mb-6">
<PremiumIcon name="shopping-cart" size={16} className="text-[#F59E0B]" />
<span className="text-[#F59E0B] font-semibold text-sm">Especialista em E-commerce</span>
</div>

<h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
Sua Loja Virtual{' '}
<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]">
Vendendo 24h por Dia
</span>
</h1>

<p className="text-lg text-gray-300 mb-8 max-w-xl">
Loja online completa com pagamentos, frete e gestão de estoque. 
Venda para todo o Brasil sem sair de casa.
</p>

<div className="flex flex-col sm:flex-row gap-4 mb-8">
<Link href="/orcamento?segmento=ecommerce" className="bg-[#F59E0B] hover:opacity-90 text-black px-8 py-4 rounded-full font-bold text-lg inline-flex items-center justify-center gap-2">
Criar Loja Agora
<PremiumIcon name="arrow-right" size={20} />
</Link>
<Link href="#precos" className="border border-white/20 hover:border-[#F59E0B] text-white px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center gap-2 transition">
Ver Preços
</Link>
</div>

<div className="flex items-center gap-6 text-sm text-gray-400">
<div className="flex items-center gap-2">
<PremiumIcon name="check" size={16} className="text-[#F59E0B]" />
<span>10 dias no ar</span>
</div>
<div className="flex items-center gap-2">
<PremiumIcon name="check" size={16} className="text-[#F59E0B]" />
<span>Domínio Grátis</span>
</div>
<div className="flex items-center gap-2">
<PremiumIcon name="check" size={16} className="text-[#F59E0B]" />
<span>Pagamento único</span>
</div>
</div>
</div>

<div className="relative hidden lg:block">
<div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10 relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/20 rounded-full blur-3xl" />
<div className="relative space-y-4">
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
<PremiumIcon name="shopping-cart" size={24} className="text-[#F59E0B]" />
</div>
<div>
<div className="font-bold text-white">Camiseta Premium</div>
<div className="text-sm text-gray-400">R$ 89,90 • Estoque: 50</div>
</div>
</div>
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
<PremiumIcon name="credit-card" size={24} className="text-green-500" />
</div>
<div>
<div className="font-bold text-white">Nova venda!</div>
<div className="text-sm text-gray-400">Pagamento confirmado</div>
</div>
</div>
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
<PremiumIcon name="trending-up" size={24} className="text-[#F59E0B]" />
</div>
<div>
<div className="font-bold text-white">Venda concretizada!</div>
<div className="text-sm text-gray-400">R$ 259,70 em vendas hoje</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="py-8 bg-[#0A0A0A] lg:hidden">
<div className="max-w-7xl mx-auto px-4">
<div className="bg-[#050505] rounded-2xl p-4 border border-white/10">
<div className="flex items-center justify-between">
<span className="text-gray-400 text-sm">Visualização Mobile</span>
<PremiumIcon name="smartphone" size={20} className="text-[#F59E0B]" />
</div>
<div className="mt-3 bg-[#0A0A0A] rounded-xl p-3 border border-white/5">
<div className="h-4 w-20 bg-[#F59E0B]/30 rounded mb-2"></div>
<div className="h-3 w-full bg-white/10 rounded mb-1"></div>
<div className="h-3 w-3/4 bg-white/10 rounded"></div>
</div>
</div>
</div>
</section>

<section className="py-20 bg-[#0A0A0A]">
<div className="max-w-7xl mx-auto px-4">
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
{socialProof.map((item, i) => (
<div key={i} className="text-center p-6">
<div className="text-3xl md:text-4xl font-black text-[#F59E0B] mb-2">{item.number}</div>
<div className="text-gray-400">{item.label}</div>
</div>
))}
</div>
</div>
</section>

<section className="py-20 bg-[#050505]">
<div className="max-w-7xl mx-auto px-4">
<div className="text-center mb-12">
<h2 className="text-3xl md:text-4xl font-bold mb-4">Como Funciona</h2>
<p className="text-gray-400 max-w-2xl mx-auto">Processo simples e sem complicação.</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
{howItWorks.map((item, i) => (
<div key={i} className="text-center relative">
{i < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#F59E0B]/50 to-transparent" />}
<div className="w-16 h-16 rounded-full bg-[#F59E0B]/20 border-2 border-[#F59E0B] flex items-center justify-center mx-auto mb-4">
<span className="text-2xl font-black text-[#F59E0B]">{item.step}</span>
</div>
<h3 className="text-xl font-bold mb-2">{item.title}</h3>
<p className="text-gray-400 text-sm">{item.desc}</p>
</div>
))}
</div>
</div>
</section>

<section className="py-20 bg-[#0A0A0A]">
<div className="max-w-7xl mx-auto px-4">
<div className="text-center mb-12">
<h2 className="text-3xl md:text-4xl font-bold mb-4">Por Que Ter Uma Loja Virtual?</h2>
<p className="text-gray-400 max-w-2xl mx-auto">E-commerce crece a cada dia. Esteja onde seus clientes compram.</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
{benefits.map((b, i) => (
<div key={i} className="bg-[#050505] rounded-2xl p-6 border border-white/5 hover:border-[#F59E0B]/30 transition-all group">
<div className="w-14 h-14 rounded-2xl bg-[#F59E0B]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
<PremiumIcon name={b.icon as any} size={28} className="text-[#F59E0B]" />
</div>
<h3 className="text-xl font-bold mb-2">{b.title}</h3>
<p className="text-gray-400 text-sm">{b.desc}</p>
</div>
))}
</div>
</div>
</section>

<section className="py-20 bg-[#050505]">
<div className="max-w-7xl mx-auto px-4">
<div className="text-center mb-12">
<h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo Que Sua Loja Precisa</h2>
<p className="text-gray-400 max-w-2xl mx-auto">Recursos completos para vender online.</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
{features.map((f, i) => (
<div key={i} className="bg-[#0A0A0A] rounded-2xl p-7 border border-white/5 hover:border-[#F59E0B]/40 transition-all">
<PremiumIcon name={f.icon as any} size={32} className="text-[#F59E0B] mb-4" />
<h3 className="text-xl font-bold mb-2">{f.title}</h3>
<p className="text-gray-400">{f.desc}</p>
</div>
))}
</div>
</div>
</section>

<section className="py-20 bg-[#0A0A0A]">
<div className="max-w-7xl mx-auto px-4">
<div className="text-center mb-12">
<h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
</div>

<div className="grid md:grid-cols-3 gap-6">
{testimonials.map((t, i) => (
<div key={i} className="bg-[#050505] rounded-2xl p-6 border border-white/5">
<div className="flex items-center gap-3 mb-4">
<div className="w-12 h-12 rounded-full bg-[#F59E0B]/20 flex items-center justify-center font-bold text-[#F59E0B]">
{t.avatar}
</div>
<div>
<div className="font-bold">{t.name}</div>
<div className="text-sm text-gray-400">{t.role}</div>
</div>
</div>
<div className="flex gap-1 mb-3">
{[...Array(t.rating)].map((_, i) => (
<PremiumIcon key={i} name="star" size={16} className="text-yellow-500" />
))}
</div>
<p className="text-gray-300">"{t.text}"</p>
</div>
))}
</div>
</div>
</section>

<section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#050505]" id="precos">
<div className="max-w-4xl mx-auto px-4">
<div className="bg-[#0A0A0A] rounded-3xl p-8 md:p-12 border border-[#F59E0B]/30 relative overflow-hidden">
<div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl" />

<div className="relative text-center mb-8">
<span className="inline-block px-4 py-1.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] font-semibold text-sm mb-4">Melhor Custo-Benefício</span>
<h2 className="text-3xl md:text-4xl font-bold mb-2">Loja Virtual Completa</h2>
<p className="text-gray-400">Tudo que você precisa para vender online</p>
</div>

<div className="text-center mb-8">
<p className="text-5xl font-black text-[#F59E0B] mb-2">R$ 997</p>
<p className="text-gray-400 mb-2">Pagamento único. Sua para sempre.</p>
<p className="text-sm text-gray-500">Sem mensalidade. Sem surpresas.</p>
</div>

<ul className="space-y-3 mb-8 max-w-md mx-auto">
{['Domínio próprio (.com.br)', 'Hospedagem SSL Grátis', 'Produtos Ilimitados', 'Pagamentos Online', 'Frete Automático', 'Gestão de Estoque', 'E-mails Automáticos'].map((item, i) => (
<li key={i} className="flex items-center gap-3 text-gray-300">
<PremiumIcon name="check" size={20} className="text-green-500" />
<span>{item}</span>
</li>
))}
</ul>

<Link href="/orcamento?segmento=ecommerce" className="block w-full bg-[#F59E0B] hover:opacity-90 text-black py-5 rounded-full font-bold text-xl text-center">
Quero Criar Minha Loja →
</Link>

<p className="text-center text-gray-500 text-sm mt-4">7 dias de garantia. Satisfação ou dinheiro de volta.</p>
</div>
</div>
</section>

<section className="py-20 bg-[#050505]">
<div className="max-w-3xl mx-auto px-4">
<div className="text-center mb-12">
<h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
</div>

<div className="space-y-4">
{faq.map((item, i) => (
<div key={i} className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/5">
<h3 className="font-bold text-lg mb-2">{item.q}</h3>
<p className="text-gray-400">{item.a}</p>
</div>
))}
</div>
</div>
</section>

<section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
<div className="max-w-4xl mx-auto px-4 text-center">
<h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto Para Criar Sua Loja?</h2>
<p className="text-gray-300 mb-8 max-w-2xl mx-auto">Não deixe seus concorrentes te ultrapassarem. Tenha sua loja virtual hoje mesmo.</p>
<Link href="/orcamento?segmento=ecommerce" className="bg-[#F59E0B] hover:opacity-90 text-black px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3">
Solicitar Orçamento Grátis
<PremiumIcon name="arrow-right" size={20} />
</Link>
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