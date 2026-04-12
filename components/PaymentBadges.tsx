'use client';

import PremiumIcon from './PremiumIcon';

interface PaymentBadgesProps {
  compact?: boolean;
}

export default function PaymentBadges({ compact = false }: PaymentBadgesProps) {
  return (
    <div className={`flex items-center gap-4 ${compact ? 'justify-center' : ''}`}>
      <span className="text-gray-400 text-sm">Aceitamos</span>
      <div className="flex items-center gap-2">
        <div className="bg-green-500/20 rounded px-2 py-1 text-green-400 text-xs font-bold">
          PIX
        </div>
        <div className="bg-blue-500/20 rounded px-2 py-1 text-blue-400 text-xs font-bold">
          Visa
        </div>
        <div className="bg-red-500/20 rounded px-2 py-1 text-red-400 text-xs font-bold">
          Mastercard
        </div>
        <div className="bg-yellow-500/20 rounded px-2 py-1 text-yellow-400 text-xs font-bold">
          Boleto
        </div>
      </div>
    </div>
  );
}

export function SecureBadge() {
  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm">
      <PremiumIcon name="lock" size={16} className="text-green-500" />
      <span>Site 100% seguro. Dados criptografados.</span>
    </div>
  );
}

export function GuaranteeBadge() {
  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm">
      <PremiumIcon name="check" size={16} className="text-green-500" />
      <span>7 dias de garantia. Satisfação ou dinheiro de volta.</span>
    </div>
  );
}