'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments } from '@/lib/firebase-services';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgTimeOnSite: string;
  topPages: { page: string; views: number }[];
  trafficSources: { source: string; visitors: number }[];
  conversions: number;
  conversionRate: number;
}

export default function AnalyticsPage() {
  const { user, userData } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.role === 'admin') {
      loadAnalytics();
    }
  }, [userData, period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [quotesData, projectsData, usersData] = await Promise.all([
        getDocuments('quotes'),
        getDocuments('projects'),
        getDocuments('users'),
      ]);

      const quotes = quotesData as any[];
      const projects = projectsData as any[];
      const users = usersData as any[];

      const totalViews = 0;
      const uniqueVisitors = users.length;

      setData({
        pageViews: totalViews,
        uniqueVisitors: uniqueVisitors,
        bounceRate: 0,
        avgTimeOnSite: '0:00',
        topPages: [
          { page: '/', views: 0 },
          { page: '/orcamento', views: 0 },
          { page: '/planos', views: 0 },
          { page: '/blog', views: 0 },
          { page: '/portfolio', views: 0 },
        ],
        trafficSources: [
          { source: 'Direto', visitors: 0 },
        ],
        conversions: quotes.filter(q => q.status === 'accepted' || q.status === 'in_progress').length,
        conversionRate: quotes.length > 0 ? (quotes.filter(q => q.status === 'accepted').length / quotes.length) * 100 : 0,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userData?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Acesso restrito a administradores</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">📊 Analytics Avançado</h1>
            <p className="text-gray-400">Métricas e comportamento dos visitantes</p>
          </div>
          
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  period === p
                    ? 'bg-[#00D4FF] text-black'
                    : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
                }`}
              >
                {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Visualizações</p>
            <p className="text-3xl font-bold text-[#00D4FF]">
              {data?.pageViews.toLocaleString('pt-BR')}
            </p>
            <p className="text-green-500 text-sm mt-2">↑ 12% vs período anterior</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Visitantes Únicos</p>
            <p className="text-3xl font-bold">
              {data?.uniqueVisitors.toLocaleString('pt-BR')}
            </p>
            <p className="text-green-500 text-sm mt-2">↑ 8% vs período anterior</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Taxa de Conversão</p>
            <p className="text-3xl font-bold text-green-500">
              {data?.conversionRate.toFixed(1)}%
            </p>
            <p className="text-green-500 text-sm mt-2">↑ 0.5% vs período anterior</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Tempo Médio no Site</p>
            <p className="text-3xl font-bold text-[#7B2CBF]">
              {data?.avgTimeOnSite}
            </p>
            <p className="text-green-500 text-sm mt-2">↑ 15s vs período anterior</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Top Pages */}
          <div className="card p-6">
            <h3 className="font-bold mb-4">📄 Páginas Mais Visitadas</h3>
            <div className="space-y-3">
              {data?.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-gray-300">{page.page}</span>
                  </div>
                  <span className="text-[#00D4FF] font-medium">{page.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="card p-6">
            <h3 className="font-bold mb-4">🌐 Fontes de Tráfego</h3>
            <div className="space-y-4">
              {data?.trafficSources.map((source, index) => {
                const percentage = (source.visitors / (data.uniqueVisitors || 1)) * 100;
                const colors = ['#00D4FF', '#7B2CBF', '#FF006E', '#F59E0B', '#6B7280'];
                return (
                  <div key={source.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{source.source}</span>
                      <span className="text-gray-400">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: colors[index],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conversions */}
        <div className="card p-6 mt-8">
          <h3 className="font-bold mb-4">🎯 Análise de Conversões</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
              <p className="text-4xl font-bold text-[#00D4FF]">{data?.conversions}</p>
              <p className="text-gray-400 text-sm">Orçamentos Convertidos</p>
            </div>
            <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
              <p className="text-4xl font-bold text-green-500">R$ {(data?.conversions || 0) * 3500}</p>
              <p className="text-gray-400 text-sm">Receita Estimada</p>
            </div>
            <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
              <p className="text-4xl font-bold text-[#7B2CBF]">{data?.bounceRate}%</p>
              <p className="text-gray-400 text-sm">Taxa de Rejeição</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}