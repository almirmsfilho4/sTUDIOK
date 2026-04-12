'use client';

import { useState, useEffect } from 'react';

interface VagaCounterProps {
  totalVagas?: number;
  vagasRestantes?: number;
}

export default function VagaCounter({ 
  totalVagas = 30, 
  vagasRestantes: initialVagasRestantes = 12 
}: VagaCounterProps) {
  const [vagasRestantes, setVagasRestantes] = useState(initialVagasRestantes);
  const [isLow, setIsLow] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  
  useEffect(() => {
    const loadVagas = async () => {
      try {
        const response = await fetch('/api/vagas/contador');
        if (response.ok) {
          const data = await response.json();
          setVagasRestantes(data.vagasRestantes);
        }
      } catch (error) {
        console.error('Erro ao carregar contador de vagas:', error);
      }
    };
    
    loadVagas();
    
    const interval = setInterval(() => {
      loadVagas();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    setIsLow(vagasRestantes <= 5);
    
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev >= 59) return 0;
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [vagasRestantes]);
  
  const porcentagem = Math.round((vagasRestantes / totalVagas) * 100);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getUrgencyMessage = () => {
    if (vagasRestantes <= 3) return 'ÚLTIMAS VAGAS! Corre antes que acabem!';
    if (vagasRestantes <= 10) return 'Vagas se esgotando rapidamente!';
    return 'Oportunidade limitada!';
  };
  
  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-xl shadow-lg mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-4 h-4 rounded-full ${isLow ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`}></div>
            <span className="text-lg font-bold text-gray-800">
              {getUrgencyMessage()}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Vagas disponíveis:</span>
              <span className={`text-2xl font-bold ${isLow ? 'text-red-600 animate-bounce' : 'text-orange-600'}`}>
                {vagasRestantes}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${isLow ? 'bg-red-500' : 'bg-orange-500'} transition-all duration-1000 ease-out`}
                style={{ width: `${porcentagem}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>{vagasRestantes} restantes</span>
              <span>{totalVagas - vagasRestantes} preenchidas</span>
            </div>
          </div>
        </div>
        
        <div className="text-center border-l pl-6 md:pl-8">
          <div className="mb-2">
            <div className="text-xs text-gray-500">Tempo até próxima reserva</div>
            <div className="text-3xl font-mono font-bold text-gray-800">
              {formatTime(timer)}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Vagas preenchidas nas últimas 24h: <span className="font-bold">{Math.floor(Math.random() * 8) + 3}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
            {vagasRestantes <= 5 
              ? 'APENAS 5 VAGAS! GARANTA SUA VAGA AGORA!' 
              : 'NÃO PERCA ESTA OPORTUNIDADE!'}
          </div>
        </div>
      </div>
    </div>
  );
}