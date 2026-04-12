'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card } from './PremiumUI';

interface PremiumHeroProps {
  title?: React.ReactNode;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  children?: React.ReactNode;
}

export default function PremiumHero({ title, subtitle, ctaText, ctaHref, children }: PremiumHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = [
    'sites de conversão',
    'apps mobile premium',
    'sistemas inteligentes',
    'e-commerce escalável',
    'landing pages vencedoras'
  ];
  
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  useEffect(() => {
    const currentText = texts[textIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pause = isDeleting ? 100 : 2000;
    
    const timeout = setTimeout(() => {
      if (!isDeleting && typedText === currentText) {
        setTimeout(() => setIsDeleting(true), pause);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      } else {
        setTypedText(
          isDeleting
            ? (currentText || '').substring(0, typedText.length - 1)
            : (currentText || '').substring(0, typedText.length + 1)
        );
      }
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, textIndex, texts]);
  
  const parallaxX = isMounted ? (mousePosition.x / window.innerWidth - 0.5) * 20 : 0;
  const parallaxY = isMounted ? (mousePosition.y / window.innerHeight - 0.5) * 20 : 0;
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-[#00D4FF]/10 rounded-full blur-3xl"
          style={{
            transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-[#7B2CBF]/10 rounded-full blur-3xl"
          style={{
            transform: `translate(${parallaxX * -0.5}px, ${parallaxY * -0.5}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#FF006E]/5 rounded-full blur-3xl"
          style={{
            transform: `translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        ></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-full opacity-20 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00D4FF]/20 via-[#7B2CBF]/20 to-[#FF006E]/20 border border-white/10 rounded-full mb-8 animate-pulse backdrop-blur-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-full animate-pulse"></div>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-[#7B2CBF] to-[#FF006E]">
              🚀 EXPERIÊNCIA PREMIUM
            </span>
            <div className="w-2 h-2 bg-gradient-to-r from-[#FF006E] to-[#00D4FF] rounded-full animate-pulse"></div>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <div className="text-white mb-4">TRANSFORME</div>
            <div className="relative inline-block">
              <span className="text-white">SEU NEGÓCIO EM</span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#00D4FF] via-[#7B2CBF] to-[#FF006E] rounded-full"></div>
            </div>
            <div className="mt-6">
              <span className="bg-gradient-to-r from-[#00D4FF] via-[#7B2CBF] to-[#FF006E] bg-clip-text text-transparent relative">
                {typedText}
                <span className="ml-1 w-[3px] h-12 bg-gradient-to-b from-[#00D4FF] to-[#FF006E] inline-block animate-pulse"></span>
              </span>
            </div>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Não é apenas um site. É uma <span className="text-[#00D4FF]">máquina de vendas</span> com inteligência artificial, 
            design premium e resultados comprovados. Cada pixel projetado para <span className="text-[#7B2CBF]">converter</span>.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="primary" 
              size="xl" 
              onClick={() => window.location.href = '/orcamento'}
              className="shadow-2xl shadow-[#00D4FF]/30 hover:shadow-[#00D4FF]/50 transform hover:scale-105 transition-all"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            >
              CRIAR MEU PROJETO PREMIUM
            </Button>
            
            <Button 
              variant="secondary" 
              size="xl"
              onClick={() => window.location.href = '#portfolio'}
              className="border-white/20 hover:border-[#00D4FF]/50"
            >
              <span className="flex items-center gap-2">
                VER PORTFÓLIO
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <Card variant="glass" className="p-6 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-2">48h</div>
              <div className="text-gray-400">Entrega Premium</div>
            </Card>
            
            <Card variant="glass" className="p-6 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-2">97%</div>
              <div className="text-gray-400">Taxa de Conversão</div>
            </Card>
            
            <Card variant="glass" className="p-6 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-2">∞</div>
              <div className="text-gray-400">Revisões Ilimitadas</div>
            </Card>
            
            <Card variant="glass" className="p-6 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Suporte Premium</div>
            </Card>
          </div>
          
          {/* Scroll Indicator */}
          <div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
            style={{ opacity: 1 - scrollY / 300 }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-gray-400">Descubra mais</div>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gradient-to-b from-[#00D4FF] to-[#7B2CBF] rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Noise */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]"></div>
      </div>
    </section>
  );
}