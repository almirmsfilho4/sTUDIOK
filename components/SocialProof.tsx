'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Roberto Silva',
    company: 'TechStart',
    role: 'CEO',
    image: 'RS',
    rating: 5,
    text: 'Transformaram nossa presença digital. O site ficou incrível e as vendas aumentaram 150% em 3 meses. Entrega sempre no prazo!',
    project: 'E-commerce',
  },
  {
    id: 2,
    name: 'Mariana Costa',
    company: 'Fitness Pro',
    role: 'Fundadora',
    image: 'MC',
    rating: 5,
    text: 'Profissionais extremamente competentes. Entenderam exatamente o que precisava e entregaram acima das expectativas.',
    project: 'App Mobile',
  },
  {
    id: 3,
    name: 'Carlos Oliveira',
    company: 'Contábil Online',
    role: 'Diretor',
    image: 'CO',
    rating: 5,
    text: 'Sistema personalizado que revolucionou nossa operação. O suporte é excelente e sempre rápido.',
    project: 'Sistema Web',
  },
  {
    id: 4,
    name: 'Juliana Martins',
    company: 'Beleza Natural',
    role: 'Empreendedora',
    image: 'JM',
    rating: 5,
    text: 'Minha loja virtual ficou linda! As vendas aumentaram muito desde que lançamos. Recomendo para todos!',
    project: 'E-commerce',
  },
  {
    id: 5,
    name: 'Paulo Henrique',
    company: 'Construshow',
    role: 'CEO',
    image: 'PH',
    rating: 5,
    text: 'Excelente trabalho! Site moderno, rápido e com excelente performance no Google. Já Indicamos vários clientes.',
    project: 'Site Institucional',
  },
];

const clientLogos = [
  { name: 'TechStart', color: '#00D4FF' },
  { name: 'Fitness Pro', color: '#7B2CBF' },
  { name: 'Contábil Online', color: '#FF006E' },
  { name: 'Beleza Natural', color: '#10B981' },
  { name: 'Construshow', color: '#F59E0B' },
  { name: 'AutoPeças', color: '#EF4444' },
  { name: 'Doces&Salgados', color: '#EC4899' },
  { name: 'Imobi', color: '#3B82F6' },
];

export default function SocialProof() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12">
      {/* Client Logos - Trust Bar */}
      <div className="py-8 bg-[#0A0A0A]/50">
        <p className="text-center text-gray-500 text-sm mb-6 uppercase tracking-widest">
          Empresas que confiam em nós
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {clientLogos.map((logo, index) => (
            <div 
              key={index}
              className="text-gray-600 hover:text-[#00D4FF] transition-colors cursor-default"
              style={{ opacity: 0.5 + (index % 3) * 0.15 }}
            >
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: `${logo.color}20`, color: logo.color }}
              >
                {logo.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { value: '500+', label: 'Projetos Entregues' },
          { value: '98%', label: 'Clientes Satisfeitos' },
          { value: '48h', label: 'Prazo Médio de Entrega' },
          { value: '150%', label: 'Aumento Médio em Vendas' },
        ].map((stat, index) => (
          <div key={index} className="text-center p-6 card">
            <div className="text-3xl md:text-4xl font-bold text-[#00D4FF] mb-2">
              {stat.value}
            </div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Testimonials Carousel */}
      <div className="relative max-w-3xl mx-auto">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B2CBF] flex items-center justify-center text-xl font-bold">
                    {testimonial.image}
                  </div>
                  
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                  </div>
                  
                  <p className="text-lg text-gray-300 mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role} @ {testimonial.company}
                    </p>
                    <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-[#00D4FF]/20 text-[#00D4FF]">
                      {testimonial.project}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeTestimonial 
                  ? 'bg-[#00D4FF] w-8' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}