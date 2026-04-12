'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getQuote } from '@/lib/firebase-services';
import { PRICING } from '@/lib/pricing';
import CheckoutTimer from '@/components/CheckoutTimer';
import TrustBadges from '@/components/TrustBadges';
import CheckoutTrustBadges from '@/components/CheckoutTrustBadges';
import CouponField from '@/components/CouponField';

interface Quote {
  id: string;
  projectType: string;
  features: string[];
  complexity: string;
  deadline: string;
  price: number;
  estimatedDays: number;
  status: string;
}

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user, loading } = useAuth();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [paymentType, setPaymentType] = useState<'30' | '50' | '100'>('30');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=/checkout/${id}`);
    }
  }, [user, loading, router, id]);

  useEffect(() => {
    if (user && id) {
      loadQuote();
    }
  }, [user, id]);

  const loadQuote = async () => {
    try {
      const quoteData = await getQuote(id);
      if (quoteData) {
        setQuote(quoteData as Quote);
      } else {
        router.push('/orcamento');
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setLoadingQuote(false);
    }
  };

  const handlePayment = async () => {
    if (!user || !quote) return;

    setProcessing(true);
    setError('');

    try {
      let entryAmount: number;
      let paymentDescription: string;
      
      if (paymentType === '100') {
        entryAmount = quote.price * 0.9;
        paymentDescription = `Pagamento integral (10% desconto) - ${PRICING.projectTypes[quote.projectType as keyof typeof PRICING.projectTypes]?.name || quote.projectType}`;
      } else {
        entryAmount = quote.price * (paymentType === '30' ? 0.3 : 0.5);
        paymentDescription = `Entrada ${paymentType}% para ${PRICING.projectTypes[quote.projectType as keyof typeof PRICING.projectTypes]?.name || quote.projectType}`;
      }

      const response = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceAmount: entryAmount,
          projectName: paymentDescription,
          clientName: user.displayName || 'Cliente',
          clientEmail: user.email || '',
          projectId: quote.id,
          planType: quote.projectType,
          paymentType: paymentType === '100' ? 'total' : 'entrada',
        }),
      });

      const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Failed to create checkout session');
    }
  } catch (err) {
    console.error('Payment error:', err);
    setError(err instanceof Error ? err.message : 'Erro ao processar pagamento. Tente novamente.');
  } finally {
    setProcessing(false);
  }
  };

  const getProjectTypeName = () => {
    if (!quote) return '';
    return PRICING.projectTypes[quote.projectType as keyof typeof PRICING.projectTypes]?.name || quote.projectType;
  };

  const getFeatureNames = () => {
    if (!quote) return [];
    return quote.features.map(f => PRICING.features[f as keyof typeof PRICING.features] || f);
  };

  if (loading || loadingQuote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !quote) {
    return null;
  }

  const calculateDiscountedPrice = (price: number) => {
    return Math.max(0, price - discountAmount);
  };
  
  const discountedPrice = calculateDiscountedPrice(quote.price);
  const entry30 = discountedPrice * 0.3;
  const entry50 = discountedPrice * 0.5;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-[#1A1A1A] rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

<div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>
          
          <CheckoutTimer duration={30} />
          
          <div className="space-y-4 mt-6">
              <div className="flex justify-between py-3 border-b border-[#242424]">
                <span className="text-gray-400">Projeto</span>
                <span className="font-semibold">{getProjectTypeName()}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#242424]">
                <span className="text-gray-400">Complexidade</span>
                <span className="font-semibold capitalize">{quote.complexity}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#242424]">
                <span className="text-gray-400">Prazo</span>
                <span className="font-semibold">{quote.estimatedDays} dias</span>
              </div>
              <div className="py-3 border-b border-[#242424]">
                <span className="text-gray-400 block mb-2">Funcionalidades</span>
                <div className="flex flex-wrap gap-2">
                  {getFeatureNames().map((name, i) => (
                    <span key={i} className="px-3 py-1 bg-[#00D4FF]/10 text-[#00D4FF] rounded-full text-sm">
                      {name}
                    </span>
                  ))}
                  {quote.features.length === 0 && (
                    <span className="text-gray-500">Nenhuma</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-lg">Total</span>
                <span className="text-2xl font-bold text-[#00D4FF]">
                  R$ {quote.price.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Pagamento</h2>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-400 mb-4">Escolha como pagar:</p>
              
              <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentType === '30' ? 'border-[#00D4FF] bg-[#00D4FF]/10' : 'border-[#242424] hover:border-[#00D4FF]/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">Entrada 30%</span>
                    <p className="text-sm text-gray-400">Para iniciar o projeto</p>
                  </div>
                  <span className="text-xl font-bold text-[#00D4FF]">
                    R$ {entry30.toLocaleString('pt-BR')}
                  </span>
                </div>
                <input
                  type="radio"
                  name="paymentType"
                  value="30"
                  checked={paymentType === '30'}
                  onChange={() => setPaymentType('30')}
                  className="hidden"
                />
              </label>

              <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentType === '50' ? 'border-[#00D4FF] bg-[#00D4FF]/10' : 'border-[#242424] hover:border-[#00D4FF]/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">Entrada 50%</span>
                    <p className="text-sm text-gray-400">Para prioridade máxima</p>
                  </div>
                  <span className="text-xl font-bold text-[#00D4FF]">
                    R$ {entry50.toLocaleString('pt-BR')}
                  </span>
                </div>
                <input
                  type="radio"
                  name="paymentType"
                  value="50"
                  checked={paymentType === '50'}
                  onChange={() => setPaymentType('50')}
                  className="hidden"
                />
              </label>

              <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentType === '100' ? 'border-green-500 bg-green-500/10' : 'border-[#242424] hover:border-green-500/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-green-500">Pagar Valor Total</span>
                    <p className="text-sm text-gray-400">10% desconto à vista</p>
                  </div>
                  <span className="text-xl font-bold text-green-500">
                    R$ {(quote.price * 0.9).toLocaleString('pt-BR')}
                  </span>
                </div>
                <input
                  type="radio"
                  name="paymentType"
                  value="100"
                  checked={paymentType === '100'}
                  onChange={() => setPaymentType('100')}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-[#1A1A1A] p-4 rounded-lg mb-6">
              {paymentType === '100' ? (
                <p className="text-sm text-green-400 mb-2">✓ Pagamento integral com 10% desconto!</p>
              ) : (
                <p className="text-sm text-gray-400 mb-2">O restante será pago upon completion ou em parcelas.</p>
              )}
              <p className="text-xs text-gray-500">💡 Pagamento processado via Stripe</p>
            </div>

            <CheckoutTrustBadges />

            <div className="mb-6">
              <TrustBadges variant="compact" />
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              className="btn-primary w-full py-4 text-lg"
            >
              {processing ? 'Processando...' : `Pagar R$ ${(paymentType === '100' ? (quote.price * 0.9) : paymentType === '30' ? entry30 : entry50).toLocaleString('pt-BR')}`}
            </button>

            <div className="mt-4 text-center">
              <Link 
                href={`/orcamento/pdf?id=${id}`} 
                target="_blank"
                className="text-sm text-gray-400 hover:text-[#00D4FF] underline"
              >
                Ver Orçamento em PDF
              </Link>
            </div>

            <p className="text-center text-gray-500 text-sm mt-4">
              Pagamento seguro. Seus dados estão protegidos.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}