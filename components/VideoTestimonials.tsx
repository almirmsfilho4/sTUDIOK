'use client';

import { useState } from 'react';

interface VideoTestimonial {
  id: string;
  clientName: string;
  clientCompany?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  quote?: string;
  rating: number;
}

const DEFAULT_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: '1',
    clientName: 'Roberto Silva',
    clientCompany: 'Restaurante Sabor & Arte',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '1:30',
    quote: 'O site transformou nossos pedidos online. Aumento de 200% nas vendas!',
    rating: 5,
  },
  {
    id: '2',
    clientName: 'Carla Oliveira',
    clientCompany: 'Academia FitLife',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '2:15',
    quote: 'Entrega rápida e qualidade impecável. Recomendo para todos!',
    rating: 5,
  },
  {
    id: '3',
    clientName: 'Marcos Santos',
    clientCompany: 'Imobiliária Silva',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '1:45',
    quote: 'Meu negócio mudou completamente após o site. Clientes novos todos os dias.',
    rating: 5,
  },
  {
    id: '4',
    clientName: 'Juliana Costa',
    clientCompany: 'Salão Beleza & Charme',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '2:00',
    quote: 'Agendamento online facilitou muito minha rotina. Fantástico!',
    rating: 5,
  },
  {
    id: '5',
    clientName: 'André Pereira',
    clientCompany: 'E-commerce Modas',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '1:50',
    quote: 'Loja virtual completa com entrega em 48h. Muito obrigado ESTUDIOK!',
    rating: 5,
  },
];

export default function VideoTestimonials({ limit = 6, showAll = false }: { limit?: number; showAll?: boolean }) {
  const [testimonials] = useState<VideoTestimonial[]>(DEFAULT_TESTIMONIALS);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const displayTestimonials = showAll ? testimonials : testimonials.slice(0, limit);

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        {displayTestimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="card overflow-hidden group cursor-pointer"
            onClick={() => setActiveVideo(testimonial.id)}
          >
            <div className="relative aspect-video bg-[#1A1A1A]">
              <img 
                src={testimonial.thumbnailUrl || '/placeholder-video.jpg'} 
                alt={testimonial.clientName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-[#00D4FF] flex items-center justify-center">
                  <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              {testimonial.duration && (
                <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                  {testimonial.duration}
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex gap-1 mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <h3 className="font-bold text-white">{testimonial.clientName}</h3>
              {testimonial.clientCompany && (
                <p className="text-sm text-gray-400">{testimonial.clientCompany}</p>
              )}
              {testimonial.quote && (
                <p className="text-sm text-gray-300 mt-2 line-clamp-2">"{testimonial.quote}"</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              src={testimonials.find(t => t.id === activeVideo)?.videoUrl || ''}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {!showAll && testimonials.length > limit && (
        <div className="text-center">
          <button className="btn-secondary">
            Ver Todos os Depoimentos ({testimonials.length})
          </button>
        </div>
      )}
    </div>
  );
}