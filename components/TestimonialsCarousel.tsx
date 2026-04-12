'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
  projectType: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Roberto Silva',
    company: 'TechStart',
    text: 'Transformaram nossa presença digital. O site ficou incrível e as vendas aumentaram 150% em 3 meses. Entrega sempre no prazo!',
    rating: 5,
    avatar: 'RS',
    projectType: 'E-commerce',
  },
  {
    id: '2',
    name: 'Mariana Costa',
    company: 'Fitness Pro',
    text: 'Profissionais extremamente competentes. Entenderam exatamente o que precisava e entregaram acima das expectativas.',
    rating: 5,
    avatar: 'MC',
    projectType: 'App Mobile',
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    company: 'Contábil Online',
    text: 'Sistema personalizado que revolucionou nossa operação. O suporte é excelente e sempre rápido.',
    rating: 5,
    avatar: 'CO',
    projectType: 'Sistema Web',
  },
  {
    id: '4',
    name: 'Juliana Martins',
    company: 'Beleza Natural',
    text: 'Minha loja virtual ficou linda! As vendas aumentaram muito desde que lançamos. Recomendo para todos!',
    rating: 5,
    avatar: 'JM',
    projectType: 'E-commerce',
  },
  {
    id: '5',
    name: 'Paulo Henrique',
    company: 'Construshow',
    text: 'Excelente trabalho! Site moderno, rápido e com excelente performance no Google. Já indicamos vários clientes.',
    rating: 5,
    avatar: 'PH',
    projectType: 'Site Institucional',
  },
  {
    id: '6',
    name: 'Ana Paula',
    company: 'Doces & Sabores',
    text: 'Delivery cresceu 200% após o site上线. Interface linda e muito fácil de gerenciar!',
    rating: 5,
    avatar: 'AP',
    projectType: 'App Delivery',
  },
  {
    id: '7',
    name: 'Ricardo Souza',
    company: 'AutoPeças Express',
    text: 'Precisava de um sistema de gestão e a ESTUDIOK entregou满分. Muito obrigado pelo atendimento!',
    rating: 5,
    avatar: 'RS',
    projectType: 'Sistema Web',
  },
  {
    id: '8',
    name: 'Fernanda Lima',
    company: 'Moda Feminina',
    text: 'Minha boutique online ficou sempurna. O design é lindo e as clientes amam navegar no site.',
    rating: 5,
    avatar: 'FL',
    projectType: 'E-commerce',
  },
];

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { getDocuments } = await import('@/lib/firebase-services');
      const data = await getDocuments('testimonials');
      if (data && (data as any[]).length > 0) {
        setTestimonials(data as Testimonial[]);
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-600'}>
        ★
      </span>
    ));
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <div className="card p-8 md:p-12 text-center max-w-4xl mx-auto">
                <div className="flex justify-center gap-1 mb-6">
                  {renderStars(testimonial.rating)}
                </div>
                
                <blockquote className="text-xl md:text-2xl text-gray-200 mb-8 italic leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B2CBF] flex items-center justify-center text-xl font-bold text-black">
                    {testimonial.avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">{testimonial.name}</p>
                    <p className="text-gray-400">{testimonial.company}</p>
                    <span className="inline-block mt-1 text-xs px-3 py-1 rounded-full bg-[#00D4FF]/20 text-[#00D4FF]">
                      {testimonial.projectType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === activeIndex 
                ? 'bg-[#00D4FF] w-8' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Trust Score */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/30">
          <span className="text-green-400 text-2xl">★</span>
          <span className="text-green-400 font-bold text-lg">4.9/5</span>
          <span className="text-gray-400">de {testimonials.length}+ avaliações</span>
        </div>
      </div>
    </div>
  );
}