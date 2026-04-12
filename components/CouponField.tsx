'use client';

import { useState, useEffect } from 'react';

interface CouponFieldProps {
  onApplyCoupon: (code: string) => Promise<{
    success: boolean;
    discountAmount: number;
    finalAmount: number;
    error?: string;
  }>;
  onRemoveCoupon: () => void;
  currentAmount: number;
  appliedCoupon?: string;
}

export default function CouponField({ 
  onApplyCoupon, 
  onRemoveCoupon, 
  currentAmount,
  appliedCoupon 
}: CouponFieldProps) {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<{
    discountAmount: number;
    finalAmount: number;
  } | null>(null);
  
  const [availableCoupons] = useState([
    { code: 'ESTUDIOK30', discount: '30% OFF', description: 'Para novos clientes' },
    { code: 'LANÇAMENTO', discount: '25% OFF', description: 'Lançamento especial' },
    { code: 'PRIMEIROPROJETO', discount: '35% OFF', description: 'Primeiro projeto' },
    { code: 'SITE1500', discount: 'R$ 1.500 OFF', description: 'Para sites acima de R$ 5.000' }
  ]);
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  
  useEffect(() => {
    if (timeLeft > 0 && !appliedCoupon) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [timeLeft, appliedCoupon]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Digite um código de cupom');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const result = await onApplyCoupon(couponCode.toUpperCase());
      
      if (result.success) {
        setSuccess(true);
        setDiscountInfo({
          discountAmount: result.discountAmount,
          finalAmount: result.finalAmount
        });
        setCouponCode('');
        setShowSuggestions(false);
      } else {
        setError(result.error || 'Cupom inválido');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao aplicar cupom');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    setDiscountInfo(null);
    setSuccess(false);
    setError('');
    setCouponCode('');
  };
  
  const handleSuggestionClick = (code: string) => {
    setCouponCode(code);
    setShowSuggestions(false);
  };
  
  return (
    <div className="space-y-4">
      {/* Discount Timer Banner */}
      {!appliedCoupon && timeLeft > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-lg animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-bold">TEMPO LIMITADO!</div>
                <div className="text-sm">Use um cupom antes que o tempo acabe</div>
              </div>
            </div>
            <div className="text-2xl font-mono font-bold bg-black/30 px-3 py-1 rounded">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      )}
      
      {/* Applied Coupon Display */}
      {appliedCoupon && discountInfo && (
        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-green-400">CUPOM APLICADO!</div>
                  <div className="text-sm text-green-300">{appliedCoupon}</div>
                </div>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-sm text-gray-300 hover:text-white"
            >
              Remover
            </button>
          </div>
          
          <div className="mt-3 pt-3 border-t border-green-500/30">
            <div className="flex justify-between text-sm">
              <span>Valor original:</span>
              <span className="line-through text-gray-400">R$ {currentAmount.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Desconto:</span>
              <span className="text-green-400 font-bold">- R$ {discountInfo.discountAmount.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between text-lg mt-2">
              <span>Novo total:</span>
              <span className="font-bold text-green-400">R$ {discountInfo.finalAmount.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Coupon Input */}
      {!appliedCoupon && (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Tem um cupom de desconto?</h3>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-sm text-[#00D4FF] hover:text-[#00D4FF]/80"
            >
              {showSuggestions ? 'Ocultar' : 'Ver sugestões'}
            </button>
          </div>
          
          {/* Available Coupons */}
          {showSuggestions && (
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Cupons disponíveis:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableCoupons.map((coupon) => (
                  <button
                    key={coupon.code}
                    onClick={() => handleSuggestionClick(coupon.code)}
                    className="text-left p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg border border-gray-700 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{coupon.code}</div>
                        <div className="text-xs text-gray-400">{coupon.description}</div>
                      </div>
                      <div className="px-3 py-1 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-white text-xs font-bold rounded-full">
                        {coupon.discount}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input Field */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Digite seu código de cupom"
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] outline-none transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              
              {couponCode && (
                <button
                  onClick={() => setCouponCode('')}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            
            <button
              onClick={handleApplyCoupon}
              disabled={loading || !couponCode.trim()}
              className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Aplicando...
                </div>
              ) : (
                'Aplicar Cupom'
              )}
            </button>
          </div>
          
          {/* Error/Success Messages */}
          {error && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {success && (
            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cupom aplicado com sucesso! Desconto de R$ {discountInfo?.discountAmount.toLocaleString('pt-BR')}
              </div>
            </div>
          )}
          
          {/* Info */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="text-sm text-gray-400 space-y-1">
              <p>💡 Cupons são aplicados antes do cálculo de parcelas</p>
              <p>📝 Desconto máximo de 35% por compra</p>
              <p>⏰ Alguns cupons têm validade limitada</p>
              <p>🔒 Cupom aplicado apenas após confirmação</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}