'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get('subscription');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subscriptionId && user) {
      activateSubscription();
    }
  }, [subscriptionId, user]);

  const activateSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId,
          userId: user?.uid,
        }),
      });

      if (response.ok) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error activating subscription:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          Pagamento <span className="text-green-500">Aprovado!</span>
        </h1>
        
        <p className="text-gray-400 mb-8">
          {loading 
            ? 'Ativando sua assinatura...' 
            : 'Sua assinatura foi ativada com sucesso!'}
        </p>

        <div className="space-y-4">
          <Link 
            href="/dashboard"
            className="block w-full max-w-md mx-auto py-3 bg-[#00D4FF] text-black font-medium rounded-lg hover:bg-[#00b8e6] transition-colors"
          >
            Ir para o Dashboard
          </Link>
          
          <Link 
            href="/planos"
            className="block w-full max-w-md mx-auto py-3 border border-gray-600 text-gray-300 font-medium rounded-lg hover:border-gray-500 transition-colors"
          >
            Ver Meus Planos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-gray-400">Carregando...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
