'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProjects, getProjectMessages, createMessage } from '@/lib/firebase-services';

interface Project {
  id: string;
  name: string;
}

interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  content: string;
  createdAt: any;
}

export default function MensagensPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard/mensagens');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

useEffect(() => {
 if (selectedProject) {
  loadMessages();
  const interval = setInterval(loadMessages, 5000);
  return () => clearInterval(interval);
 }
 return undefined;
 }, [selectedProject]);

  const loadProjects = async () => {
    try {
      const userProjects = await getUserProjects(user!.uid);
      setProjects(userProjects as Project[]);
if (userProjects.length > 0 && !selectedProject && userProjects[0]) {
   setSelectedProject(userProjects[0].id);
  }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadMessages = async () => {
    if (!selectedProject) return;
    try {
      const projectMessages = await getProjectMessages(selectedProject);
      setMessages(projectMessages as Message[]);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedProject) return;

    setSending(true);
    try {
      await createMessage({
        projectId: selectedProject,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-[#1A1A1A] rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold">Mensagens</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-gray-400 mb-6">Crie um projeto para poder enviar mensagens</p>
            <Link href="/orcamento" className="btn-primary inline-block">
              Criar Projeto
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {/* Projects List */}
            <div className="card">
              <h3 className="font-semibold mb-4">Projetos</h3>
              <div className="space-y-2">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedProject === project.id
                        ? 'bg-[#00D4FF]/10 border border-[#00D4FF]'
                        : 'hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <p className="font-medium truncate">{project.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="md:col-span-3 card flex flex-col h-[600px]">
              {selectedProject ? (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
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
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Selecione um projeto para ver as mensagens
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}