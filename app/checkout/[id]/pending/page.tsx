'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentPendingPage() {
  const router = useRouter();
  const params = useParams();
  const [seconds, setSeconds] = useState(10);

useEffect(() => {
 if (seconds > 0) {
  const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
  return () => clearTimeout(timer);
 } else {
  router.push(`/checkout/${params.id}`);
 }
 return undefined;
 }, [seconds, router, params.id]);

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
            <h1 className="text-xl font-bold">Pagamento Pendente</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Pagamento em Análise ⏳</h2>
          <p className="text-gray-400 mb-8">
            Seu pagamento está sendo processado. Isso pode levar alguns minutos.
            Você será redirecionado automaticamente em {seconds} segundos.
          </p>

          <div className="card max-w-md mx-auto mb-8">
            <h3 className="font-semibold mb-4">O que está acontecendo?</h3>
            <div className="space-y-2 text-sm text-gray-400 text-left">
              <p>• Seu banco está processando a transação</p>
              <p>• Em breve receberá a confirmação</p>
              <p>• Você receberá um email quando for aprovado</p>
              <p>• Seu projeto será criado automaticamente</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push(`/checkout/${params.id}`)}
              className="btn-primary px-8 py-3"
            >
              Verificar Agora
            </button>
            <Link href="/dashboard" className="btn-secondary px-8 py-3">
              Ir para Dashboard
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Se demorar mais de 24h, entre em contato conosco
          </p>
        </div>
      </main>
    </div>
  );
}