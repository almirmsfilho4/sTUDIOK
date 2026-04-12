'use client';

import { useEffect, useState } from 'react';
import { db } from '@/app/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface PublicProjectData {
  id: string;
  name: string;
  type: string;
  status: string;
  progress: number;
  currentPhase: string;
  phases: { name: string; completed: boolean }[];
  deliveryDate?: Date;
  warrantyEndDate?: Date;
}

export default function PublicDashboardPage({ params }: { params: { token: string } }) {
  const [project, setProject] = useState<PublicProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'publicProjects', params.token);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as PublicProjectData);
        } else {
          setError('Projeto não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar projeto');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Erro</h1>
          <p className="text-gray-400">{error || 'Projeto não encontrado'}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'review': return 'bg-purple-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#00D4FF] mb-2">ESTUDIOK</h1>
          <p className="text-gray-400">Dashboard Público do Projeto</p>
        </div>

        <div className="card p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{project.name}</h2>
              <p className="text-gray-400">{project.type}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(project.status)} text-white`}>
              {project.status === 'in_progress' ? 'Em Andamento' : project.status}
            </span>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso</span>
              <span className="text-[#00D4FF]">{project.progress}%</span>
            </div>
            <div className="w-full bg-[#242424] rounded-full h-3">
              <div
                className="bg-[#00D4FF] h-3 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Fases do Projeto</h3>
            <div className="space-y-2">
              {project.phases?.map((phase, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    phase.completed ? 'bg-green-500/20' : 'bg-[#1A1A1A]'
                  }`}
                >
                  {phase.completed ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-500"></div>
                  )}
                  <span className={phase.completed ? 'text-green-500' : ''}>{phase.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(project.deliveryDate || project.warrantyEndDate) && (
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Datas Importantes</h3>
            <div className="space-y-3">
              {project.deliveryDate && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Entrega Prevista</span>
                  <span>{new Date(project.deliveryDate).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              {project.warrantyEndDate && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Fim da Garantia</span>
                  <span className="text-green-500">{new Date(project.warrantyEndDate).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}