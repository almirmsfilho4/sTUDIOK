'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

type PlanType = { id: string; name: string; price: number; period: string; color: string; features: string[]; popular?: boolean };

const getPlan = (id: string): PlanType => {
  if (id === 'starter') return { id: 'starter', name: 'Starter', price: 97, period: 'mês', color: '#22C55E', features: ['5 posts/mês', '1 canal (Instagram)', 'Gerador de legendas IA', 'Agendamento básico', 'Estatísticas simples'] };
  if (id === 'agency') return { id: 'agency', name: 'Assinatura', price: 497, period: 'mês', color: '#F59E0B', features: ['Tudo do Profissional', '5 sub-contas', 'API aberta', 'White-label', 'Gerente dedicado', 'Treinamento'] };
  return { id: 'pro', name: 'Profissional', price: 197, period: 'mês', color: '#8B5CF6', features: ['Posts ilimitados', 'Todos os canais', 'IA completa', 'Agendamento automático', 'Relatórios avançados', 'Suporte prioritário'], popular: true };
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'pro';
  const plan = getPlan(planId);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    if (!email || !name) {
      setError('Preencha seu nome e email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          price: plan.price,
          period: plan.period,
          email,
          name,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erro ao criar assinatura. Tente novamente.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Plano Selecionado</h2>
        <div className="text-center mb-6 p-6 bg-[#050505] rounded-2xl">
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <div className="flex items-end justify-center gap-1">
            <span className="text-4xl font-black" style={{ color: plan.color }}>R$ {plan.price}</span>
            <span className="text-gray-400 mb-1">/{plan.period}</span>
          </div>
        </div>
        <ul className="space-y-3">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-gray-300">
              <PremiumIcon name="check" size={16} className="text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Seus Dados</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-gray-400 text-sm block mb-2">Nome completo</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-white" placeholder="Seu nome" />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-white" placeholder="seu@email.com" />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-gray-400 text-sm block mb-3">Forma de Pagamento</label>
          <div className="grid grid-cols-2 gap-3">
            {(['pix', 'card'] as const).map((method) => (
              <button key={method} onClick={() => setPaymentMethod(method)} className={`p-4 rounded-xl border text-center transition-all ${paymentMethod === method ? 'border-green-500 bg-green-500/10' : 'border-white/10 hover:border-white/30'}`}>
                <span className="text-2xl block mb-1">{method === 'pix' ? '📱' : '💳'}</span>
                <span className="text-white text-sm font-medium">{method === 'pix' ? 'PIX' : 'Cartão'}</span>
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm">{error}</div>}

        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <p className="text-green-500 text-sm">🔒 Pagamento seguro via Stripe</p>
        </div>

        <button onClick={handleSubscribe} disabled={loading} className="w-full bg-[#8B5CF6] hover:opacity-90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><PremiumIcon name="lock" size={18} /> Assinar por R$ {plan.price}/{plan.period}</>}
        </button>

        <p className="text-gray-500 text-xs text-center mt-4">Cancele a qualquer momento. Primeiro mês com 7 dias de garantia.</p>
      </div>
    </div>
  );
}

export default function MarketingCheckoutPage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="ESTUDIOK" className="h-12" />
          </Link>
        </div>
      </nav>

      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Link href="/marketing" className="text-gray-400 hover:text-white flex items-center gap-2">
              <PremiumIcon name="arrow-right" size={16} className="rotate-180" />
              Voltar aos planos
            </Link>
          </div>

          <Suspense fallback={<div className="text-white text-center py-20">Carregando...</div>}>
            <CheckoutContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}