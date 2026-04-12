'use client';

import { useState, useEffect } from 'react';

interface CheckoutTimerProps {
  duration?: number; // minutes
  onExpire?: () => void;
}

export default function CheckoutTimer({ duration = 30, onExpire }: CheckoutTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const savedTime = localStorage.getItem('checkout_timer');
    if (savedTime) {
      const remaining = parseInt(savedTime) - Date.now();
      if (remaining > 0) {
        setTimeLeft(Math.floor(remaining / 1000));
      } else {
        setExpired(true);
      }
    } else {
      const expiresAt = Date.now() + duration * 60 * 1000;
      localStorage.setItem('checkout_timer', expiresAt.toString());
    }

    const timer = setInterval(() => {
      const savedTime = localStorage.getItem('checkout_timer');
      if (savedTime) {
        const remaining = parseInt(savedTime) - Date.now();
        if (remaining <= 0) {
          setExpired(true);
          setTimeLeft(0);
          localStorage.removeItem('checkout_timer');
          if (onExpire) onExpire();
        } else {
          setTimeLeft(Math.floor(remaining / 1000));
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (expired) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-xl p-4 text-center">
        <p className="text-red-500 font-bold">Tempo expirado!</p>
        <p className="text-sm text-gray-400">Por favor, faça o orçamento novamente.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#7B2CBF]/20 to-[#FF006E]/20 border border-[#7B2CBF]/30 rounded-xl p-4">
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#7B2CBF]/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#7B2CBF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-400">Oferta válida por:</p>
          <p className="text-2xl font-bold text-[#7B2CBF] font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        </div>
      </div>
      <p className="text-xs text-center text-gray-500 mt-2">
        Não perca o desconto especial! ⏰
      </p>
    </div>
  );
}

export function useCheckoutTimer(durationMinutes = 30) {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const savedTime = localStorage.getItem('checkout_timer');
    if (savedTime) {
      const remaining = parseInt(savedTime) - Date.now();
      setIsValid(remaining > 0);
    } else {
      const expiresAt = Date.now() + durationMinutes * 60 * 1000;
      localStorage.setItem('checkout_timer', expiresAt.toString());
      setIsValid(true);
    }
  }, [durationMinutes]);

  const resetTimer = () => {
    const expiresAt = Date.now() + durationMinutes * 60 * 1000;
    localStorage.setItem('checkout_timer', expiresAt.toString());
    setIsValid(true);
  };

  const clearTimer = () => {
    localStorage.removeItem('checkout_timer');
  };

  return { isValid, resetTimer, clearTimer };
}