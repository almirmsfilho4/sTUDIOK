'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments } from '@/lib/firebase-services';

interface Report {
  id: string;
  type: 'weekly' | 'monthly';
  period: string;
  generatedAt: Date;
  metrics: {
    newProjects: number;
    completedProjects: number;
    revenue: number;
    newLeads: number;
    conversionRate: number;
    topServices: { name: string; count: number }[];
  };
}

export default function ReportsPage() {
  const { user, userData } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (userData?.role === 'admin') {
      loadReports();
    }
  }, [userData]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getDocuments('reports');
setReports((data as Report[]).slice(0, 12).sort((a, b) => {
  const dateA = a.generatedAt instanceof Date ? a.generatedAt : new Date(0);
  const dateB = b.generatedAt instanceof Date ? b.generatedAt : new Date(0);
  return dateB.getTime() - dateA.getTime();
 }));

      if ((data as any[])?.length === 0) {
        generateMockReports();
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      generateMockReports();
    } finally {
      setLoading(false);
    }
  };

  const generateMockReports = () => {
    const mockReports: Report[] = [
      {
        id: '1',
        type: 'weekly',
        period: '01-07 Abril 2024',
        generatedAt: new Date(),
        metrics: {
          newProjects: 12,
          completedProjects: 8,
          revenue: 28500,
          newLeads: 45,
          conversionRate: 4.8,
          topServices: [
            { name: 'Site Institucional', count: 5 },
            { name: 'E-commerce', count: 4 },
            { name: 'App Mobile', count: 3 },
          ],
        },
      },
      {
        id: '2',
        type: 'weekly',
        period: '08-14 Abril 2024',
        generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        metrics: {
          newProjects: 15,
          completedProjects: 10,
          revenue: 35200,
          newLeads: 52,
          conversionRate: 5.2,
          topServices: [
            { name: 'E-commerce', count: 6 },
            { name: 'Site Institucional', count: 5 },
            { name: 'Sistema Web', count: 4 },
          ],
        },
      },
      {
        id: '3',
        type: 'monthly',
        period: 'Abril 2024',
        generatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        metrics: {
          newProjects: 48,
          completedProjects: 35,
          revenue: 125000,
          newLeads: 180,
          conversionRate: 4.5,
          topServices: [
            { name: 'Site Institucional', count: 18 },
            { name: 'E-commerce', count: 15 },
            { name: 'App Mobile', count: 10 },
            { name: 'Sistema Web', count: 5 },
          ],
        },
      },
    ];
    setReports(mockReports);
  };

  const generateNewReport = async () => {
    setGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: Report = {
        id: Date.now().toString(),
        type: 'weekly',
        period: `${new Date().toLocaleDateString('pt-BR')} - ${new Date().toLocaleDateString('pt-BR')}`,
        generatedAt: new Date(),
        metrics: {
          newProjects: Math.floor(Math.random() * 20) + 5,
          completedProjects: Math.floor(Math.random() * 15) + 3,
          revenue: Math.floor(Math.random() * 40000) + 10000,
          newLeads: Math.floor(Math.random() * 60) + 20,
          conversionRate: 3 + Math.random() * 3,
          topServices: [
            { name: 'Site Institucional', count: Math.floor(Math.random() * 10) + 2 },
            { name: 'E-commerce', count: Math.floor(Math.random() * 8) + 1 },
            { name: 'App Mobile', count: Math.floor(Math.random() * 5) + 1 },
          ],
        },
      };

      setReports(prev => [newReport, ...prev]);
    } finally {
      setGenerating(false);
    }
  };

  if (userData?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-gray-400">Acesso restrito</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">📊 Relatórios Automáticos</h1>
            <p className="text-gray-400">Relatórios periódicos do seu negócio</p>
          </div>

          <button
            onClick={generateNewReport}
            disabled={generating}
            className="btn-primary"
          >
            {generating ? 'Gerando...' : 'Gerar Relatório'}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report.id} className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        report.type === 'weekly' 
                          ? 'bg-[#00D4FF]/20 text-[#00D4FF]' 
                          : 'bg-[#7B2CBF]/20 text-[#7B2CBF]'
                      }`}>
                        {report.type === 'weekly' ? 'Semanal' : 'Mensal'}
                      </span>
                      <h3 className="font-bold text-lg">{report.period}</h3>
                    </div>
<p className="text-sm text-gray-500 mt-1">
 Gerado em {report.generatedAt instanceof Date ? report.generatedAt.toLocaleString('pt-BR') : 'recente'}
 </p>
                  </div>
                  
                  <button className="btn-secondary text-sm">
                    📥 Baixar PDF
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
                  <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                    <p className="text-2xl font-bold text-[#00D4FF]">{report.metrics.newProjects}</p>
                    <p className="text-sm text-gray-400">Novos Projetos</p>
                  </div>
                  <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                    <p className="text-2xl font-bold text-green-500">{report.metrics.completedProjects}</p>
                    <p className="text-sm text-gray-400">Concluídos</p>
                  </div>
                  <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                    <p className="text-2xl font-bold">R$ {(report.metrics.revenue / 1000).toFixed(1)}k</p>
                    <p className="text-sm text-gray-400">Receita</p>
                  </div>
                  <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                    <p className="text-2xl font-bold text-[#7B2CBF]">{report.metrics.newLeads}</p>
                    <p className="text-sm text-gray-400">Novos Leads</p>
                  </div>
                  <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                    <p className="text-2xl font-bold text-yellow-500">{report.metrics.conversionRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-400">Conversão</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Serviços Mais Pedidos</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.metrics.topServices.map((service, i) => (
                      <span key={i} className="px-3 py-1 bg-[#1A1A1A] rounded-full text-sm">
                        {service.name} <span className="text-[#00D4FF]">({service.count})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}