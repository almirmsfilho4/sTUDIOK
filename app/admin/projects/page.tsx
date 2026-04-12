'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments } from '@/lib/firebase-services';

export default function ProjectsAdminPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, authLoading, router]);

  useEffect(() => {
    if (user && userData?.role === 'admin') {
      loadProjects();
    }
  }, [user, userData]);

  const loadProjects = async () => {
    try {
      const data = await getDocuments('projects');
      setProjects(data as any[]);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-500',
    in_progress: 'bg-blue-500/20 text-blue-500',
    completed: 'bg-green-500/20 text-green-500',
    cancelled: 'bg-red-500/20 text-red-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projetos</h1>
          <p className="text-gray-400">{projects.length} projetos cadastrados</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0A0A0A]">
            <tr>
              <th className="text-left p-4 text-sm text-gray-400">Nome</th>
              <th className="text-left p-4 text-sm text-gray-400">Cliente</th>
              <th className="text-left p-4 text-sm text-gray-400">Valor</th>
              <th className="text-left p-4 text-sm text-gray-400">Status</th>
              <th className="text-left p-4 text-sm text-gray-400">Progresso</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-[#1A1A1A] hover:bg-[#1A1A1A]/50">
                <td className="p-4 font-medium">{project.name}</td>
                <td className="p-4 text-gray-400">{project.client_name || 'N/A'}</td>
                <td className="p-4">R$ {(project.price || 0).toLocaleString('pt-BR')}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[project.status] || 'bg-gray-500/20 text-gray-500'}`}>
                    {project.status === 'in_progress' ? 'Em Progresso' : 
                     project.status === 'pending' ? 'Pendente' :
                     project.status === 'completed' ? 'Concluído' : 'Cancelado'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF]" 
                        style={{ width: `${project.progress || 0}%` }} 
                      />
                    </div>
                    <span className="text-sm text-gray-400">{project.progress || 0}%</span>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Nenhum projeto encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
