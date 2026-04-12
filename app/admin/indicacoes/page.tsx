'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument, updateDocument } from '@/lib/firebase-services';
import PremiumIcon from '@/components/PremiumIcon';

interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  refereeName: string;
  refereeEmail: string;
  refereePhone: string;
  projectType?: string;
  status: 'pending' | 'converted' | 'rewarded' | 'expired';
  reward?: number;
  createdAt: any;
  convertedAt?: any;
}

const REFERRAL_CONFIG = {
  discountPercent: 10,
  bonusReferrer: 100,
  bonusReferee: 100,
  validDays: 30,
};

export default function IndicacoesPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReferral, setNewReferral] = useState({
    refereeName: '',
    refereeEmail: '',
    refereePhone: '',
    projectType: '',
  });
  const [adding, setAdding] = useState(false);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, authLoading, router]);

  useEffect(() => {
    if (user && userData?.role === 'admin') {
      loadData();
    }
  }, [user, userData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReferralLink(`${window.location.origin}/indicacao?ref=${user?.uid || 'admin'}`);
    }
  }, [user]);

  const loadData = async () => {
    try {
      const data = await getDocuments('referrals');
      setReferrals(data as Referral[]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReferral = async () => {
    if (!newReferral.refereeName || !newReferral.refereeEmail) return;
    
    setAdding(true);
    try {
      await createDocument('referrals', {
        referrerId: user?.uid || 'admin',
        referrerName: userData?.name || 'Admin',
        ...newReferral,
        status: 'pending',
        createdAt: new Date(),
      });

      alert('Indicação enviada com sucesso!');
      setShowCreateModal(false);
      setNewReferral({ refereeName: '', refereeEmail: '', refereePhone: '', projectType: '' });
      loadData();
    } catch (error) {
      console.error('Error creating referral:', error);
      alert('Erro ao criar indicação');
    } finally {
      setAdding(false);
    }
  };

  const updateStatus = async (referralId: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'converted') {
        updateData.convertedAt = new Date();
        updateData.reward = REFERRAL_CONFIG.bonusReferrer;
      }
      await updateDocument('referrals', referralId, updateData);
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const pendingReferrals = referrals.filter(r => r.status === 'pending');
  const convertedReferrals = referrals.filter(r => r.status === 'converted' || r.status === 'rewarded');
  const totalRewards = convertedReferrals.reduce((sum, r) => sum + (r.reward || 0), 0);

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
                <img src="/logo.png" alt="ESTUDIOK" className="w-20 h-20 object-contain" />
              </a>
              <div>
                <h1 className="text-xl font-bold">Programa de Indicação</h1>
                <p className="text-sm text-gray-400">Indique clientes e ganhe descontos</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PremiumIcon name="add" size={18} />
              Nova Indicação
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* How it works */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Como funciona</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center mx-auto mb-3">
                <PremiumIcon name="link" size={24} className="text-[#00D4FF]" />
              </div>
              <h4 className="font-semibold mb-1">Compartilhe</h4>
              <p className="text-sm text-gray-400">Envie seu link de indicação</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <PremiumIcon name="users" size={24} className="text-green-500" />
              </div>
              <h4 className="font-semibold mb-1">Amigo Indicado</h4>
              <p className="text-sm text-gray-400">Seu amigo ganha {REFERRAL_CONFIG.discountPercent}% desconto</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                <PremiumIcon name="gift" size={24} className="text-purple-500" />
              </div>
              <h4 className="font-semibold mb-1">Você Ganha</h4>
              <p className="text-sm text-gray-400">R$ {REFERRAL_CONFIG.bonusReferrer} de bônus por indicação</p>
            </div>
          </div>
          
          {/* Referral Link */}
          <div className="mt-6 p-4 bg-[#050505] rounded-xl">
            <label className="text-gray-400 text-sm block mb-2">Seu link de indicação:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-[#1A1A1A] border border-[#242424] rounded-xl p-3 text-white text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(referralLink);
                  alert('Link copiado!');
                }}
                className="btn-secondary px-4"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Total de Indicações</p>
            <p className="text-3xl font-bold">{referrals.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Convertidas</p>
            <p className="text-3xl font-bold text-green-500">{convertedReferrals.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Total em Prêmios</p>
            <p className="text-3xl font-bold text-purple-500">R$ {totalRewards}</p>
          </div>
        </div>

        {/* Referrals List */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Todas as Indicações</h2>
          
          {referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <PremiumIcon name="users" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma indicação ainda</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="text-[#00D4FF] hover:underline mt-2"
              >
                Criar primeira indicação
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#242424]">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Indicado por</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Cliente Indicado</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Projeto</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Prêmio</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="border-b border-[#242424]">
                      <td className="py-3 px-4">{referral.referrerName}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p>{referral.refereeName}</p>
                          <p className="text-xs text-gray-400">{referral.refereeEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{referral.projectType || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          referral.status === 'converted' || referral.status === 'rewarded' ? 'bg-green-500/20 text-green-500' :
                          referral.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {referral.status === 'converted' || referral.status === 'rewarded' ? 'Convertido' : 
                           referral.status === 'pending' ? 'Pendente' : 'Expirado'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-green-500">
                        {referral.reward ? `R$ ${referral.reward}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Nova Indicação</h2>
            <p className="text-gray-400 text-sm mb-4">
              Indique um amigo e ganha R$ {REFERRAL_CONFIG.bonusReferrer} quando ele fechar um projeto!
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Nome do amigo *</label>
                <input
                  type="text"
                  value={newReferral.refereeName}
                  onChange={(e) => setNewReferral({ ...newReferral, refereeName: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                  placeholder="Nome do cliente indicado"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Email *</label>
                <input
                  type="email"
                  value={newReferral.refereeEmail}
                  onChange={(e) => setNewReferral({ ...newReferral, refereeEmail: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Telefone</label>
                <input
                  type="tel"
                  value={newReferral.refereePhone}
                  onChange={(e) => setNewReferral({ ...newReferral, refereePhone: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Tipo de Projeto</label>
                <select
                  value={newReferral.projectType}
                  onChange={(e) => setNewReferral({ ...newReferral, projectType: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                >
                  <option value="">Selecione</option>
                  <option value="site">Site Institucional</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="app">App Mobile</option>
                  <option value="sistema">Sistema Web</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#242424] text-gray-400"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateReferral}
                disabled={!newReferral.refereeName || !newReferral.refereeEmail || adding}
                className="flex-1 btn-primary"
              >
                {adding ? 'Enviando...' : 'Enviar Indicação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}