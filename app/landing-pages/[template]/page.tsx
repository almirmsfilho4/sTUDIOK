'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const TEMPLATES = {
  restaurante: {
    name: 'Restaurante & Lanchonete',
    colors: ['#FF6B35', '#F7C59F', '#2E294E'],
    sections: ['hero', 'cardapio', 'sobre', 'galeria', 'depoimentos', 'contato'],
  },
  ecommerce: {
    name: 'E-commerce',
    colors: ['#00D4FF', '#7B2CBF', '#1A1A1A'],
    sections: ['hero', 'produtos', 'destaques', 'depoimentos', 'newsletter', 'contato'],
  },
  academia: {
    name: 'Academia & Fitness',
    colors: ['#FF006E', '#8338EC', '#3A86FF'],
    sections: ['hero', 'modalidades', 'planos', 'galeria', 'depoimentos', 'contato'],
  },
  corretor: {
    name: 'Corretor de Imóveis',
    colors: ['#06D6A0', '#118AB2', '#073B4C'],
    sections: ['hero', 'imoveis', 'bairros', 'depoimentos', 'contato'],
  },
  salao: {
    name: 'Salão de Beleza',
    colors: ['#FF69B4', '#FFC8DD', '#2E294E'],
    sections: ['hero', 'servicos', 'galeria', 'equipe', 'depoimentos', 'contato'],
  },
  empresa: {
    name: 'Empresa & Corporativo',
    colors: ['#1A1A1A', '#00D4FF', '#7B2CBF'],
    sections: ['hero', 'servicos', 'sobre', 'diferenciais', 'depoimentos', 'contato'],
  },
};

export default function LandingPageTemplate({ params }: { params: { template: string } }) {
  const template = TEMPLATES[params.template as keyof typeof TEMPLATES];
  const [email, setEmail] = useState('');

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Template não encontrado</h1>
          <Link href="/" className="text-[#00D4FF] hover:underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const handleLeadCapture = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Obrigado! Em breve entraremos em contato.');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <img src="/logo.png" alt="ESTUDIOK" className="h-12" />
          <Link href={`/orcamento?template=${params.template}`} className="btn-primary">
            Solicitar Orçamento
          </Link>
        </div>
      </header>

      {template.sections.includes('hero') && (
        <section className="pt-32 pb-20 px-4" style={{ background: `linear-gradient(135deg, ${template.colors[2]} 0%, ${template.colors[0]}22 100%)` }}>
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Sua Empresa no <span style={{ color: template.colors[0] }}>Digital</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Site profissional com entrega em 48 horas. Aumente suas vendas e conquiste novos clientes.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={`/orcamento?template=${params.template}`} className="btn-primary text-lg px-8 py-4">
                Começar Agora
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                Ver Demonstração
              </button>
            </div>
          </div>
        </section>
      )}

      {template.sections.includes('servicos') && (
        <section className="py-20 px-4 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Nossos <span style={{ color: template.colors[0] }}>Serviços</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-8 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${template.colors[0]}22` }}>
                    <span className="text-3xl">⭐</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Serviço {i}</h3>
                  <p className="text-gray-400">Descrição do serviço oferecido pela sua empresa.</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {template.sections.includes('produtos') && (
        <section className="py-20 px-4 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Nossos <span style={{ color: template.colors[0] }}>Produtos</span>
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="card overflow-hidden group">
                  <div className="aspect-square bg-[#1A1A1A] flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white">Produto {i}</h3>
                    <p className="text-sm text-gray-400">R$ {String(i * 99).padStart(2, '0')},00</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {template.sections.includes('depoimentos') && (
        <section className="py-20 px-4 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              O que Dizem <span style={{ color: template.colors[0] }}>Nossos Clientes</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'João Silva', text: 'Excelente trabalho! Meu site ficou perfeito.' },
                { name: 'Maria Santos', text: 'Entrega rápida e qualidade incrível.' },
                { name: 'Pedro Oliveira', text: 'Minha empresa cresceu 300% depois do site.' },
              ].map((depo, i) => (
                <div key={i} className="card p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-yellow-500">★</span>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{depo.text}"</p>
                  <p className="font-bold" style={{ color: template.colors[0] }}>{depo.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {template.sections.includes('contato') && (
        <section className="py-20 px-4 bg-[#0A0A0A]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8">
              Entre em <span style={{ color: template.colors[0] }}>Contato</span>
            </h2>
            <p className="text-gray-400 mb-8">
              Preencha o formulário e retornaremos em até 2 horas.
            </p>
            <form onSubmit={handleLeadCapture} className="space-y-4">
              <input type="text" placeholder="Seu Nome" className="input-field w-full" required />
              <input type="email" placeholder="Seu Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field w-full" required />
              <input type="tel" placeholder="Seu WhatsApp" className="input-field w-full" required />
              <textarea placeholder="Sua Mensagem" className="input-field w-full" rows={4}></textarea>
              <button type="submit" className="btn-primary w-full text-lg py-4">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </section>
      )}

      {template.sections.includes('newsletter') && (
        <section className="py-16 px-4" style={{ background: `${template.colors[0]}22` }}>
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Receba nossas promoções</h3>
            <form onSubmit={handleLeadCapture} className="flex gap-4 max-w-md mx-auto">
              <input type="email" placeholder="Seu email" className="input-field flex-1" required />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Inscrever-se
              </button>
            </form>
          </div>
        </section>
      )}

      <footer className="py-8 px-4 border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>© 2024 ESTUDIOK. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}