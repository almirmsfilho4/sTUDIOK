'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { updateDocument, createProject, getQuote, updateProject, getProject } from '@/lib/firebase-services';
import { retrieveCheckoutSession } from '@/lib/stripe';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        
        if (sessionId) {
          const session = await retrieveCheckoutSession(sessionId);
          
          if (session.payment_status === 'paid') {
            const id = window.location.pathname.split('/')[2];
            const amountPaid = session.amount_total ? session.amount_total / 100 : 0;
            setAmount(amountPaid);
            
            if (id && user) {
              // Check if it's an existing project (payment remaining) or a new quote
              const existingProject = await getProject(id);
              
              if (existingProject) {
                // It's an existing project - update paidAmount
                const currentPaid = (existingProject as any).paidAmount || 0;
                await updateProject(id, {
                  paidAmount: currentPaid + amountPaid,
                });
                setStatus('success');
              } else {
                // It's a new quote - create project
                await updateDocument('quotes', id, {
                  status: 'accepted',
                  paymentId: sessionId,
                  paymentStatus: 'paid',
                  paidAt: new Date(),
                });

                const quoteData = await getQuote(id);
                if (quoteData) {
                  const quote = quoteData as any;
                  const projectType = quote.projectType || 'site';
                  
                  const estimatedDays = projectType === 'app' ? 14 : projectType === 'sistema' ? 21 : projectType === 'ecommerce' ? 10 : 7;
                  
                  await createProject({
                    userId: user.uid,
                    name: `${quote.projectType} - ${new Date().toLocaleDateString('pt-BR')}`,
                    description: `Complexidade: ${quote.complexity} | Prazo: ${quote.deadline}`,
                    price: quote.price || 0,
                    paidAmount: amountPaid,
                    deadline: new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000),
                    features: quote.features || [],
                  });
                  
                  setStatus('success');
                }
              }
            }
          } else {
            setStatus('error');
          }
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Confirmando pagamento...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Pagamento não confirmado</h1>
          <p className="text-gray-400 mb-8">Houve um problema ao confirmar seu pagamento.</p>
          <Link href="/dashboard" className="bg-[#00D4FF] hover:opacity-90 text-black px-8 py-3 rounded-xl font-bold">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2">
            ← Voltar ao Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Pagamento Confirmado! 🎉</h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Seu pagamento foi aprovado com sucesso!
          </p>

          <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-md mx-auto mb-8">
            <div className="text-left space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-500 font-bold">✓ Aprovado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pagamento:</span>
                <span className="text-white">Stripe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valor pago:</span>
                <span className="text-white font-bold">R$ {amount.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Data:</span>
                <span className="text-white">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-400 mb-8">
            Nossa equipe foi notificada e已经开始 o desenvolvimento do seu projeto!
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/dashboard" className="bg-[#00D4FF] hover:opacity-90 text-black px-8 py-3 rounded-xl font-bold">
              Ver Meus Projetos
            </Link>
            <Link href="/" className="bg-[#1A1A1A] hover:bg-[#242424] text-white px-8 py-3 rounded-xl font-bold">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}