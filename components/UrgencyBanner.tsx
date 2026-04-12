'use client';

import { useState, useEffect } from 'react';

interface UrgencyBannerProps {
  message?: string;
  showOnPages?: string[];
}

export default function UrgencyBanner({ 
  message = '🔥 30% OFF NO PRIMEIRO PROJETO! Restam apenas 8 vagas este mês',
  showOnPages = ['/', '/orcamento', '/planos'] 
}: UrgencyBannerProps) {
  const [hoursLeft, setHoursLeft] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showBanner, setShowBanner] = useState(true);

  const closeBanner = () => {
    setShowBanner(false);
  };

  useEffect(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff > 0) {
        setHoursLeft(Math.floor(diff / (1000 * 60 * 60)));
        setMinutesLeft(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        setSecondsLeft(Math.floor((diff % (1000 * 60)) / 1000));
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    const showTimeout = setTimeout(() => setShowBanner(true), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(showTimeout);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#7B2CBF] via-[#00D4FF] to-[#7B2CBF] bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-4 text-sm">
        <button onClick={closeBanner} className="absolute right-4 text-white hover:text-gray-200 font-bold text-lg">
          ✕
        </button>
        <span className="text-white font-medium">
          {message}
        </span>
        <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-lg">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-mono font-bold text-white">
            {String(hoursLeft).padStart(2, '0')}:
            {String(minutesLeft).padStart(2, '0')}:
            {String(secondsLeft).padStart(2, '0')}
          </span>
        </div>
        <a 
          href="/orcamento" 
          className="bg-white text-black px-4 py-1 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
          Agora →
        </a>
      </div>
    </div>
  );
}