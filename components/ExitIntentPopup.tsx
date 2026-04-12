'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ExitIntentPopupProps {
  children: React.ReactNode;
}

export default function ExitIntentPopup({ children }: ExitIntentPopupProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || user || dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowPopup(true);
      }
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollPosition > pageHeight * 0.7 && !showDiscount) {
        setShowDiscount(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    const timeout = setTimeout(() => {
      if (!user && !dismissed) {
        setShowDiscount(true);
      }
    }, 15000);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [mounted, user, dismissed, showDiscount]);

  const handleClose = () => {
    setShowPopup(false);
    setShowDiscount(false);
    setDismissed(true);
    localStorage.setItem('exit_intent_dismissed', 'true');
  };

  if (user) return <>{children}</>;

  return (
    <>
      {children}
      
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative bg-[#0A0A0A] border border-[#00D4FF] rounded-2xl p-8 max-w-md w-full animate-[scaleIn_0.3s_ease-out]">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B2CBF] flex items-center justify-center">
                <span className="text-4xl">🎁</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">
                Espere! Não vá ainda! 😢
              </h2>
              <p className="text-gray-400 mb-6">
               Temos uma oferta especial para você que nos visitou agora!
              </p>
              
              <div className="bg-[#00D4FF]/10 border border-[#00D4FF] rounded-lg p-4 mb-6">
                <p className="text-[#00D4FF] font-bold text-xl">
                  -10% OFF no seu primeiro projeto!
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Use o código: <span className="text-white font-bold">PRIMEIRA10</span>
                </p>
              </div>
              
              <div className="space-y-3">
                <a 
                  href="/orcamento"
                  className="block w-full py-3 bg-gradient-to-r from-[#00D4FF] to-[#0099cc] text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
                  onClick={handleClose}
                >
                  Garantir meu desconto
                </a>
                <button 
                  onClick={handleClose}
                  className="text-gray-400 text-sm hover:text-white"
                >
                  Não, obrigado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDiscount && !showPopup && (
        <div className="fixed bottom-4 right-4 z-40 animate-[slideIn_0.5s_ease-out]">
          <div className="bg-[#0A0A0A] border border-[#00D4FF] rounded-xl p-4 max-w-sm shadow-2xl">
            <button 
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-sm"
            >
              ✕
            </button>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00D4FF]/20 flex items-center justify-center shrink-0">
                <span>🔥</span>
              </div>
              <div>
                <p className="font-medium text-sm mb-1">
                  Oferta limitada!
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  10% de desconto para novos clientes
                </p>
                <a 
                  href="/orcamento"
                  className="text-[#00D4FF] text-sm font-medium hover:underline"
                  onClick={handleClose}
                >
                  Quero garantir →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}