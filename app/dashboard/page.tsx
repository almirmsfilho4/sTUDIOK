'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProjects } from '@/lib/firebase-services';
// import Chatbot from '@/components/Chatbot';
import { DashboardSkeleton, ProjectCardSkeleton } from '@/components/Skeleton';

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  price: number;
  paidAmount?: number;
  createdAt: any;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-500',
  in_progress: 'bg-blue-500/20 text-blue-500',
  review: 'bg-purple-500/20 text-purple-500',
  completed: 'bg-green-500/20 text-green-500',
  cancelled: 'bg-red-500/20 text-red-500',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  review: 'Em Revisão',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, userData, loading, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      const userProjects = await getUserProjects(user!.uid);
      setProjects(userProjects as Project[]);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  if (loading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'review');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const totalInvested = projects.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
  const totalPending = projects.reduce((sum, p) => sum + ((p.price || 0) - (p.paidAmount || 0)), 0);

  return (
    <>
      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Header */}
        <header className="border-b border-[#1A1A1A]">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
<Link href="/" className="flex items-center gap-2">
                    <img 
                      src="/logo.png" 
                      alt="ESTUDIOK Logo"
                      className="w-24 h-24 object-contain"
                    />
                  </Link>
                 <div className="mobile:hidden">
                   <h1 className="text-xl font-bold">Dashboard</h1>
                   <p className="text-sm text-gray-400">Bem-vindo, {userData.name}</p>
                 </div>
               </div>
                <div className="flex items-center gap-4">
                  <Link href="/orcamento" className="btn-primary text-sm mobile:text-xs mobile:px-3 mobile:py-2">
                    <span className="mobile:hidden">Novo Projeto</span>
                    <span className="hidden mobile:block">+</span>
                  </Link>
                  {userData?.role === 'admin' && (
                    <Link href="/admin" className="btn-secondary text-sm mobile:text-xs mobile:px-3 mobile:py-2">
                      <span className="mobile:hidden">Admin</span>
                      <span className="hidden mobile:block">⚙️</span>
                    </Link>
                  )}
                  <button 
                    onClick={() => signOut()} 
                    className="text-gray-400 hover:text-white text-sm mobile:text-xs mobile:px-3 mobile:py-2"
                    title="Sair"
                  >
                    <span className="mobile:hidden">Sair</span>
                    <span className="hidden mobile:block">🚪</span>
                  </button>
                </div>
             </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           {/* Stats */}
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Projetos Ativos</p>
                  <p className="text-2xl font-bold">{activeProjects.length}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Concluídos</p>
                  <p className="text-2xl font-bold">{completedProjects.length}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Investido</p>
                  <p className="text-2xl font-bold">R$ {totalInvested.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>

            {totalPending > 0 && (
              <div className="card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Pendente</p>
                    <p className="text-2xl font-bold text-yellow-500">R$ {totalPending.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

           {/* Quick Actions */}
           <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <Link href="/orcamento" className="card group hover:border-[#00D4FF]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00D4FF]/20 to-[#7B2CBF]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Novo Orçamento</h3>
                  <p className="text-sm text-gray-400">Solicite um novo projeto</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/mensagens" className="card group hover:border-[#00D4FF]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00D4FF]/20 to-[#7B2CBF]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Mensagens</h3>
                  <p className="text-sm text-gray-400">Fale com nossa equipe</p>
                </div>
              </div>
            </Link>
          </div>

            {/* Projects List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Meus Projetos</h2>
                <Link href="/orcamento" className="text-[#00D4FF] text-sm hover:underline">
                  Ver todos →
                </Link>
              </div>

              {projectsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="card text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nenhum projeto ainda</h3>
                  <p className="text-gray-400 mb-6">Faça seu primeiro orçamento para começar</p>
                  <Link href="/orcamento" className="btn-primary inline-block">
                    Criar Primeiro Projeto
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <Link 
                      key={project.id} 
                      href={`/dashboard/projetos/${project.id}`}
                      className="card block hover:border-[#00D4FF]/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{project.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[project.status]}`}>
                            {statusLabels[project.status]}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>R$ {project.price?.toLocaleString('pt-BR')}</span>
                          {(project.paidAmount || 0) < (project.price || 0) && (
                            <>
                              <span>•</span>
                              <span className="text-yellow-500">
                                R$ {((project.price || 0) - (project.paidAmount || 0)).toLocaleString('pt-BR')} restante
                              </span>
                            </>
                          )}
                          {(project.paidAmount || 0) >= (project.price || 0) && (
                            <>
                              <span>•</span>
                              <span className="text-green-500">Pago</span>
                            </>
                          )}
                          <span>•</span>
                          <span>Criado em {project.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || 'recentemente'}</span>
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progresso</span>
                          <span className="text-[#00D4FF]">{project.progress || 0}%</span>
                        </div>
                        <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                          <div 
                            className="progress-bar"
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      {/* <Chatbot /> */}
    </>
  );
}