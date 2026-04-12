'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  hours?: number;
  color?: string;
}

export default function CountdownTimer({ hours = 24, color = '#8B5CF6' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400">Oferta expira em:</span>
      <div className="flex gap-1">
        <div className="bg-red-500/20 rounded-lg px-3 py-1 text-red-400 font-bold">
          {formatTime(timeLeft.hours)}h
        </div>
        <div className="bg-red-500/20 rounded-lg px-3 py-1 text-red-400 font-bold">
          {formatTime(timeLeft.minutes)}m
        </div>
        <div className="bg-red-500/20 rounded-lg px-3 py-1 text-red-400 font-bold">
          {formatTime(timeLeft.seconds)}s
        </div>
      </div>
    </div>
  );
}