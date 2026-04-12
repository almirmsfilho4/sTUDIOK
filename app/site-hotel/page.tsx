'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';
import CountdownTimer from '@/components/CountdownTimer';
import PaymentBadges, { SecureBadge, GuaranteeBadge } from '@/components/PaymentBadges';

const benefits = [
{ icon: 'calendar', title: 'Reserva Online', desc: 'Hóspede reserva quarto diretamente pelo site. Sem intermediários.' },
{ icon: 'image', title: 'Galeria de Quartos', desc: 'Fotos profissionais dos quartos. Hóspede escolhe com confiança.' },
{ icon: 'map-pin', title: 'Localização', desc: 'Endereço no mapa. Hóspede encontra fácil.' },
{ icon: 'star', title: 'Avaliações', desc: 'Google Reviews. Novo hóspede confia mais.' },
];

const features = [
{ icon: 'calendar', title: 'Sistema de Reservas', desc: 'Hóspede agenda automaticamente. Sem ligação.' },
{ icon: 'image', title: 'Galeria de Fotos', desc: 'Fotos dos quartos, piscina, área de lazer.' },
{ icon: 'map-pin', title: 'Mapa de Localização', desc: 'Endereço integrado ao Google Maps.' },
{ icon: 'phone', title: 'Contato Direto', desc: 'WhatsApp, formulário. Múltiplas formas.' },
{ icon: 'star', title: 'Avaliações Google', desc: 'Colete e exiba avaliações. Confiança.' },
{ icon: 'trending-up', title: 'Funciona 24h', desc: 'Seu hotel nunca fecha. Reservas a qualquer hora.' },
];

const socialProof = [
{ number: '150+', label: 'Hotéis Atendidos' },
{ number: '95%', label: 'Ocupação Média' },
{ number: '4.8', label: 'Estrelas no Google' },
{ number: '30K+', label: 'Reservas Online' },
];

const howItWorks = [
{ step: '1', title: 'Briefing', desc: 'Você envia informações do hotel.' },
{ step: '2', title: 'Criamos', desc: 'Em até 7 dias seu site fica pronto.' },
{ step: '3', title: 'Você Aprova', desc: 'Revisamos juntos e ajustamos.' },
{ step: '4', title: 'No Ar!', desc: 'Pronto para receber hóspedes!' },
];

const testimonials = [
{ name: 'Roberto Silva', role: 'Hotel Praia', text: 'Aumentamos 70% das reservas após o site. Incrível!', avatar: 'RS', rating: 5 },
{ name: 'Carla Oliveira', role: 'Pousada Serranas', text: 'Hóspedes adoram poder reservar direto. Simples e prático.', avatar: 'CO', rating: 5 },
{ name: 'Marcos Santos', role: 'Resort Verde', text: 'Melhor investimento que fizemos. Recomendo para todos.', avatar: 'MS', rating: 5 },
];

const faq = [
{ q: 'Quanto tempo leva para criar o site?', a: 'Em até 7 dias úteis seu site estará no ar.' },
{ q: 'Como recebo as reservas?', a: 'Chegam por e-mail e WhatsApp automaticamente.' },
{ q: 'Posso alterar valores?', a: 'Sim! Tudo editável pelo painel admin.' },
{ q: 'Aparece no Google?', a: 'Sim! Otimizamos para SEO local.' },
];

export default function SiteHotelPage() {
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
<div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#6366F1]/30 py-3 px-4">
<div className="max-w-7xl mx-auto flex items-center justify-between">
<p className="text-white font-semibold hidden md:block">Promoção por tempo limitado!</p>
<CountdownTimer hours={12} color="#6366F1" />
<Link href="/orcamento?segmento=hotel" className="bg-[#6366F1] hover:opacity-90 text-white px-6 py-2.5 rounded-full font-bold text-sm inline-flex items-center gap-2">
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
<Link href="/orcamento?segmento=hotel" className="bg-[#6366F1] hover:opacity-90 px-5 py-2.5 rounded-full font-bold text-white text-sm">
Solicitar Orçamento
</Link>
</div>
</div>
</nav>

<main className="pt-20">
<section className="py-16 relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 to-transparent" />
<div className="max-w-7xl mx-auto px-4 relative">
<div className="text-center mb-4">
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-bold animate-pulse">
Oferta especial: 50% de desconto por 24h!
</div>
</div>
</div>
</section>

<section className="py-20 lg:py-28 relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 to-transparent" />
<div className="absolute top-40 right-0 w-[600px] h-[600px] bg-[#6366F1]/15 rounded-full blur-[180px]" />

<div className="max-w-7xl mx-auto px-4 relative">
<div className="grid lg:grid-cols-2 gap-12 items-center">
<div>
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366F1]/20 border border-[#6366F1]/30 mb-6">
<PremiumIcon name="home" size={16} className="text-[#6366F1]" />
<span className="text-[#6366F1] font-semibold text-sm">Especialista em Hotéis</span>
</div>

<h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
Seu Hotel com{' '}
<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#818CF8]">
Reservas 24h por Dia
</span>
</h1>

<p className="text-lg text-gray-300 mb-6 max-w-xl">
Sistema de reservas online. 
Hóspede reserva quarto a qualquer hora, sem ligar para a recepção.
</p>

<div className="mb-6">
<CountdownTimer hours={12} color="#6366F1" />
</div>

<div className="flex flex-col sm:flex-row gap-4 mb-8">
<Link href="/orcamento?segmento=hotel" className="bg-[#6366F1] hover:opacity-90 text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center justify-center gap-2">
Criar Site Agora
<PremiumIcon name="arrow-right" size={20} />
</Link>
<Link href="#precos" className="border border-white/20 hover:border-[#6366F1] text-white px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center gap-2 transition">
Ver Preços
</Link>
</div>

<PaymentBadges compact />
<div className="mt-4">
<SecureBadge />
</div>
</div>

<div className="relative hidden lg:block">
<div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10 relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-[#6366F1]/20 rounded-full blur-3xl" />
<div className="relative space-y-4">
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-[#6366F1]/20 flex items-center justify-center">
<PremiumIcon name="calendar" size={24} className="text-[#6366F1]" />
</div>
<div>
<div className="font-bold text-white">Nova reserva!</div>
<div className="text-sm text-gray-400">Quarto suite - 2 adultos</div>
</div>
</div>
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
<PremiumIcon name="phone" size={24} className="text-green-500" />
</div>
<div>
<div className="font-bold text-white">Check-in solicitado</div>
<div className="text-sm text-gray-400">Chegada às 14:00</div>
</div>
</div>
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-[#6366F1]/20 flex items-center justify-center">
<PremiumIcon name="star" size={24} className="text-[#6366F1]" />
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

<section className="py-20 bg-[#0A0A0A]">
<div className="max-w-7xl mx-auto px-4">
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
{socialProof.map((item, i) => (
<div key={i} className="text-center p-6">
<div className="text-3xl md:text-4xl font-black text-[#6366F1] mb-2">{item.number}</div>
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
</div>
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
{howItWorks.map((item, i) => (
<div key={i} className="text-center relative">
{i < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#6366F1]/50 to-transparent" />}
<div className="w-16 h-16 rounded-full bg-[#6366F1]/20 border-2 border-[#6366F1] flex items-center justify-center mx-auto mb-4">
<span className="text-2xl font-black text-[#6366F1]">{item.step}</span>
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
</div>
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
{benefits.map((b, i) => (
<div key={i} className="bg-[#050505] rounded-2xl p-6 border border-white/5 hover:border-[#6366F1]/30 transition-all group">
<div className="w-14 h-14 rounded-2xl bg-[#6366F1]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
<PremiumIcon name={b.icon as any} size={28} className="text-[#6366F1]" />
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
</div>
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
{features.map((f, i) => (
<div key={i} className="bg-[#0A0A0A] rounded-2xl p-7 border border-white/5 hover:border-[#6366F1]/40 transition-all">
<PremiumIcon name={f.icon as any} size={32} className="text-[#6366F1] mb-4" />
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
<div className="w-12 h-12 rounded-full bg-[#6366F1]/20 flex items-center justify-center font-bold text-[#6366F1]">
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
<div className="bg-[#0A0A0A] rounded-3xl p-8 md:p-12 border border-[#6366F1]/30 relative overflow-hidden">
<div className="absolute top-0 right-0 w-64 h-64 bg-[#6366F1]/10 rounded-full blur-3xl" />

<div className="relative text-center mb-8">
<span className="inline-block px-4 py-1.5 rounded-full bg-[#6366F1]/20 text-[#6366F1] font-semibold text-sm mb-4">OFERTA POR TEMPO LIMITADO</span>
<h2 className="text-3xl md:text-4xl font-bold mb-2">Site para Hotel e Pousada</h2>
<div className="flex items-center justify-center gap-4 mt-4">
<span className="text-2xl text-gray-500 line-through">De R$ 997</span>
<span className="text-5xl font-black text-[#6366F1]">R$ 497</span>
</div>
<p className="text-gray-400 mt-2">Pagamento único. Seu hotel para sempre.</p>
</div>

<ul className="space-y-3 mb-8 max-w-md mx-auto">
{['Domínio próprio (.com.br)', 'Hospedagem SSL Grátis', 'Sistema de Reservas', 'Galeria de Fotos', 'Otimização SEO', 'Integração WhatsApp', 'Painel Admin completo'].map((item, i) => (
<li key={i} className="flex items-center gap-3 text-gray-300">
<PremiumIcon name="check" size={20} className="text-green-500" />
<span>{item}</span>
</li>
))}
</ul>

<Link href="/orcamento?segmento=hotel" className="block w-full bg-[#6366F1] hover:opacity-90 text-white py-5 rounded-full font-bold text-xl text-center">
Quero Criar Meu Site →
</Link>

<GuaranteeBadge />
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
<h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto Para Atrair Mais Hóspedes?</h2>
<p className="text-gray-300 mb-8 max-w-2xl mx-auto">Não deixe seus concorrentes te ultrapassarem. Tenha um site profissional hoje mesmo.</p>
<CountdownTimer hours={12} color="#6366F1" />
<div className="mt-6">
<Link href="/orcamento?segmento=hotel" className="bg-[#6366F1] hover:opacity-90 text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3">
Solicitar Orçamento Grátis
<PremiumIcon name="arrow-right" size={20} />
</Link>
</div>
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