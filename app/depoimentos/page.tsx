'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

const testimonials = [
  {
    id: 1,
    name: 'Dr. Carlos Silva',
    role: 'Advogado Criminalista',
    company: 'Silva Advocacia',
    avatar: 'CS',
    rating: 5,
    text: 'Em 30 dias recebi 5 novos clientes pelo site. O investimento se pagou em uma semana. Excelente trabalho!',
    color: '#8B5CF6',
    segmento: 'advocacia',
  },
  {
    id: 2,
    name: 'Dra. Mariana Santos',
    role: 'Advogada Família e Sucessões',
    company: 'Santos & Associados',
    avatar: 'MS',
    rating: 5,
    text: 'Meu site ficou lindo e agora aparece nas primeiras posições do Google. Recomendo para todos os colegas.',
    color: '#8B5CF6',
    segmento: 'advocacia',
  },
  {
    id: 3,
    name: 'Roberto Ferreira',
    role: 'Proprietário',
    company: 'Churrascaria Point do Sul',
    avatar: 'RF',
    rating: 5,
    text: 'Nosso site alavancou os pedidos online. Aumentamos 200% no delivery. Perfeito para restaurante!',
    color: '#EF4444',
    segmento: 'restaurante',
  },
  {
    id: 4,
    name: 'Juliana Costa',
    role: 'Diretora',
    company: 'Academia FitLife',
    avatar: 'JC',
    rating: 5,
    text: 'Conseguimos triplicar as matrículas em 3 meses. O site tem funcionado 24h captando alunos para nós.',
    color: '#22C55E',
    segmento: 'academia',
  },
  {
    id: 5,
    name: 'Patricia Alves',
    role: 'Fundadora',
    company: 'Espaço Beleza Premium',
    avatar: 'PA',
    rating: 5,
    text: 'Agora as clientes agendam direto pelo site. Menos ligação, mais tempo para atender no salão.',
    color: '#EC4899',
    segmento: 'salao',
  },
  {
    id: 6,
    name: 'Dr. Ricardo Menezes',
    role: 'Cirurgião Plástico',
    company: 'Clínica Menezes',
    avatar: 'RM',
    rating: 5,
    text: 'Pacientes agendam consultas online. O site-passaporte para Google Business transformou nossa agenda.',
    color: '#06B6D4',
    segmento: 'clinica',
  },
  {
    id: 7,
    name: 'Fernanda Souza',
    role: 'Corretora de Imóveis',
    company: 'Imobiliária Top',
    avatar: 'FS',
    rating: 5,
    text: 'Meu portfólio de imóveis agora é visto por muito mais clientes. Agendamento de visitas automático.',
    color: '#3B82F6',
    segmento: 'imobiliaria',
  },
  {
    id: 8,
    name: 'Marcos Paulo',
    role: 'Instrutor',
    company: 'Autoescola Velocity',
    avatar: 'MP',
    rating: 5,
    text: 'Alunos agendam aulas e simulados online. Sistema integrado economizou nosso tempo administrativo.',
    color: '#22C55E',
    segmento: 'autoescola',
  },
  {
    id: 9,
    name: 'Claudia Lima',
    role: 'Gerente',
    company: 'Pousada Mar Azul',
    avatar: 'CL',
    rating: 5,
    text: 'Reservas diretas pelo site. Cortamos a comissão de OTAs e aumentamos nossa margem de lucro.',
    color: '#6366F1',
    segmento: 'hotel',
  },
  {
    id: 10,
    name: 'André Barros',
    role: 'E-commerce',
    company: 'Moda Masculina Premium',
    avatar: 'AB',
    rating: 5,
    text: 'Loja virtual completa. Em 2 meses já tínhamos o investimento pago. Suporte excelente!',
    color: '#F59E0B',
    segmento: 'ecommerce',
  },
  {
    id: 11,
    name: 'Dra. Priscila Rocha',
    role: 'Nutricionista',
    company: 'Clínica Nutrir',
    avatar: 'PR',
    rating: 5,
    text: 'Agendamento online funciona perfeitamente. Pacientes adoram a praticidade. Super recomendo!',
    color: '#06B6D4',
    segmento: 'clinica',
  },
  {
    id: 12,
    name: 'Thiago Martins',
    role: 'Empresário',
    company: 'Marmitas Saudáveis',
    avatar: 'TM',
    rating: 5,
    text: 'Cardápio digital com pedidos via WhatsApp. Aumentou bastante nosso faturamento.',
    color: '#EF4444',
    segmento: 'restaurante',
  },
];

const stats = [
  { number: '500+', label: 'Clientes Atendidos' },
  { number: '98%', label: 'Satisfação' },
  { number: '4.9/5', label: 'Nota Média' },
  { number: '7 anos', label: 'Experiência' },
];

export default function DepoimentosPage() {
  const [filter, setFilter] = useState('all');
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredTestimonials = filter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.segmento === filter);

  return (
    <div className="min-h-screen bg-[#050505]">
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-white/10 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-white font-semibold hidden md:block">Veja o que nossos clientes dizem</p>
            <Link href="/orcamento" className="bg-[#8B5CF6] hover:opacity-90 text-white px-6 py-2.5 rounded-full font-bold text-sm inline-flex items-center gap-2">
              Quero Meu Site <PremiumIcon name="arrow-right" size={16} />
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
            <Link href="/depoimentos" className="text-white font-semibold">Depoimentos</Link>
            <Link href="/orcamento" className="bg-[#8B5CF6] hover:opacity-90 px-5 py-2.5 rounded-full font-bold text-white text-sm">
              Solicitar Orçamento
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent" />
          <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-[#8B5CF6]/15 rounded-full blur-[180px]" />

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 mb-6">
                <PremiumIcon name="star" size={16} className="text-[#8B5CF6]" />
                <span className="text-[#8B5CF6] font-semibold text-sm">O Que Nossos Clientes Dizem</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Depoimentos de{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]">
                  Clientes Reais
                </span>
              </h1>

              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Mais de 500 clientes satisfeitos em todo Brasil. Veja o que dizem sobre nosso trabalho.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, i) => (
                <div key={i} className="text-center p-6 bg-[#0A0A0A] rounded-2xl border border-white/10">
                  <div className="text-3xl md:text-4xl font-black text-[#8B5CF6] mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'advocacia', label: 'Advogados' },
                { id: 'restaurante', label: 'Restaurantes' },
                { id: 'academia', label: 'Academias' },
                { id: 'salao', label: 'Salões' },
                { id: 'clinica', label: 'Clínicas' },
                { id: 'imobiliaria', label: 'Imobiliárias' },
                { id: 'ecommerce', label: 'E-commerce' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                    filter === f.id 
                      ? 'bg-[#8B5CF6] text-white' 
                      : 'bg-[#0A0A0A] text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((t) => (
                <div 
                  key={t.id} 
                  className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{ backgroundColor: `${t.color}20`, color: t.color }}
                    >
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

                  <p className="text-gray-300 mb-4">"{t.text}"</p>

                  <Link 
                    href={`/site-${t.segmento}`}
                    className="text-sm font-semibold underline underline-offset-2"
                    style={{ color: t.color }}
                  >
                    Ver site criado →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Quer Ter o Mesmo Resultado?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Junte-se a mais de 500 clientes satisfeitos. Seu site profissional esperando por você.
            </p>
            <Link href="/orcamento" className="bg-[#8B5CF6] hover:opacity-90 text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3">
              Solicitar Orçamento Grátis
              <PremiumIcon name="arrow-right" size={20} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-[#050505] border-t border-white/5">
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