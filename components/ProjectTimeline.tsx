'use client';

import { useState, useEffect } from 'react';

interface ProjectTimelineProps {
  currentStatus: string;
  estimatedDays: number;
  startDate?: Date;
}

const stages = [
  {
    id: 'pending',
    name: 'Análise',
    description: 'Revisão dos requisitos',
    icon: '🔍',
    duration: '1-2 dias',
  },
  {
    id: 'analysis',
    name: 'Design',
    description: 'Criação do layout',
    icon: '🎨',
    duration: '2-3 dias',
  },
  {
    id: 'design',
    name: 'Desenvolvimento',
    description: 'Programação do projeto',
    icon: '💻',
    duration: '5-10 dias',
  },
  {
    id: 'development',
    name: 'Testes',
    description: 'Verificação de qualidade',
    icon: '🧪',
    duration: '1-2 dias',
  },
  {
    id: 'testing',
    name: 'Revisão',
    description: 'Ajustes finais',
    icon: '✨',
    duration: '1 dia',
  },
  {
    id: 'review',
    name: 'Entregue',
    description: 'Projeto concluído',
    icon: '🚀',
    duration: '-',
  },
];

export default function ProjectTimeline({ currentStatus, estimatedDays, startDate }: ProjectTimelineProps) {
  const [progress, setProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const stageIndex = stages.findIndex(s => s.id === currentStatus);
    setCurrentStageIndex(stageIndex >= 0 ? stageIndex : 0);
    
    const totalStages = stages.length;
    const progressPercentage = ((stageIndex + 1) / totalStages) * 100;
    setProgress(progressPercentage);
  }, [currentStatus]);

  const getStageStatus = (index: number) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'pending';
  };

  const daysRemaining = Math.max(0, estimatedDays - Math.floor((Date.now() - (startDate?.getTime() || Date.now())) / (1000 * 60 * 60 * 24)));

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">📍 Progresso do Projeto</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#00D4FF]">{Math.round(progress)}%</p>
          <p className="text-gray-400 text-sm">Concluído</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-[#1A1A1A] rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#1A1A1A]" />

        <div className="space-y-6">
          {stages.map((stage, index) => {
            const status = getStageStatus(index);
            
            return (
              <div key={stage.id} className="flex items-start gap-4 relative">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl z-10 shrink-0 transition-all ${
                    status === 'completed'
                      ? 'bg-green-500 text-white'
                      : status === 'current'
                      ? 'bg-[#00D4FF] text-black animate-pulse'
                      : 'bg-[#1A1A1A] text-gray-500'
                  }`}
                >
                  {status === 'completed' ? '✓' : stage.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold ${
                      status === 'pending' ? 'text-gray-500' : 'text-white'
                    }`}>
                      {stage.name}
                    </h4>
                    {status === 'current' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#00D4FF]/20 text-[#00D4FF]">
                        Em andamento
                      </span>
                    )}
                    {status === 'completed' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">
                        Concluído
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{stage.description}</p>
                  <p className="text-xs text-gray-500 mt-1">⏱️ {stage.duration}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 pt-6 border-t border-[#1A1A1A]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Prazo total</p>
            <p className="font-bold">{estimatedDays} dias</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Dias restantes</p>
            <p className="font-bold text-[#00D4FF]">{daysRemaining} dias</p>
          </div>
        </div>
      </div>
    </div>
  );
}