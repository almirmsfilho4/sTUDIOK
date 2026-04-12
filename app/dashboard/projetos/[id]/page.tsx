'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getProject, getProjectMessages, createMessage, getProjectFiles, uploadFile as uploadFileToFirebase } from '@/lib/firebase-services';

interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  price: number;
  paidAmount: number;
  deadline: any;
  features: string[];
  timeline: { phase: string; description: string; completed: boolean; completedAt?: any }[];
  createdAt: any;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  createdAt: any;
  type: string;
}

interface FileData {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  createdAt: any;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-500',
  in_progress: 'bg-blue-500/20 text-blue-500',
  review: 'bg-purple-500/20 text-purple-500',
  completed: 'bg-green-500/20 text-green-500',
  cancelled: 'bg-red-500/20 text-red-500',
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'mensagens' | 'arquivos'>('timeline');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=' + window.location.pathname);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && id) {
      loadProjectData();
    }
  }, [user, id]);

  useEffect(() => {
    if (activeTab === 'mensagens' && project && user) {
      loadMessages();
    }
  }, [activeTab, project, user]);

  const loadProjectData = async () => {
    try {
      const projectData = await getProject(id);
      if (projectData && ((projectData as Project).user_id === user?.uid || userData?.role === 'admin')) {
        setProject(projectData as Project);
        const projectFiles = await getProjectFiles(id);
        setFiles(projectFiles as FileData[]);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const projectMessages = await getProjectMessages(id);
      setMessages(projectMessages as Message[]);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      await createMessage({
        projectId: id,
        senderId: user.uid,
        content: newMessage,
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      await uploadFileToFirebase(id, user.uid, file);
      loadProjectData();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{project.name}</h1>
              <p className="text-sm text-gray-400">
                <span className={`px-2 py-1 rounded-full text-xs ${statusColors[project.status]}`}>
                  {project.status === 'in_progress' ? 'Em Andamento' : project.status === 'pending' ? 'Pendente' : project.status === 'review' ? 'Em Revisão' : project.status === 'completed' ? 'Concluído' : 'Cancelado'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Progresso do Projeto</h2>
            <span className="text-2xl font-bold text-[#00D4FF]">{project.progress || 0}%</span>
          </div>
          <div className="h-4 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div className="progress-bar h-full" style={{ width: `${project.progress || 0}%` }}></div>
          </div>
        </div>

        {/* Payment Info */}
        {(() => {
          const total = project.price || 0;
          const paid = project.paidAmount || 0;
          const remaining = total - paid;
          const percentPaid = total > 0 ? Math.round((paid / total) * 100) : 0;
          
          return (
            <div className="card mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Pagamentos</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${percentPaid >= 100 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {percentPaid >= 100 ? 'Pago' : `${percentPaid}% pago`}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="h-3 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00D4FF] to-green-500 rounded-full transition-all"
                    style={{ width: `${Math.min(percentPaid, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-[#050505] rounded-xl">
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-xl font-bold">R$ {total.toLocaleString('pt-BR')}</p>
                </div>
                <div className="text-center p-4 bg-[#050505] rounded-xl">
                  <p className="text-gray-400 text-sm">Pago</p>
                  <p className="text-xl font-bold text-green-500">R$ {paid.toLocaleString('pt-BR')}</p>
                </div>
                <div className="text-center p-4 bg-[#050505] rounded-xl">
                  <p className="text-gray-400 text-sm">Restante</p>
                  <p className="text-xl font-bold text-[#00D4FF]">R$ {remaining.toLocaleString('pt-BR')}</p>
                </div>
              </div>
              
              {remaining > 0 && (
                <Link 
                  href={`/dashboard/pagamento/${project.id}`}
                  className="btn-primary w-full py-3 text-center block"
                >
                  Pagar Restante
                </Link>
              )}
              
              <Link 
                href={`/dashboard/documentacao/${project.id}`}
                className="w-full py-3 text-center block mt-3 border border-[#00D4FF] text-[#00D4FF] rounded-xl hover:bg-[#00D4FF]/10"
              >
                📖 Ver Documentação
              </Link>
            </div>
          );
        })()}

        {/* Tabs */}
        <div className="flex gap-4 border-b border-[#1A1A1A] mb-8">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 px-2 font-medium transition-colors relative ${
              activeTab === 'timeline' ? 'text-[#00D4FF]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Timeline
            {activeTab === 'timeline' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D4FF]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('mensagens')}
            className={`pb-3 px-2 font-medium transition-colors relative ${
              activeTab === 'mensagens' ? 'text-[#00D4FF]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Mensagens
            {activeTab === 'mensagens' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D4FF]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('arquivos')}
            className={`pb-3 px-2 font-medium transition-colors relative ${
              activeTab === 'arquivos' ? 'text-[#00D4FF]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Arquivos
            {activeTab === 'arquivos' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D4FF]"></span>
            )}
          </button>
        </div>

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {project.timeline?.map((phase, index) => (
              <div key={index} className="card flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  phase.completed ? 'bg-green-500/20 text-green-500' : 'bg-[#1A1A1A] text-gray-500'
                }`}>
                  {phase.completed ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${phase.completed ? '' : 'text-gray-400'}`}>
                    {phase.phase}
                  </h3>
                  <p className="text-sm text-gray-400">{phase.description}</p>
                  {phase.completed && phase.completedAt && (
                    <p className="text-xs text-green-500 mt-2">
                      Concluído em {phase.completedAt?.toDate?.()?.toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'mensagens' && (
          <div className="card">
            <div className="h-96 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user?.uid ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] p-4 rounded-2xl ${
                    message.sender_id === user?.uid
                      ? 'bg-[#00D4FF] text-black'
                      : 'bg-[#1A1A1A]'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_id === user?.uid ? 'text-black/50' : 'text-gray-500'
                    }`}>
                      {message.createdAt?.toDate?.()?.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Nenhuma mensagem ainda. Inicie a conversa!
                </p>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="input-field flex-1"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="btn-primary px-6"
              >
                {sending ? '...' : 'Enviar'}
              </button>
            </form>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'arquivos' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Arquivos do Projeto</h3>
              <label className="btn-primary cursor-pointer">
                {uploading ? 'Enviando...' : 'Enviar Arquivo'}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {files.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum arquivo enviado ainda
              </p>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#242424] flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {file.createdAt?.toDate?.()?.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00D4FF] hover:underline text-sm"
                    >
                      Baixar
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}