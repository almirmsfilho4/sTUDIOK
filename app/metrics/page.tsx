'use client';

import { useState, useEffect } from 'react';
import { getStats, getAllProjects, getAllUsers, getDocuments } from '@/lib/firebase-services';

interface DashboardMetrics {
  users: { total: number; new: number };
  projects: { total: number; active: number; completed: number; revenue: number };
  leads: { total: number; converted: number };
  tickets: { total: number; open: number };
  revenue: { monthly: number; yearly: number; avgProject: number };
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadMetrics();
  }, [period]);

  const loadMetrics = async () => {
    try {
      const [stats, projects, users, quotes, tickets] = await Promise.all([
        getStats(),
        getAllProjects(),
        getAllUsers(),
        getDocuments('quotes'),
        getDocuments('tickets'),
      ]);

      const completedProjects = (projects as any[]).filter(p => p.status === 'completed');
      const totalRevenue = completedProjects.reduce((acc: number, p: any) => acc + (p.price || 0), 0);

      setMetrics({
        users: {
          total: (users as any[]).length,
          new: (users as any[]).filter(u => {
            const createdAt = u.createdAt?.toDate?.();
            return createdAt && createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          }).length,
        },
        projects: {
          total: (projects as any[]).length,
          active: (projects as any[]).filter(p => p.status === 'in_progress').length,
          completed: completedProjects.length,
          revenue: totalRevenue,
        },
        leads: {
          total: (quotes as any[]).length,
          converted: (quotes as any[]).filter(q => q.status === 'completed').length,
        },
        tickets: {
          total: (tickets as any[]).length,
          open: (tickets as any[]).filter(t => t.status === 'open').length,
        },
        revenue: {
          monthly: totalRevenue / 12,
          yearly: totalRevenue,
          avgProject: totalRevenue / (completedProjects.length || 1),
        },
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const kpiCards = [
    { title: 'Total de Usuários', value: metrics?.users.total || 0, change: '+12%', color: '#00D4FF' },
    { title: 'Projetos Ativos', value: metrics?.projects.active || 0, change: '+5%', color: '#10B981' },
    { title: 'Projetos Concluídos', value: metrics?.projects.completed || 0, change: '+8%', color: '#8B5CF6' },
    { title: 'Faturamento Total', value: `R$ ${(metrics?.projects.revenue || 0).toLocaleString('pt-BR')}`, change: '+15%', color: '#F59E0B' },
    { title: 'Total de Leads', value: metrics?.leads.total || 0, change: '+20%', color: '#EC4899' },
    { title: 'Taxa de Conversão', value: `${((metrics?.leads.converted || 0) / (metrics?.leads.total || 1) * 100).toFixed(1)}%`, change: '+3%', color: '#14B8A6' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#00D4FF]">Dashboard de Métricas</h1>
            <p className="text-gray-400">Visão geral da plataforma ESTUDIOK</p>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm ${period === p ? 'bg-[#00D4FF] text-black' : 'bg-[#1A1A1A] text-gray-400 hover:text-white'}`}
              >
                {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {kpiCards.map((kpi, index) => (
            <div key={index} className="card p-4">
              <p className="text-gray-400 text-sm mb-1">{kpi.title}</p>
              <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-xs text-green-500 mt-1">{kpi.change} vs período anterior</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Projetos por Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Em Andamento', value: metrics?.projects.active || 0, color: 'bg-blue-500' },
                { label: 'Concluídos', value: metrics?.projects.completed || 0, color: 'bg-green-500' },
                { label: 'Total', value: metrics?.projects.total || 0, color: 'bg-[#00D4FF]' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="flex-1 text-gray-400">{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Métricas Financeiras</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Ticket Médio</span>
                <span className="text-[#00D4FF] font-bold">R$ {(metrics?.revenue.avgProject || 0).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Receita Mensal Média</span>
                <span className="text-green-500 font-bold">R$ {(metrics?.revenue.monthly || 0).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Receita Anual</span>
                <span className="text-yellow-500 font-bold">R$ {(metrics?.revenue.yearly || 0).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Funil de Vendas</h3>
            <div className="space-y-2">
              {[
                { stage: 'Leads', count: metrics?.leads.total || 0, rate: 100 },
                { stage: 'Orçamentos', count: Math.floor((metrics?.leads.total || 0) * 0.6), rate: 60 },
                { stage: 'Projetos', count: metrics?.projects.total || 0, rate: 40 },
                { stage: 'Concluídos', count: metrics?.projects.completed || 0, rate: 20 },
              ].map((stage, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{stage.stage}</span>
                    <span className="text-gray-400">{stage.count}</span>
                  </div>
                  <div className="w-full bg-[#242424] rounded-full h-2">
                    <div className="bg-[#00D4FF] h-2 rounded-full" style={{ width: `${stage.rate}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Suporte</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total de Tickets</span>
                <span>{metrics?.tickets.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tickets Abertos</span>
                <span className="text-yellow-500">{metrics?.tickets.open || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taxa de Resolução</span>
                <span className="text-green-500">
                  {(((metrics?.tickets.total || 0) - (metrics?.tickets.open || 0)) / (metrics?.tickets.total || 1) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}