'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
        <h1 className="text-3xl font-bold mb-6 text-red-500">Erro</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-[#00D4FF] text-black px-6 py-3 rounded-lg">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Admin ESTUDIOK</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1A1A1A] p-6 rounded-lg">
          <h2 className="text-[#00D4FF] text-lg mb-2">👥 Leads</h2>
          <p className="text-4xl font-bold">{data?.leads?.total || 0}</p>
          <p className="text-sm text-gray-400 mt-2">Mês: {data?.leads?.thisMonth || 0} ({data?.leads?.trend || 0}%)</p>
        </div>
        
        <div className="bg-[#1A1A1A] p-6 rounded-lg">
          <h2 className="text-green-400 text-lg mb-2">📁 Projetos</h2>
          <p className="text-4xl font-bold">{data?.projects?.total || 0}</p>
          <p className="text-sm text-gray-400 mt-2">Ativos: {data?.projects?.active || 0} | Concluídos: {data?.projects?.completed || 0}</p>
        </div>
        
        <div className="bg-[#1A1A1A] p-6 rounded-lg">
          <h2 className="text-purple-400 text-lg mb-2">💰 Financeiro</h2>
          <p className="text-4xl font-bold">R$ {(data?.revenue?.total || 0).toLocaleString('pt-BR')}</p>
          <p className="text-sm text-gray-400 mt-2">Mês: R$ {(data?.revenue?.thisMonth || 0).toLocaleString('pt-BR')}</p>
        </div>
        
        <div className="bg-[#1A1A1A] p-6 rounded-lg">
          <h2 className="text-orange-400 text-lg mb-2">🎨 Conversão</h2>
          <p className="text-4xl font-bold">{data?.conversions?.rate || 0}%</p>
          <p className="text-sm text-gray-400 mt-2">Taxa de conversão</p>
        </div>
      </div>
      
      <div className="flex gap-4 flex-wrap">
        <button onClick={() => window.location.reload()} className="bg-[#00D4FF] text-black px-6 py-3 rounded-lg font-bold hover:opacity-90">
          🔄 Atualizar
        </button>
        <a href="/public/add-project.html" className="bg-green-500 text-black px-6 py-3 rounded-lg font-bold hover:opacity-90">
          ➕ Novo Projeto
        </a>
        <a href="/" className="bg-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90">
          🏠 Site
        </a>
      </div>
    </div>
  );
}
