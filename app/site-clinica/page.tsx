'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

const benefits = [
{ icon: 'trending-up', title: 'Mais Pacientes', desc: 'Site otimizado para Google. Pacientes te encontram quando buscam por sua especialidade.' },
{ icon: 'clock', title: 'Agenda Automática', desc: 'Paciente agenda sozinho, 24h. Sem ligações, sem perda de tempo.' },
{ icon: 'heart', title: 'Humanização', desc: 'Apresentação da equipe médica. Constrói confiança e vínculo.' },
{ icon: 'smartphone', title: 'Funciona em Todo Lugar', desc: 'Site responsivo. Perfeito no celular, tablet ou computador.' },
];

const features = [
{ icon: 'building', title: 'Especialidades', desc: 'Liste suas áreas de atuação. Paciente encontra o especialista certo.' },
{ icon: 'calendar', title: 'Agendamento Online', desc: 'Paciente agenda sozinho, 24h. Sem ligações, sem WA.' },
{ icon: 'users', title: 'Equipe Médica', desc: 'Apresentação dos médicos. Humaniza e passa confiança.' },
{ icon: 'map-pin', title: 'Localização', desc: 'Endereço, mapa, parking. Paciente encontra fácil.' },
{ icon: 'smartphone', title: 'WhatsApp Direto', desc: 'Botão para chamar no WhatsApp. Conversão imediata.' },
{ icon: 'star', title: 'Avaliações', desc: 'Google Reviews. Novo paciente confia mais.' },
];

const socialProof = [
{ number: '300+', label: 'Clínicas Atendidas' },
{ number: '95%', label: 'Pacientes Satisfeitos' },
{ number: '50K+', label: 'Consultas Agendadas' },
{ number: '24/7', label: 'Agendamento Online' },
];

const howItWorks = [
{ step: '1', title: 'Briefing', desc: 'Você responde um formulário simples com suas necessidades.' },
{ step: '2', title: 'Criamos', desc: 'Em até 5 dias criamos seu site profissional.' },
{ step: '3', title: 'Você Aprova', desc: 'Revisamos juntos e ajustamos o que precisar.' },
{ step: '4', title: 'No Ar!', desc: 'Seu site fica no ar e você começa a receber pacientes.' },
];

const testimonials = [
{ name: 'Dr. Roberto Alves', role: 'Clínica Saúde Total', text: 'Em 30 dias agendamos 40 novas consultas. O site se pagou em 15 dias.', avatar: 'RA', rating: 5 },
{ name: 'Dra. Patricia Lima', role: 'Clínica Estética', text: 'Pacientes adoram o agendamento online. Nossa agenda nunca mais ficou vazia.', avatar: 'PL', rating: 5 },
{ name: 'Dr. Marcos Ferreira', role: 'Clínica Pediatric', text: 'Excelente! Logo no primeiro mês já tínhamos pacientes novos todos os dias.', avatar: 'MF', rating: 5 },
];

const faq = [
{ q: 'Quanto tempo leva para criar o site?', a: 'Em até 7 dias úteis seu site estará no ar. Briefing em 24h.' },
{ q: 'O site inclui domínio e hospedagem?', a: 'Sim! Primeiro ano de domínio e hospedagem gratuitos.' },
{ q: 'Posso atualizar o site depois?', a: 'Sim! Você tem acesso ao painel admin para alterar textos, imagens e serviços.' },
{ q: 'O site aparece no Google?', a: 'Sim! Otimizamos para SEO local. Seus pacientes te encontram na busca.' },
];

export default function SiteClinicaPage() {
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
<div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#3B82F6]/30 py-3 px-4">
<div className="max-w-7xl mx-auto flex items-center justify-between">
<p className="text-white font-semibold hidden md:block">Pronto para ter mais pacientes?</p>
<Link href="/orcamento?segmento=clinica" className="bg-[#3B82F6] hover:opacity-90 text-white px-6 py-2.5 rounded-full font-bold text-sm inline-flex items-center gap-2">
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
<Link href="/orcamento?segmento=clinica" className="bg-[#3B82F6] hover:opacity-90 px-5 py-2.5 rounded-full font-bold text-white text-sm">
Solicitar Orçamento
</Link>
</div>
</div>
</nav>

<main className="pt-20">
<section className="py-20 lg:py-32 relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 to-transparent" />
<div className="absolute top-40 right-0 w-[600px] h-[600px] bg-[#3B82F6]/15 rounded-full blur-[180px]" />

<div className="max-w-7xl mx-auto px-4 relative">
<div className="grid lg:grid-cols-2 gap-12 items-center">
<div>
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 mb-6">
<PremiumIcon name="building" size={16} className="text-[#3B82F6]" />
<span className="text-[#3B82F6] font-semibold text-sm">Especialista em Clínicas</span>
</div>

<h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
Sua Clínica Com{' '}
<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]">
Agenda Sempre Cheia
</span>
</h1>

<p className="text-lg text-gray-300 mb-8 max-w-xl">
Pacientes agendam consultas 24 horas por dia, 7 dias por semana. 
Sem perder tempo com ligações. Sua agenda sempre cheia.
</p>

<div className="flex flex-col sm:flex-row gap-4 mb-8">
<Link href="/orcamento?segmento=clinica" className="bg-[#3B82F6] hover:opacity-90 text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center justify-center gap-2">
Criar Site Agora
<PremiumIcon name="arrow-right" size={20} />
</Link>
<Link href="#precos" className="border border-white/20 hover:border-[#3B82F6] text-white px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center gap-2 transition">
Ver Preços
</Link>
</div>

<div className="flex items-center gap-6 text-sm text-gray-400">
<div className="flex items-center gap-2">
<PremiumIcon name="check" size={16} className="text-[#3B82F6]" />
<span>7 dias no ar</span>
</div>
<div className="flex items-center gap-2">
<PremiumIcon name="check" size={16} className="text-[#3B82F6]" />
<span>Domínio Grátis</span>
</div>
<div className="flex items-center gap-2">
<PremiumIcon name="check" size={16} className="text-[#3B82F6]" />
<span>SEO Otimizado</span>
</div>
</div>
</div>

<div className="relative hidden lg:block">
<div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10 relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/20 rounded-full blur-3xl" />
<div className="relative space-y-4">
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
<PremiumIcon name="building" size={24} className="text-[#3B82F6]" />
</div>
<div>
<div className="font-bold text-white">Clínica Vida Sana</div>
<div className="text-sm text-gray-400">Clínica Multiespecialidades</div>
</div>
</div>
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
<PremiumIcon name="calendar" size={24} className="text-green-500" />
</div>
<div>
<div className="font-bold text-white">Nova consulta!</div>
<div className="text-sm text-gray-400">Paciente agendou agora mesmo</div>
</div>
</div>
<div className="flex items-center gap-4 p-4 bg-[#050505] rounded-2xl border border-white/5">
<div className="w-12 h-12 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
<PremiumIcon name="star" size={24} className="text-[#3B82F6]" />
</div>
<div>
<div className="font-bold text-white">5 estrelas no Google</div>
<div className="text-sm text-gray-400">Novas avaliações essa semana</div>
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
<PremiumIcon name="smartphone" size={20} className="text-[#3B82F6]" />
</div>
<div className="mt-3 bg-[#0A0A0A] rounded-xl p-3 border border-white/5">
<div className="h-4 w-20 bg-[#3B82F6]/30 rounded mb-2"></div>
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
<div className="text-3xl md:text-4xl font-black text-[#3B82F6] mb-2">{item.number}</div>
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
{i < 3 && <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#3B82F6]/50 to-transparent" />}
<div className="w-16 h-16 rounded-full bg-[#3B82F6]/20 border-2 border-[#3B82F6] flex items-center justify-center mx-auto mb-4">
<span className="text-2xl font-black text-[#3B82F6]">{item.step}</span>
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
<p className="text-gray-400 max-w-2xl mx-auto">Mais de 80% dos pacientes pesquisam online antes de escolher uma clínica. Esteja presente onde seus pacientes buscam.</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
{benefits.map((b, i) => (
<div key={i} className="bg-[#050505] rounded-2xl p-6 border border-white/5 hover:border-[#3B82F6]/30 transition-all group">
<div className="w-14 h-14 rounded-2xl bg-[#3B82F6]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
<PremiumIcon name={b.icon as any} size={28} className="text-[#3B82F6]" />
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
<p className="text-gray-400 max-w-2xl mx-auto">Recursos completos para converter visitantes em pacientes.</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
{features.map((f, i) => (
<div key={i} className="bg-[#0A0A0A] rounded-2xl p-7 border border-white/5 hover:border-[#3B82F6]/40 transition-all">
<PremiumIcon name={f.icon as any} size={32} className="text-[#3B82F6] mb-4" />
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
<div className="w-12 h-12 rounded-full bg-[#3B82F6]/20 flex items-center justify-center font-bold text-[#3B82F6]">
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
<div className="bg-[#0A0A0A] rounded-3xl p-8 md:p-12 border border-[#3B82F6]/30 relative overflow-hidden">
<div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-3xl" />

<div className="relative text-center mb-8">
<span className="inline-block px-4 py-1.5 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] font-semibold text-sm mb-4">Melhor Custo-Benefício</span>
<h2 className="text-3xl md:text-4xl font-bold mb-2">Site Profissional para Clínicas</h2>
<p className="text-gray-400">Tudo que você precisa para atrair pacientes</p>
</div>

<div className="text-center mb-8">
<p className="text-5xl font-black text-[#3B82F6] mb-2">R$ 497</p>
<p className="text-gray-400 mb-2">Pagamento único. Seu para sempre.</p>
<p className="text-sm text-gray-500">Sem mensalidade. Sem surpresas.</p>
</div>

<ul className="space-y-3 mb-8 max-w-md mx-auto">
{['Domínio próprio (.com.br)', 'Hospedagem SSL Grátis', 'Design responsivo (mobile)', 'Otimização SEO', 'Agendamento Online', 'Integração WhatsApp', 'Painel Admin completo'].map((item, i) => (
<li key={i} className="flex items-center gap-3 text-gray-300">
<PremiumIcon name="check" size={20} className="text-green-500" />
<span>{item}</span>
</li>
))}
</ul>

<Link href="/orcamento?segmento=clinica" className="block w-full bg-[#3B82F6] hover:opacity-90 text-white py-5 rounded-full font-bold text-xl text-center">
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
<h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto Para Atrair Mais Pacientes?</h2>
<p className="text-gray-300 mb-8 max-w-2xl mx-auto">Não deixe suas concorrentes te ultrapassarem. Tenha um site profissional hoje mesmo.</p>
<Link href="/orcamento?segmento=clinica" className="bg-[#3B82F6] hover:opacity-90 text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3">
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