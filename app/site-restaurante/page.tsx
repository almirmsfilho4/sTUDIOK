'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

const benefits = [
{ icon: 'phone', title: 'Pedidos pelo WhatsApp', desc: 'Cliente faz pedido direto pelo site. Receba no seu WhatsApp sem complicação.' },
{ icon: 'restaurant', title: 'Cardápio Digital', desc: 'Cardápio online bonito e fácil de navegar. Clientes pedem pelo celular.' },
{ icon: 'map-pin', title: 'Aparece no Google', desc: 'Seu restaurante aparece nas buscas. Novos clientes te encontram.' },
{ icon: 'dollar', title: 'Sem Comissão', desc: 'Cada pedido é seu. Não paga taxa por cada venda.' },
];

const features = [
{ icon: 'restaurant', title: 'Cardápio Digital', desc: 'Cardápio online bonito e fácil de navegar. Clientes pedem pelo celular.' },
{ icon: 'phone', title: 'Pedidos pelo WhatsApp', desc: 'Cliente faz pedido e recebe no WhatsApp. Sem app, sem complicação.' },
{ icon: 'image', title: 'Galeria de Pratos', desc: 'Fotos profissionais dos seus pratos. Clientes querem pedir tudo.' },
{ icon: 'map-pin', title: 'Localização no Mapa', desc: 'Cliente encontra seu restaurante no Google Maps facilmente.' },
{ icon: 'star', title: 'Avaliações Google', desc: 'Colete e exiba avaliações. Novo cliente confia mais.' },
{ icon: 'trending-up', title: 'Funciona 24h', desc: 'Seu restaurante nunca fecha. Pedidos a qualquer hora.' },
];

const socialProof = [
{ number: '400+', label: 'Restaurantes Atendidos' },
{ number: '95%', label: 'Clientes Satisfeitos' },
{ number: '100K+', label: 'Pedidos Recebidos' },
{ number: 'R$2M+', label: 'Vendas Geradas' },
];

const howItWorks = [
{ step: '1', title: 'Briefing', desc: 'Você envia o cardápio e fotos dos pratos.' },
{ step: '2', title: 'Criamos', desc: 'Em até 5 dias seu site fica pronto.' },
{ step: '3', title: 'Você Aprova', desc: 'Revisamos juntos e ajustamos o que precisar.' },
{ step: '4', title: 'No Ar!', desc: 'Pronto para receber pedidos!' },
];

const testimonials = [
{ name: 'Chef Roberto', role: 'Restaurante Sabor caseiro', text: 'Aumentamos 40% dos pedidos após criar o site. Clientes amam a facilidade.', avatar: 'CR', rating: 5 },
{ name: 'Dona Maria', role: 'Pizzaria Napoli', text: 'Simplesmente perfeito! Agora recebo pedidos até de madrugada.', avatar: 'DM', rating: 5 },
{ name: 'João Silva', role: 'Hamburgueria Top', text: 'O melhor investimento que fiz. Retorno em 1 semana.', avatar: 'JS', rating: 5 },
];

const faq = [
{ q: 'Quanto tempo leva para criar o site?', a: 'Em até 7 dias úteis seu site estará no ar. Briefing em 24h.' },
{ q: 'O site inclui domínio e hospedagem?', a: 'Sim! Primeiro ano de domínio e hospedagem gratuitos.' },
{ q: 'Como recebo os pedidos?', a: 'Os pedidos chegam direto no seu WhatsApp. Sem necessidade de sistema.' },
{ q: 'O site aparece no Google?', a: 'Sim! Otimizamos para SEO local. Seus clientes te encontram na busca.' },
];

export default function SiteRestaurantePage() {
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
<div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#FF6B35]/30 py-3 px-4">
<div className="max-w-7xl mx-auto flex items-center justify-between">
<p className="text-white font-semibold hidden md:block">Pronto para receber mais pedidos?</p>
<Link href="/orcamento?segmento=restaurante" className="bg-[#FF6B35] hover:opacity-90 text-white px-6 py-2.5 rounded-full font-bold text-sm inline-flex items-center gap-2">
Criar Site Agora <PremiumIcon name="arrow-right" size={16} />
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
<Link href="/orcamento?segmento=restaurante" className="bg-[#FF6B35] hover:opacity-90 px-5 py-2.5 rounded-full font-bold text-white text-sm">
Solicitar Orçamento
</Link>
</div>
</div>
</nav>

<main className="pt-20">
<section className="py-20 lg:py-32 relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/10 to-transparent" />
<div className="absolute top-40 right-0 w-[600px] h-[600px] bg-[#FF6B35]/15 rounded-full blur-[180px]" />

<div className="max-w-7xl mx-auto px-4 relative">
<div className="grid lg:grid-cols-2 gap-12 items-center">
<div>
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B35]/20 border border-[#FF6B35]/30 mb-6">
<PremiumIcon name="restaurant" size={16} className="text-[#FF6B35]" />
<span className="text-[#FF6B35] font-semibold text-sm">Especialista em Restaurantes</span>
</div>

<h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
Seu Restaurante{' '}
<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A]">
Vendendo 24h por Dia
</span>
</h1>

<p className="text-lg text-gray-300 mb-8 max-w-xl">
Cardápio digital + pedidos pelo WhatsApp. 
Clientes fazem pedidos a qualquer hora, sem precisar baixar app.
</p>

<div className="flex flex-col sm:flex-row gap-4 mb-8">
<Link href="/orcamento?segmento=restaurante" className="bg-[#FF6B35] hover:opacity-90 text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center justify-center gap-2">
Criar Site Agora
<PremiumIcon name="arrow-right" size={20} />
</Link>
<Link href="#precos" className="border border-white/20 hover:border-[#FF6B35] text-white px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center gap-2 transition">
Ver Preços
</Link>
</div>

<div className="flex items-center gap-6 text-sm text-gray-400">
<div className="flex items-center gap-2">
<PremiumIcon name="check" size={16} className="text-[#FF6B35]" />
<span>7 dias no ar</span>
</div>
<div className="flex items-center gap-2">
<PremiumIcon name="check" size={16} className="text-[#FF6B35]" />
<span>Domínio Grátis</span>
</div>
<div className="flex items-center gap-2">
<PremiumIcon name="check" size={16} className="text-[#FF6B35]" />
<span>Sem Comissão</span>
</div>
</div>
</div>

<div className="relative hidden lg:block">
<div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10 relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B35]/20 rounded-full blur-3xl" />
<div className="relative space-y-4">
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
<PremiumIcon name="restaurant" size={24} className="text-[#FF6B35]" />
</div>
<div>
<div className="font-bold text-white">Picanha na Brasa</div>
<div className="text-sm text-gray-400">R$ 89,90 • Serve 2</div>
</div>
</div>
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
<PremiumIcon name="phone" size={24} className="text-green-500" />
</div>
<div>
<div className="font-bold text-white">Novo pedido!</div>
<div className="text-sm text-gray-400">Chegou agora mesmo</div>
</div>
</div>
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
<PremiumIcon name="star" size={24} className="text-[#FF6B35]" />
</div>
<div>
<div className="font-bold text-white">5 estrelas!</div>
<div className="text-sm text-gray-400">Nova avaliação no Google</div>
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
<PremiumIcon name="smartphone" size={20} className="text-[#FF6B35]" />
</div>
<div className="mt-3 bg-[#0A0A0A] rounded-xl p-3 border border-white/5">
<div className="h-4 w-20 bg-[#FF6B35]/30 rounded mb-2"></div>
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
<div className="text-3xl md:text-4xl font-black text-[#FF6B35] mb-2">{item.number}</div>
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
{i < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#FF6B35]/50 to-transparent" />}
<div className="w-16 h-16 rounded-full bg-[#FF6B35]/20 border-2 border-[#FF6B35] flex items-center justify-center mx-auto mb-4">
<span className="text-2xl font-black text-[#FF6B35]">{item.step}</span>
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
<h2 className="text-3xl md:text-4xl font-bold mb-4">Por Que Ter Um Site?</h2>
<p className="text-gray-400 max-w-2xl mx-auto">Restaurantes com site vendem 3x mais. Esteja onde seus clientes pedem.</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
{benefits.map((b, i) => (
<div key={i} className="bg-[#050505] rounded-2xl p-6 border border-white/5 hover:border-[#FF6B35]/30 transition-all group">
<div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
<PremiumIcon name={b.icon as any} size={28} className="text-[#FF6B35]" />
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
<h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo Que Seu Site Precisa</h2>
<p className="text-gray-400 max-w-2xl mx-auto">Recursos completos para seu restaurante.</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
{features.map((f, i) => (
<div key={i} className="bg-[#0A0A0A] rounded-2xl p-7 border border-white/5 hover:border-[#FF6B35]/40 transition-all">
<PremiumIcon name={f.icon as any} size={32} className="text-[#FF6B35] mb-4" />
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
<div className="w-12 h-12 rounded-full bg-[#FF6B35]/20 flex items-center justify-center font-bold text-[#FF6B35]">
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
<div className="bg-[#0A0A0A] rounded-3xl p-8 md:p-12 border border-[#FF6B35]/30 relative overflow-hidden">
<div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B35]/10 rounded-full blur-3xl" />

<div className="relative text-center mb-8">
<span className="inline-block px-4 py-1.5 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] font-semibold text-sm mb-4">Melhor Custo-Benefício</span>
<h2 className="text-3xl md:text-4xl font-bold mb-2">Site para Restaurante</h2>
<p className="text-gray-400">Cardápio digital que vende sozinho</p>
</div>

<div className="text-center mb-8">
<p className="text-5xl font-black text-[#FF6B35] mb-2">R$ 497</p>
<p className="text-gray-400 mb-2">Pagamento único. Seu para sempre.</p>
<p className="text-sm text-gray-500">Sem mensalidade. Sem comissão.</p>
</div>

<ul className="space-y-3 mb-8 max-w-md mx-auto">
{['Domínio próprio (.com.br)', 'Hospedagem SSL Grátis', 'Cardápio Digital', 'Pedidos via WhatsApp', 'Galeria de Pratos', 'Otimização SEO', 'Painel Admin'].map((item, i) => (
<li key={i} className="flex items-center gap-3 text-gray-300">
<PremiumIcon name="check" size={20} className="text-green-500" />
<span>{item}</span>
</li>
))}
</ul>

<Link href="/orcamento?segmento=restaurante" className="block w-full bg-[#FF6B35] hover:opacity-90 text-white py-5 rounded-full font-bold text-xl text-center">
Quero Criar Meu Site →
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
<h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto Para Aumentar suas Vendas?</h2>
<p className="text-gray-300 mb-8 max-w-2xl mx-auto">Não deixe seus concorrentes te ultrapassarem. Tenha um site profissional hoje mesmo.</p>
<Link href="/orcamento?segmento=restaurante" className="bg-[#FF6B35] hover:opacity-90 text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3">
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