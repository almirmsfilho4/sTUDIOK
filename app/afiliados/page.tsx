'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument, updateDocument } from '@/lib/firebase-services';

interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  pendingPayment: number;
}

interface AffiliateLink {
  id: string;
  code: string;
  clicks: number;
  conversions: number;
  earnings: number;
}

export default function AffiliatePage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AffiliateStats>({
    totalClicks: 0,
    totalConversions: 0,
    totalEarnings: 0,
    pendingPayment: 0
  });
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [affiliateCode, setAffiliateCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/afiliados');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadAffiliateData();
    }
  }, [user]);

  const loadAffiliateData = async () => {
    try {
      const data = await getDocuments('affiliates');
      const userAffiliate = (data as any[]).find(a => a.userId === user?.uid);
      
      if (userAffiliate) {
        setAffiliateCode(userAffiliate.code);
        setStats({
          totalClicks: userAffiliate.clicks || 0,
          totalConversions: userAffiliate.conversions || 0,
          totalEarnings: userAffiliate.earnings || 0,
          pendingPayment: userAffiliate.earnings || 0
        });
      } else {
        const newCode = `AF${user?.uid?.slice(0, 8).toUpperCase()}`;
        await createDocument('affiliates', {
          userId: user?.uid,
          code: newCode,
          clicks: 0,
          conversions: 0,
          earnings: 0,
          createdAt: new Date()
        });
        setAffiliateCode(newCode);
      }
    } catch (error) {
      console.error('Error loading affiliate data:', error);
    }
  };

  const affiliateLink = `https://estudiok.com/?ref=${affiliateCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2">
              <img src="/logo.png" alt="ESTUDIOK" className="w-12 h-12 object-contain" />
            </button>
            <span className="font-bold text-xl">Programa de Afiliados</span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Ganhe Dinheiro <span className="text-[#00D4FF]">Indicando</span>
            </h1>
            <p className="text-gray-400">
              Compartilhe seu link único e receba comissões por cada venda realizada
            </p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <div className="card p-6 text-center">
              <p className="text-gray-400 text-sm">Total de Cliques</p>
              <p className="text-3xl font-bold text-[#00D4FF]">{stats.totalClicks}</p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-gray-400 text-sm">Conversões</p>
              <p className="text-3xl font-bold text-green-500">{stats.totalConversions}</p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-gray-400 text-sm">Total Ganho</p>
              <p className="text-3xl font-bold text-green-500">R$ {stats.totalEarnings.toFixed(2)}</p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-gray-400 text-sm">Pendente</p>
              <p className="text-3xl font-bold text-yellow-500">R$ {stats.pendingPayment.toFixed(2)}</p>
            </div>
          </div>

          {/* Affiliate Link */}
          <div className="card p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Seu Link de Afiliado</h2>
            <p className="text-gray-400 text-sm mb-4">
              Compartilhe este link nas suas redes sociais, blog ou envie para clientes.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={affiliateLink}
                readOnly
                className="input-field flex-1"
              />
              <button onClick={copyLink} className="btn-primary">
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Código: <span className="text-[#00D4FF]">{affiliateCode}</span>
            </p>
          </div>

          {/* How it works */}
          <div className="card p-8">
            <h2 className="text-xl font-bold mb-6">Como Funciona</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#00D4FF]/20 flex items-center justify-center">
                  <span className="text-2xl">1</span>
                </div>
                <h3 className="font-bold mb-2">Compartilhe</h3>
                <p className="text-gray-400 text-sm">
                  Compartilhe seu link único com sua rede
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#00D4FF]/20 flex items-center justify-center">
                  <span className="text-2xl">2</span>
                </div>
                <h3 className="font-bold mb-2">Cliente Compra</h3>
                <p className="text-gray-400 text-sm">
                  Quando alguém contrata através do seu link
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#00D4FF]/20 flex items-center justify-center">
                  <span className="text-2xl">3</span>
                </div>
                <h3 className="font-bold mb-2">Você Ganha</h3>
                <p className="text-gray-400 text-sm">
                  Receba 10% de comissão em todas as vendas
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
