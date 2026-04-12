'use client';

import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

const benefits = [
{ icon: 'trending-up', title: 'Mais Vendas', desc: 'Site otimizado para Google. Clientes te encontram quando buscam imóveis.' },
{ icon: 'home', title: 'Catálogo Completo', desc: 'Liste todos os imóveis com fotos, vídeos, valores. Busca avançada.' },
{ icon: 'smartphone', title: 'Funciona em Todo Lugar', desc: 'Site responsivo. Perfeito no celular, tablet ou computador.' },
{ icon: 'chart', title: 'Gestão Total', desc: 'Painel admin para gerenciar imóveis, leads e clientes.' },
];

const features = [
{ icon: 'home', title: 'Catálogo de Imóveis', desc: 'Lista todos os imóveis com fotos, vídeos, valores. Busca avançada.' },
{ icon: 'map-pin', title: 'Mapa Interativo', desc: 'Cliente vê localização exata. Filtro por bairro, preço, tipo.' },
{ icon: 'dollar', title: 'Simulador de Financiamento', desc: 'Calcula parcelas na hora. Aumenta conversão.' },
{ icon: 'smartphone', title: 'WhatsApp Direct', desc: 'Botão para falar direto com corretor. Resposta rápida.' },
{ icon: 'star', title: 'Avaliações', desc: 'Depoimentos de clientes. Confiança para comprar/alugar.' },
{ icon: 'chart', title: 'Painel Admin', desc: 'Gerencie imóveis, leads, clientes. Tudo em um lugar.' },
];

const socialProof = [
{ number: '200+', label: 'Imobiliárias Atendidas' },
{ number: '10K+', label: 'Imóveis Publicados' },
{ number: 'R$500M+', label: 'Em Vendas Realizadas' },
{ number: '98%', label: 'Clientes Satisfeitos' },
];

const faq = [
{ q: 'Quanto tempo leva para criar o site?', a: 'Em até 10 dias úteis seu site estará no ar. Briefing em 24h.' },
{ q: 'O site inclui domínio e hospedagem?', a: 'Sim! Primeiro ano de domínio e hospedagem gratuitos.' },
{ q: 'Quantos imóveis posso cadastrar?', a: 'Ilimitados! Cadastre quantos imóveis quiser.' },
{ q: 'O site aparece no Google?', a: 'Sim! Otimizamos para SEO local. Seus clientes te encontram na busca.' },
];

export default function SiteImobiliariaPage() {
return (
<div className="min-h-screen bg-[#050505]">
<nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
<div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
<Link href="/" className="flex items-center gap-3">
<img src="/logo.png" alt="ESTUDIOK" className="h-12" />
</Link>
<div className="hidden md:flex items-center gap-4">
<Link href="/" className="text-gray-400 hover:text-white transition">Início</Link>
<Link href="/orcamento?segmento=imobiliaria" className="bg-[#06D6A0] hover:opacity-90 px-5 py-2.5 rounded-full font-bold text-white text-sm">
Solicitar Orçamento
</Link>
</div>
</div>
</nav>

<main className="pt-20">
<section className="py-20 lg:py-32 relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-[#06D6A0]/10 to-transparent" />
<div className="absolute top-40 right-0 w-[600px] h-[600px] bg-[#06D6A0]/15 rounded-full blur-[180px]" />

<div className="max-w-7xl mx-auto px-4 relative">
<div className="grid lg:grid-cols-2 gap-12 items-center">
<div>
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06D6A0]/20 border border-[#06D6A0]/30 mb-6">
<PremiumIcon name="home" size={16} className="text-[#06D6A0]" />
<span className="text-[#06D6A0] font-semibold text-sm">Especialista em Imobiliárias</span>
</div>

<h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
Venda Mais Imóveis com{' '}
<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06D6A0] to-[#34D399]">
Site Profissional
</span>
</h1>

<p className="text-lg text-gray-300 mb-8 max-w-xl">
Plataforma completa para sua imobiliária. Catálogo de imóveis, busca avançada, 
simulador de financiamento e gestão completa em um só lugar.
</p>

<div className="flex flex-col sm:flex-row gap-4 mb-8">
<Link href="/orcamento?segmento=imobiliaria" className="bg-[#06D6A0] hover:opacity-90 text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center justify-center gap-2">
Criar Site Agora
<PremiumIcon name="arrow-right" size={20} />
</Link>
<Link href="#precos" className="border border-white/20 hover:border-[#06D6A0] text-white px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center gap-2 transition">
Ver Preços
</Link>
</div>

<div className="flex items-center gap-6 text-sm text-gray-400">
<div className="flex items-center gap-2">
<PremiumIcon name="check" size={16} className="text-[#06D6A0]" />
<span>10 dias no ar</span>
</div>
<div className="flex items-center gap-2">
<PremiumIcon name="check" size={16} className="text-[#06D6A0]" />
<span>Domínio Grátis</span>
</div>
<div className="flex items-center gap-2">
<PremiumIcon name="check" size={16} className="text-[#06D6A0]" />
<span>Imóveis Ilimitados</span>
</div>
</div>
</div>

<div className="relative hidden lg:block">
<div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10 relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-[#06D6A0]/20 rounded-full blur-3xl" />
<div className="relative space-y-4">
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-[#06D6A0]/20 flex items-center justify-center">
<PremiumIcon name="home" size={24} className="text-[#06D6A0]" />
</div>
<div>
<div className="font-bold text-white">Apartamento Premium</div>
<div className="text-sm text-gray-400">R$ 450.000 • Centro</div>
</div>
</div>
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
<PremiumIcon name="phone" size={24} className="text-green-500" />
</div>
<div>
<div className="font-bold text-white">Novo lead!</div>
<div className="text-sm text-gray-400">Interessado em apartamento de 2 quartos</div>
</div>
</div>
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-[#06D6A0]/20 flex items-center justify-center">
<PremiumIcon name="trending-up" size={24} className="text-[#06D6A0]" />
</div>
<div>
<div className="font-bold text-white">Venda concretizada!</div>
<div className="text-sm text-gray-400">Apartamento vendido essa semana</div>
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
<div className="text-3xl md:text-4xl font-black text-[#06D6A0] mb-2">{item.number}</div>
<div className="text-gray-400">{item.label}</div>
</div>
))}
</div>
</div>
</section>

<section className="py-20 bg-[#050505]">
<div className="max-w-7xl mx-auto px-4">
<div className="text-center mb-12">
<h2 className="text-3xl md:text-4xl font-bold mb-4">Por Que Ter Um Site?</h2>
<p className="text-gray-400 max-w-2xl mx-auto">Imobiliárias com site vendem 3x mais. Esteja onde seus clientes buscam.</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
{benefits.map((b, i) => (
<div key={i} className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/5 hover:border-[#06D6A0]/30 transition-all group">
<div className="w-14 h-14 rounded-2xl bg-[#06D6A0]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
<PremiumIcon name={b.icon as any} size={28} className="text-[#06D6A0]" />
</div>
<h3 className="text-xl font-bold mb-2">{b.title}</h3>
<p className="text-gray-400 text-sm">{b.desc}</p>
</div>
))}
</div>
</div>
</section>

<section className="py-20 bg-[#0A0A0A]">
<div className="max-w-7xl mx-auto px-4">
<div className="text-center mb-12">
<h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo Que Seu Site Precisa</h2>
<p className="text-gray-400 max-w-2xl mx-auto">Recursos completos para sua imobiliária.</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
{features.map((f, i) => (
<div key={i} className="bg-[#050505] rounded-2xl p-7 border border-white/5 hover:border-[#06D6A0]/40 transition-all">
<PremiumIcon name={f.icon as any} size={32} className="text-[#06D6A0] mb-4" />
<h3 className="text-xl font-bold mb-2">{f.title}</h3>
<p className="text-gray-400">{f.desc}</p>
</div>
))}
</div>
</div>
</section>

<section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#050505]" id="precos">
<div className="max-w-4xl mx-auto px-4">
<div className="bg-[#0A0A0A] rounded-3xl p-8 md:p-12 border border-[#06D6A0]/30 relative overflow-hidden">
<div className="absolute top-0 right-0 w-64 h-64 bg-[#06D6A0]/10 rounded-full blur-3xl" />

<div className="relative text-center mb-8">
<span className="inline-block px-4 py-1.5 rounded-full bg-[#06D6A0]/20 text-[#06D6A0] font-semibold text-sm mb-4">Melhor Custo-Benefício</span>
<h2 className="text-3xl md:text-4xl font-bold mb-2">Site para Imobiliária</h2>
<p className="text-gray-400">Plataforma completa para vender mais imóveis</p>
</div>

<div className="text-center mb-8">
<p className="text-5xl font-black text-[#06D6A0] mb-2">R$ 997</p>
<p className="text-gray-400 mb-2">Pagamento único. Seu para sempre.</p>
<p className="text-sm text-gray-500">Sem mensalidade. Sem surpresas.</p>
</div>

<ul className="space-y-3 mb-8 max-w-md mx-auto">
{['Domínio próprio (.com.br)', 'Hospedagem SSL Grátis', 'Imóveis Ilimitados', 'Busca Avançada', 'Simulador de Financiamento', 'Integração WhatsApp', 'Painel Admin completo'].map((item, i) => (
<li key={i} className="flex items-center gap-3 text-gray-300">
<PremiumIcon name="check" size={20} className="text-green-500" />
<span>{item}</span>
</li>
))}
</ul>

<Link href="/orcamento?segmento=imobiliaria" className="block w-full bg-[#06D6A0] hover:opacity-90 text-white py-5 rounded-full font-bold text-xl text-center">
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
<h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto Para Vender Mais Imóveis?</h2>
<p className="text-gray-300 mb-8 max-w-2xl mx-auto">Não deixe suas concorrentes te ultrapassarem. Tenha um site profissional hoje mesmo.</p>
<Link href="/orcamento?segmento=imobiliaria" className="bg-[#06D6A0] hover:opacity-90 text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3">
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