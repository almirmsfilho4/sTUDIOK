'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

function IndicacaoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      // Save to localStorage to apply discount later
      localStorage.setItem('referralCode', refCode);
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!referralCode) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="card p-8 text-center max-w-md">
          <PremiumIcon name="gift" size={64} className="text-[#00D4FF] mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Programa de Indicação ESTUDIOK</h1>
          <p className="text-gray-400 mb-6">
            Convide amigos e ganhe discounts exclusivos!
          </p>
          <Link href="/indicacao" className="btn-primary">
            Ver Programa Completo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="card p-8">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <PremiumIcon name="check" size={40} className="text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">
            Você tem um <span className="text-green-500">discount de 10%!</span>
          </h1>
          
          <p className="text-gray-400 mb-6">
            Um amigo indicou a ESTUDIOK para você! Use este discount no seu próximo projeto.
          </p>

          <div className="bg-[#050505] p-4 rounded-xl mb-6">
            <p className="text-gray-400 text-sm mb-2">Código applied:</p>
            <p className="text-2xl font-bold text-[#00D4FF]">{referralCode}</p>
          </div>

          <div className="space-y-4">
            <Link 
              href="/orcamento" 
              className="btn-primary w-full py-4 text-lg block"
            >
              fazer Orçamento com 10% off
            </Link>
            
            <Link 
              href="/cadastro?ref={referralCode}" 
              className="btn-secondary w-full py-4 block"
            >
              Criar Conta (para salvar o discount)
            </Link>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            O discount será aplicado automaticamente ao fazer seu orçamento.
          </p>
        </div>

        <div className="mt-8">
          <p className="text-gray-400 mb-4">Quer ganhar discounts também?</p>
          <Link 
            href="/indicacao" 
            className="text-[#00D4FF] hover:underline"
          >
            Participar do Programa de Indicação →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function IndicacaoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div></div>}>
      <IndicacaoContent />
    </Suspense>
  );
}