'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getProject, updateProject } from '@/lib/firebase-services';
import PremiumIcon from '@/components/PremiumIcon';

interface ProjectData {
  id: string;
  name: string;
  price: number;
  paidAmount: number;
  status: string;
  deadline?: any;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [installments, setInstallments] = useState<1 | 2 | 3>(1);

  const projectId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && projectId) {
      loadProject();
    }
  }, [user, projectId]);

  const loadProject = async () => {
    try {
      const projectData = await getProject(projectId);
      if (projectData) {
        setProject(projectData as ProjectData);
      } else {
        router.push('/dashboard/projetos');
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!project || !user) return;

    setProcessing(true);

    try {
      const remainingAmount = project.price - (project.paidAmount || 0);

      const response = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceAmount: remainingAmount / installments,
          projectName: `Pagamento restante - ${project.name} (${installments}x)`,
          clientName: user.displayName || 'Cliente',
          clientEmail: user.email || '',
          projectId: project.id,
          planType: 'remaining',
          paymentType: 'total',
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro ao criar pagamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erro ao processar pagamento.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) return null;

  const total = project.price || 0;
  const paid = project.paidAmount || 0;
  const remaining = total - paid;
  const percentPaid = total > 0 ? Math.round((paid / total) * 100) : 0;

  const installmentOptions = [
    { value: 1 as const, label: '1x', interest: 'sem juros' },
    { value: 2 as const, label: '2x', interest: 'sem juros' },
    { value: 3 as const, label: '3x', interest: 'sem juros' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/projetos/${projectId}`} className="p-2 hover:bg-[#1A1A1A] rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold">Pagamento do Projeto</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">{project.name}</h2>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progresso do pagamento</span>
              <span className="text-[#00D4FF]">{percentPaid}% pago</span>
            </div>
            <div className="h-3 bg-[#242424] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00D4FF] to-green-500 rounded-full transition-all"
                style={{ width: `${percentPaid}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-[#242424]">
              <span className="text-gray-400">Valor total do projeto</span>
              <span className="font-semibold">R$ {total.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-[#242424]">
              <span className="text-gray-400">Já pago</span>
              <span className="font-semibold text-green-500">R$ {paid.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-lg font-semibold">Restante a pagar</span>
              <span className="text-2xl font-bold text-[#00D4FF]">
                R$ {remaining.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        {remaining > 0 ? (
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Pagar Restante</h3>
            
            {/* Installments */}
            <div className="mb-6">
              <label className="text-gray-400 text-sm block mb-3">Parcelas (sem juros)</label>
              <div className="grid grid-cols-3 gap-3">
                {installmentOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setInstallments(opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      installments === opt.value 
                        ? 'border-[#00D4FF] bg-[#00D4FF]/10' 
                        : 'border-[#242424] hover:border-[#00D4FF]/50'
                    }`}
                  >
                    <span className="text-xl font-bold block">{opt.label}</span>
                    <span className="text-xs text-gray-400">{opt.interest}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#050505] rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Valor por parcela</span>
                <span className="text-2xl font-bold text-[#00D4FF]">
                  R$ {(remaining / installments).toLocaleString('pt-BR')}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Total: R$ {remaining.toLocaleString('pt-BR')} em {installments}x
              </p>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={processing}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
            >
              {processing ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <PremiumIcon name="credit-card" size={20} />
                  Pagar em {installments}x de R$ {(remaining / installments).toLocaleString('pt-BR')}
                </>
              )}
            </button>
            
            <p className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center gap-2">
              <PremiumIcon name="lock" size={14} />
              Pagamento seguro via Stripe
            </p>
          </div>
        ) : (
          <div className="card bg-green-500/10 border-green-500/30">
            <div className="text-center py-8">
              <PremiumIcon name="check" size={64} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-500 mb-2">Pagamento Concluído!</h3>
              <p className="text-gray-400">Todos os pagamentos foram realizados.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}