'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, getUserSubscriptions, createSubscription } from '@/lib/firebase-services';
import PremiumIcon from '@/components/PremiumIcon';

interface Subscription {
  id: string;
  user_id: string;
  project_id: string;
  plan: 'basic' | 'professional' | 'premium';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  status: string;
  startDate: any;
  endDate: any;
  createdAt: any;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  user_id: string;
}

const PLANS = {
  basic: {
    name: 'Básico',
    price: 197,
    features: ['Correções de bugs', 'Atualizações de segurança', 'Suporte por email', '1 hora/mês de ajustes'],
  },
  professional: {
    name: 'Profissional',
    price: 497,
    features: ['Tudo do Básico', 'Atualizações de conteúdo', 'Suporte priority', '5 horas/mês de ajustes', 'Relatório mensal'],
  },
  premium: {
    name: 'Premium',
    price: 997,
    features: ['Tudo do Profissional', 'Desenvolvimento de novas features', 'Suporte 24/7', '15 horas/mês', 'infraestrutura inclusa'],
  },
};

export default function SubscriptionsPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'professional' | 'premium'>('professional');
  const [selectedProject, setSelectedProject] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [creating, setCreating] = useState(false);

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

  const loadData = async () => {
    try {
      const [subsData, usersData, projectsData] = await Promise.all([
        getDocuments('subscriptions'),
        getDocuments('users'),
        getDocuments('projects'),
      ]);
      setSubscriptions(subsData as Subscription[]);
      setUsers(usersData as User[]);
      setProjects(projectsData as Project[]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubscription = async () => {
    if (!selectedProject) return;
    
    setCreating(true);
    try {
      const project = projects.find(p => p.id === selectedProject);
      const projectUsers = users.find(u => u.id === project?.user_id);
      
      const plan = PLANS[selectedPlan];
      const price = billingCycle === 'yearly' 
        ? plan.price * 12 * 0.8 
        : plan.price;

      await createSubscription({
        userId: project?.user_id || '',
        projectId: selectedProject,
        plan: selectedPlan,
        price,
        billingCycle,
      });

      alert('Assinatura criada com sucesso!');
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Erro ao criar assinatura');
    } finally {
      setCreating(false);
    }
  };

  const getUserName = (userId: string) => {
    const u = users.find(user => user.id === userId);
    return u?.name || 'Cliente';
  };

  const getProjectName = (projectId: string) => {
    const p = projects.find(project => project.id === projectId);
    return p?.name || 'Projeto';
  };

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const totalMRR = activeSubscriptions.reduce((sum, s) => sum + (s.price || 0), 0);

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
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <img src="/logo.png" alt="ESTUDIOK" className="w-20 h-20 object-contain" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Assinaturas & Manutenção</h1>
            <p className="text-sm text-gray-400">Planos de manutenção recorrente</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PremiumIcon name="add" size={18} />
              Nova Assinatura
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Assinaturas Ativas</p>
            <p className="text-3xl font-bold text-[#00D4FF]">{activeSubscriptions.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Receita Mensal (MRR)</p>
            <p className="text-3xl font-bold text-green-500">R$ {totalMRR.toLocaleString('pt-BR')}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Total de Assinaturas</p>
            <p className="text-3xl font-bold">{subscriptions.length}</p>
          </div>
        </div>

        {/* Plans Info */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div key={key} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <span className="px-2 py-1 bg-[#00D4FF]/20 text-[#00D4FF] text-xs rounded-full">
                  R$ {plan.price}/mês
                </span>
              </div>
              <ul className="space-y-2">
                {plan.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                    <PremiumIcon name="check" size={14} className="text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Subscriptions List */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Assinaturas Ativas</h2>
          
          {subscriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <PremiumIcon name="file" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma assinatura encontrada</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="text-[#00D4FF] hover:underline mt-2"
              >
                Criar primeira assinatura
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#242424]">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Cliente</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Projeto</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Plano</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Valor</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Ciclo</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-[#242424]">
                      <td className="py-3 px-4">{getUserName(sub.user_id)}</td>
                      <td className="py-3 px-4">{getProjectName(sub.project_id)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          sub.plan === 'premium' ? 'bg-purple-500/20 text-purple-500' :
                          sub.plan === 'professional' ? 'bg-[#00D4FF]/20 text-[#00D4FF]' :
                          'bg-gray-500/20 text-gray-500'
                        }`}>
                          {PLANS[sub.plan as keyof typeof PLANS]?.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-green-500">R$ {sub.price?.toLocaleString('pt-BR')}</td>
                      <td className="py-3 px-4">{sub.billingCycle === 'monthly' ? 'Mensal' : 'Anual'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          sub.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {sub.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
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
          <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Criar Assinatura</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Selecionar Projeto</label>
                <select 
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                >
                  <option value="">Selecione um projeto</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Plano</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['basic', 'professional', 'premium'] as const).map(plan => (
                    <button
                      key={plan}
                      onClick={() => setSelectedPlan(plan)}
                      className={`p-3 rounded-xl border-2 text-center ${
                        selectedPlan === plan 
                          ? 'border-[#00D4FF] bg-[#00D4FF]/10' 
                          : 'border-[#242424]'
                      }`}
                    >
                      <span className="block text-sm font-bold">{PLANS[plan].name}</span>
                      <span className="text-xs text-gray-400">R$ {PLANS[plan].price}/mês</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Ciclo de Cobrança</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`p-3 rounded-xl border-2 text-center ${
                      billingCycle === 'monthly' 
                        ? 'border-[#00D4FF] bg-[#00D4FF]/10' 
                        : 'border-[#242424]'
                    }`}
                  >
                    <span className="block text-sm font-bold">Mensal</span>
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`p-3 rounded-xl border-2 text-center ${
                      billingCycle === 'yearly' 
                        ? 'border-[#00D4FF] bg-[#00D4FF]/10' 
                        : 'border-[#242424]'
                    }`}
                  >
                    <span className="block text-sm font-bold">Anual</span>
                    <span className="text-xs text-green-500">20% off</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#050505] p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-[#00D4FF]">
                  R$ {(billingCycle === 'yearly' ? PLANS[selectedPlan].price * 12 * 0.8 : PLANS[selectedPlan].price).toLocaleString('pt-BR')}
                  <span className="text-sm text-gray-400">/{billingCycle === 'monthly' ? 'mês' : 'ano'}</span>
                </p>
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
                onClick={handleCreateSubscription}
                disabled={!selectedProject || creating}
                className="flex-1 btn-primary"
              >
                {creating ? 'Criando...' : 'Criar Assinatura'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}