'use client';

import { useState } from 'react';

interface BeforeAfterItem {
  id: string;
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description?: string;
}

const items: BeforeAfterItem[] = [
  {
    id: '1',
    title: 'E-commerce Fashion',
    category: 'E-commerce',
    beforeImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop',
    description: 'Redesign completo com aumento de 150% nas conversões'
  },
  {
    id: '2',
    title: 'Site Corporativo',
    category: 'Site Institucional',
    beforeImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop',
    description: 'Modernização com design responsivo'
  },
  {
    id: '3',
    title: 'Dashboard Analytics',
    category: 'Sistema Web',
    beforeImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop',
    description: 'Nova interface com visualização de dados em tempo real'
  },
  {
    id: '4',
    title: 'App Delivery',
    category: 'App Mobile',
    beforeImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop',
    description: 'UX reimaginado com foco em facilidade de uso'
  },
];

export default function BeforeAfterGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

const currentItem = items[activeIndex];
 if (!currentItem) return null;

 const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(x, 0), 100));
  };

  return (
    <section className="py-24 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#00D4FF] font-medium">ANTES & DEPOIS</span>
          <h2 className="text-4xl font-bold mt-2">Transformações Reais</h2>
          <p className="text-gray-400 mt-4">
            Veja o antes e depois de alguns dos nossos projetos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveIndex(index);
                setSliderPosition(50);
              }}
              className={`p-4 rounded-xl border transition-all text-left ${
                activeIndex === index
                  ? 'border-[#00D4FF] bg-[#00D4FF]/10'
                  : 'border-[#1A1A1A] hover:border-[#00D4FF]/50'
              }`}
            >
              <span className="text-xs text-[#00D4FF]">{item.category}</span>
              <h3 className="font-medium mt-1">{item.title}</h3>
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div 
            className="relative cursor-ew-resize select-none"
            onMouseMove={handleSliderMove}
          >
            <div className="relative aspect-video">
              {/* Before Image (background) */}
              <img
                src={currentItem.beforeImage}
                alt="Antes"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* After Image (clipped) */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={currentItem.afterImage}
                  alt="Depois"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 rounded text-white text-sm font-medium">
                Antes
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-[#00D4FF]/70 rounded text-white text-sm font-medium">
                Depois
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#00D4FF]">{currentItem.category}</span>
                <h3 className="text-xl font-bold mt-1">{currentItem.title}</h3>
              </div>
              {currentItem.description && (
                <p className="text-gray-400 text-sm">{currentItem.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
