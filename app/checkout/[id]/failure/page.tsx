'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentFailurePage() {
  const router = useRouter();
  const params = useParams();

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
            <h1 className="text-xl font-bold">Pagamento Não Aprovado</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Pagamento Não Processado ❌</h2>
          <p className="text-gray-400 mb-8">
            Houve um problema com o processamento do seu pagamento. 
            Você pode tentar novamente ou entrar em contato conosco.
          </p>

          <div className="card max-w-md mx-auto mb-8">
            <h3 className="font-semibold mb-4">O que fazer?</h3>
            <div className="space-y-2 text-sm text-gray-400 text-left">
              <p>• Verifique os dados do seu cartão</p>
              <p>• Tente usar outro método de pagamento</p>
              <p>• Entre em contato com seu banco</p>
              <p>• Chame nosso suporte pelo chatbot</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push(`/checkout/${params.id}`)}
              className="btn-primary px-8 py-3"
            >
              Tentar Novamente
            </button>
            <Link href="/orcamento" className="btn-secondary px-8 py-3">
              Novo Orçamento
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Problemas frequentes? WhatsApp: (11) 99999-9999
          </p>
        </div>
      </main>
    </div>
  );
}