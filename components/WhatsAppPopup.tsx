'use client';

import { useState, useEffect } from 'react';
import { Button, Card } from './PremiumUI';

export default function WhatsAppPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [exitIntentDetected, setExitIntentDetected] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
    }, 1000);
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const percentage = (scrollTop / scrollHeight) * 100;
      setScrollPercentage(Math.round(percentage));
    };
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setExitIntentDetected(true);
      }
    };
    
    const handleClick = () => {
      setUserInteracted(true);
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleClick);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleClick);
    };
  }, []);
  
  useEffect(() => {
    // Mostrar popup após 30 segundos OU scroll > 70% OU intenção de saída
    if (!showPopup && !userInteracted) {
      if (
        timeOnPage >= 30 || 
        scrollPercentage >= 70 || 
        exitIntentDetected
      ) {
        setTimeout(() => {
          setShowPopup(true);
        }, 1000);
      }
    }
  }, [timeOnPage, scrollPercentage, exitIntentDetected, showPopup, userInteracted]);
  
  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem('whatsapp_popup_closed', 'true');
  };
  
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Olá! Vi o site da ESTUDIOK e gostaria de mais informações sobre:\n\n• Preços\n• Prazos\n• Serviços disponíveis\n\nPoderia me ajudar?`);
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
    handleClose();
    localStorage.setItem('whatsapp_clicked', 'true');
  };
  
  const handleScheduleCall = () => {
    window.open('https://calendly.com/estudiok/15min', '_blank');
    handleClose();
  };
  
  if (!showPopup || localStorage.getItem('whatsapp_popup_closed') === 'true') {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md">
        <Card variant="gradient" className="p-6 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500 animate-pulse"></div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Content */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.461-2.39-1.468-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">
              Olá! 👋 Notamos seu interesse
            </h3>
            
            <p className="text-gray-300 mb-4">
              Você já navegou por <span className="text-green-400 font-bold">{timeOnPage} segundos</span> e viu <span className="text-green-400 font-bold">{scrollPercentage}%</span> do conteúdo.
            </p>
            
            <p className="text-gray-300 mb-6">
              Posso ajudar com dúvidas sobre <span className="text-[#00D4FF]">preços</span>, <span className="text-[#00D4FF]">prazos</span> ou <span className="text-[#00D4FF]">serviços</span>?
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="text-center p-2 bg-green-500/10 rounded-lg">
              <div className="text-sm text-green-400">⏱️ {timeOnPage}s</div>
              <div className="text-xs text-gray-400">Tempo</div>
            </div>
            <div className="text-center p-2 bg-blue-500/10 rounded-lg">
              <div className="text-sm text-blue-400">📊 {scrollPercentage}%</div>
              <div className="text-xs text-gray-400">Scroll</div>
            </div>
            <div className="text-center p-2 bg-purple-500/10 rounded-lg">
              <div className="text-sm text-purple-400">👁️ {Math.floor(timeOnPage / 10)}</div>
              <div className="text-xs text-gray-400">Interações</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="success"
              fullWidth
              size="lg"
              onClick={handleWhatsAppClick}
              icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.461-2.39-1.468-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              }
            >
              Falar no WhatsApp Agora
            </Button>
            
            <Button
              variant="secondary"
              fullWidth
              onClick={handleScheduleCall}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              Agendar Call de 15min
            </Button>
            
            <Button
              variant="ghost"
              fullWidth
              onClick={handleClose}
            >
              Continuar Navegando
            </Button>
          </div>
          
          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Resposta em menos de 5 minutos</span>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
              ⚡ 87% dos visitantes que conversam no WhatsApp fecham negócio
            </div>
          </div>
        </Card>
        
        {/* Floating Notification */}
        {timeOnPage >= 20 && !showPopup && (
          <div className="fixed bottom-4 right-4 z-40 animate-slideInRight">
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                 onClick={() => setShowPopup(true)}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.461-2.39-1.468-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              <span className="font-semibold">Fale conosco!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}