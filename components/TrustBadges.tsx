'use client';

import { useState, useEffect } from 'react';
import PremiumIcon from './PremiumIcon';

interface TrustBadge {
  icon: string;
  title: string;
  description: string;
}

const trustBadges: TrustBadge[] = [
  {
    icon: 'lock',
    title: 'Segurança SSL',
    description: 'Seus dados protegidos com criptografia'
  },
  {
    icon: 'lightning',
    title: 'Entrega Rápida',
    description: 'Projeto pronto em até 7 dias'
  },
  {
    icon: 'star',
    title: '98% Satisfação',
    description: 'Clientes satisfeitos'
  },
  {
    icon: 'credit-card',
    title: 'Pagamento Seguro',
    description: 'Mercado Pago certificado'
  },
  {
    icon: 'target',
    title: 'Alta Conversão',
    description: 'Sites otimizados para vender'
  },
  {
    icon: 'users',
    title: 'Suporte Dedicado',
    description: 'Equipe sempre disponível'
  },
];

interface TrustBadgesProps {
  variant?: 'full' | 'compact';
}

export default function TrustBadges({ variant = 'full' }: TrustBadgesProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

if (variant === 'compact') {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {trustBadges.slice(0, 4).map((badge, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <PremiumIcon name={badge.icon as any} size={18} className="text-green-500" />
          <span className="text-gray-400">{badge.title}</span>
        </div>
      ))}
    </div>
  );
}

return (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    {trustBadges.map((badge, index) => (
      <div
        key={index}
        className="text-center p-4 rounded-xl bg-[#0A0A0A]/50 hover:bg-[#0A0A0A] transition-colors"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
          <PremiumIcon name={badge.icon as any} size={24} className="text-green-500" />
        </div>
        <h4 className="font-semibold text-sm mb-1">{badge.title}</h4>
        <p className="text-xs text-gray-500">{badge.description}</p>
      </div>
    ))}
  </div>
);
}

export function FloatingTrustBadge() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !visible) return null;

return (
    <div className="fixed bottom-4 left-4 z-30 animate-[slideIn_0.5s_ease-out]">
    <div className="bg-[#0A0A0A] border border-green-500/30 rounded-xl p-3 flex items-center gap-3 shadow-lg">
      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
        <PremiumIcon name="check" size={20} className="text-green-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-white">Site seguro SSL</p>
        <p className="text-xs text-gray-400">Pagamento protegido</p>
      </div>
    </div>
  </div>
);
}