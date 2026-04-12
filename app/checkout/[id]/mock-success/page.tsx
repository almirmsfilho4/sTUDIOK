'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getQuote, updateQuote, createProject } from '@/lib/firebase-services';
import { PRICING } from '@/lib/pricing';

export default function MockPaymentSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const processMockPayment = async () => {
      if (!user || !params.id) return;

      try {
        const quoteId = params.id as string;
        const quote = await getQuote(quoteId);
        
        if (!quote || typeof quote !== 'object') {
          throw new Error('Orçamento não encontrado');
        }

        // Create project with safe property access
        const projectType = 'projectType' in quote ? quote.projectType : 'website';
        const complexity = 'complexity' in quote ? quote.complexity : 'medium';
        const deadline = 'deadline' in quote ? quote.deadline : '15 dias';
        const price = 'price' in quote ? Number(quote.price) : 1500;
        const estimatedDays = 'estimatedDays' in quote ? Number(quote.estimatedDays) : 15;
        const features = 'features' in quote && Array.isArray(quote.features) ? quote.features : [];

        const projectId = await createProject({
          userId: user.uid,
          name: `${PRICING.projectTypes[projectType as keyof typeof PRICING.projectTypes]?.name || 'Projeto'} - ${new Date().toLocaleDateString('pt-BR')}`,
          description: `Projeto: ${projectType}, Complexidade: ${complexity}, Prazo: ${deadline}`,
          price: price,
          deadline: new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000),
          features: features,
        });

        await updateQuote(quoteId, {
          status: 'accepted',
          user_id: user.uid,
        });

        setProjectId(projectId || '');
        setLoading(false);

      } catch (err) {
        console.error('Mock payment error:', err);
        setError('Erro ao processar pagamento mock');
        setLoading(false);
      }
    };

    processMockPayment();
  }, [user, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Processando pagamento mock...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Erro no Pagamento</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => router.push(`/checkout/${params.id}`)}
            className="btn-primary px-6 py-2"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-xl font-bold">Pagamento Mock Aprovado</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Pagamento Mock Confirmado! 🎉</h2>
          <p className="text-gray-400 mb-8">
            Este é um pagamento simulado para desenvolvimento. O desenvolvimento do seu projeto já começou!
          </p>

          <div className="card max-w-md mx-auto mb-8">
            <h3 className="font-semibold mb-4">Modo Desenvolvimento</h3>
            <div className="space-y-2 text-sm text-gray-400 text-left">
              <p>✅ Pagamento simulado com sucesso</p>
              <p>✅ Projeto criado automaticamente</p>
              <p>✅ Sem integração real com Mercado Pago</p>
              <p>✅ Configure as variáveis de ambiente para produção</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary px-8 py-3">
              Ir para Dashboard
            </Link>
            {projectId && (
              <Link href={`/dashboard/projetos/${projectId}`} className="btn-secondary px-8 py-3">
                Ver Projeto
              </Link>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Em produção, esta página seria fornecida pelo Mercado Pago
          </p>
        </div>
      </main>
    </div>
  );
}