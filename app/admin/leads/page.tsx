'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments } from '@/lib/firebase-services';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: string;
  source?: string;
  createdAt: any;
}

export default function LeadsDashboard() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, authLoading, router]);

  useEffect(() => {
    if (user && userData?.role === 'admin') {
      loadLeads();
    }
  }, [user, userData]);

  const loadLeads = async () => {
    try {
      const quotesData = await getDocuments('quotes');
      const usersData = await getDocuments('users');
      
      const allLeads: Lead[] = [];
      
      (quotesData as any[]).forEach(q => {
        allLeads.push({
          id: q.id,
          name: q.name || 'Sem nome',
          email: q.email || '',
          phone: q.phone || '',
          service: q.serviceType || q.type || 'Orçamento',
          status: q.status || 'new',
          source: 'orcamento',
          createdAt: q.createdAt || q.created_at
        });
      });

      (usersData as any[]).forEach(u => {
        if (u.role !== 'admin') {
          allLeads.push({
            id: u.id,
            name: u.name || 'Sem nome',
            email: u.email || '',
            phone: u.phone || '',
            service: 'Cadastro',
            status: 'registered',
            source: 'cadastro',
            createdAt: u.createdAt
          });
        }
      });

      setLeads(allLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(l => l.source === filter);

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Serviço', 'Status', 'Data'];
    const rows = filteredLeads.map(l => [
      l.name,
      l.email,
      l.phone,
      l.service,
      l.status,
      l.createdAt?.toDate ? l.createdAt.toDate().toLocaleDateString('pt-BR') : ''
    ]);
    
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-500',
    pending: 'bg-yellow-500/20 text-yellow-500',
    contacted: 'bg-purple-500/20 text-purple-500',
    converted: 'bg-green-500/20 text-green-500',
    lost: 'bg-red-500/20 text-red-500',
    registered: 'bg-[#00D4FF]/20 text-[#00D4FF]'
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/admin" className="flex items-center gap-2">
                <img 
                  src="/logo.png" 
                  alt="ESTUDIOK Logo"
                  className="w-20 h-20 object-contain"
                />
              </a>
              <div>
                <h1 className="text-xl font-bold">Leads</h1>
                <p className="text-sm text-gray-400">{leads.length} leads captados</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={exportToCSV} className="btn-secondary text-sm">
                Exportar CSV
              </button>
              <a href="/admin" className="text-[#00D4FF] hover:underline">
                Voltar
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6">
          {['all', 'orcamento', 'cadastro'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === f 
                  ? 'bg-[#00D4FF] text-black' 
                  : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#242424]'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'orcamento' ? 'Orçamentos' : 'Cadastros'}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0A0A0A]">
                <tr>
                  <th className="text-left p-4 text-sm text-gray-400">Nome</th>
                  <th className="text-left p-4 text-sm text-gray-400">Email</th>
                  <th className="text-left p-4 text-sm text-gray-400">Telefone</th>
                  <th className="text-left p-4 text-sm text-gray-400">Serviço</th>
                  <th className="text-left p-4 text-sm text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm text-gray-400">Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="border-t border-[#1A1A1A] hover:bg-[#1A1A1A]/50">
                    <td className="p-4 font-medium">{lead.name}</td>
                    <td className="p-4 text-gray-400">{lead.email}</td>
                    <td className="p-4 text-gray-400">{lead.phone}</td>
                    <td className="p-4">{lead.service}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[lead.status] || 'bg-gray-500/20 text-gray-500'}`}>
                        {lead.status === 'new' ? 'Novo' : 
                         lead.status === 'pending' ? 'Pendente' :
                         lead.status === 'contacted' ? 'Contatado' :
                         lead.status === 'converted' ? 'Convertido' :
                         lead.status === 'registered' ? 'Cadastrado' : 'Perdido'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      {lead.createdAt?.toDate 
                        ? lead.createdAt.toDate().toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
