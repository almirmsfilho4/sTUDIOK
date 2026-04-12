'use client';

import { useState, useEffect, useRef } from 'react';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function Counter({ end, duration = 2000, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

useEffect(() => {
 const observer = new IntersectionObserver(
  (entries) => {
   const entry = entries[0];
   if (entry?.isIntersecting) {
    setIsVisible(true);
    observer.disconnect();
   }
  },
  { threshold: 0.5 }
 );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 150, suffix: '+', label: 'Projetos Entregues' },
  { value: 98, suffix: '%', label: 'Satisfação' },
  { value: 48, suffix: 'h', label: 'Tempo Médio de Entrega' },
  { value: 24, suffix: '/7', label: 'Suporte' },
];

export default function AnimatedCounters() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#00D4FF]/10 via-[#7B2CBF]/10 to-[#FF006E]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#00D4FF] mb-2">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-400 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
