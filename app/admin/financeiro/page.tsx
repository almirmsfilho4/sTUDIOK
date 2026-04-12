'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments } from '@/lib/firebase-services';

interface FinanceData {
  revenue: {
    total: number;
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  subscriptions: {
    active: number;
    churned: number;
    mrr: number;
  };
  projects: {
    total: number;
    completed: number;
    inProgress: number;
  };
  expenses: {
    total: number;
    categories: { name: string; value: number }[];
  };
  byMonth: { month: string; revenue: number; expenses: number }[];
}

export default function FinanceDashboard() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [data, setData] = useState<FinanceData | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, authLoading, router]);

  useEffect(() => {
    if (user && userData?.role === 'admin') {
      loadFinanceData();
    }
  }, [user, userData]);

  const loadFinanceData = async () => {
    try {
      const [quotesData, projectsData, subscriptionsData] = await Promise.all([
        getDocuments('quotes'),
        getDocuments('projects'),
        getDocuments('subscriptions')
      ]);

      const quotes = quotesData as any[];
      const projects = projectsData as any[];
      setProjects(projects);
      const subscriptions = subscriptionsData as any[];

      // Calculate real revenue from projects (paid amounts)
      const projectRevenue = projects.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
      const pendingPayments = projects.reduce((sum, p) => sum + ((p.price || 0) - (p.paidAmount || 0)), 0);
      
      const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
      const subscriptionRevenue = activeSubscriptions.reduce((sum, s) => sum + (s.price || 0), 0);
      const mrr = subscriptionRevenue;

      setData({
        revenue: {
          total: projectRevenue + (mrr * 12),
          monthly: projectRevenue + mrr,
          quarterly: (projectRevenue + mrr) * 3,
          yearly: (projectRevenue + mrr) * 12
        },
        subscriptions: {
          active: activeSubscriptions.length,
          churned: subscriptions.filter(s => s.status === 'cancelled').length,
          mrr
        },
        projects: {
          total: projects.length,
          completed: projects.filter(p => p.status === 'completed').length,
          inProgress: projects.filter(p => p.status === 'in_progress').length
        },
        expenses: {
          total: 2500,
          categories: [
            { name: 'Hosting', value: 500 },
            { name: 'Domínios', value: 300 },
            { name: 'Software', value: 700 },
            { name: 'Marketing', value: 1000 }
          ]
        },
        byMonth: [
          { month: 'Jan', revenue: 15000, expenses: 2000 },
          { month: 'Fev', revenue: 18500, expenses: 2500 },
          { month: 'Mar', revenue: 22000, expenses: 2200 },
          { month: 'Abr', revenue: 19800, expenses: 2800 }
        ]
      });

      // Update global stats
      // Note: Main admin page has its own stats management
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const periodRevenue = period === 'month' ? data?.revenue.monthly : period === 'quarter' ? data?.revenue.quarterly : data?.revenue.yearly;
  const revenue = periodRevenue || 0;
  const profit = revenue - (data?.expenses.total || 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/admin" className="flex items-center gap-2">
                <img src="/logo.png" alt="ESTUDIOK" className="w-20 h-20 object-contain" />
              </a>
              <div>
                <h1 className="text-xl font-bold">Financeiro</h1>
                <p className="text-sm text-gray-400">Dashboard financeiro completo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="/admin" className="text-[#00D4FF] hover:underline">Voltar</a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Filter */}
        <div className="flex gap-2 mb-8">
          {(['month', 'quarter', 'year'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-full text-sm ${
                period === p ? 'bg-[#00D4FF] text-black' : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#242424]'
              }`}
            >
              {p === 'month' ? 'Mês' : p === 'quarter' ? 'Trimestre' : 'Ano'}
            </button>
          ))}
        </div>

        {/* Revenue Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Receita Total</p>
            <p className="text-3xl font-bold text-[#00D4FF]">{formatCurrency(data?.revenue.total || 0)}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Receita ({period})</p>
            <p className="text-3xl font-bold text-green-500">{formatCurrency(revenue)}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Despesas</p>
            <p className="text-3xl font-bold text-red-500">{formatCurrency(data?.expenses.total || 0)}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Lucro ({period})</p>
            <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(profit)}
            </p>
          </div>
        </div>

        {/* Subscriptions & Projects */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Assinaturas</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#00D4FF]">{data?.subscriptions.active || 0}</p>
                <p className="text-sm text-gray-400">Ativas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">{data?.subscriptions.mrr || 0}</p>
                <p className="text-sm text-gray-400">MRR</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">{data?.subscriptions.churned || 0}</p>
                <p className="text-sm text-gray-400">Canceladas</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Projetos</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{data?.projects.total || 0}</p>
                <p className="text-sm text-gray-400">Total</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">{data?.projects.completed || 0}</p>
                <p className="text-sm text-gray-400">Concluídos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">{data?.projects.inProgress || 0}</p>
                <p className="text-sm text-gray-400">Em Andamento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4">Despesas por Categoria</h3>
          <div className="space-y-4">
            {data?.expenses.categories.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{cat.name}</span>
                  <span className="text-gray-400">{formatCurrency(cat.value)}</span>
                </div>
                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF]"
                    style={{ width: `${(cat.value / data.expenses.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payments Overview */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Pagamentos Recebidos</h3>
            <p className="text-3xl font-bold text-green-500">
              R$ {projects.reduce((sum: number, p: any) => sum + (p.paidAmount || 0), 0).toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-400 mt-2">Total de todos os projetos</p>
          </div>
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Pagamentos Pendentes</h3>
            <p className="text-3xl font-bold text-yellow-500">
              R$ {projects.reduce((sum: number, p: any) => sum + ((p.price || 0) - (p.paidAmount || 0)), 0).toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-gray-400 mt-2">A receber de clientes</p>
          </div>
        </div>
      </main>
    </div>
  );
}
