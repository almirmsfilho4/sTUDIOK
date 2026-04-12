'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments } from '@/lib/firebase-services';
import PremiumIcon from '@/components/PremiumIcon';

interface Review {
  id: string;
  projectId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: any;
  response?: string;
}

interface Project {
  id: string;
  name: string;
  user_id: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function AvaliacoesPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');

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
      const [reviewsData, projectsData, usersData] = await Promise.all([
        getDocuments('reviews'),
        getDocuments('projects'),
        getDocuments('users'),
      ]);
      setReviews(reviewsData as Review[]);
      setProjects(projectsData as Project[]);
      setUsers(usersData as User[]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectName = (projectId: string) => {
    const p = projects.find(proj => proj.id === projectId);
    return p?.name || 'Projeto';
  };

  const getUserName = (userId: string) => {
    const u = users.find(usr => usr.id === userId);
    return u?.name || 'Cliente';
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const fiveStars = reviews.filter(r => r.rating === 5).length;
  const fourStars = reviews.filter(r => r.rating === 4).length;
  const threeStars = reviews.filter(r => r.rating === 3).length;
  const twoStars = reviews.filter(r => r.rating === 2).length;
  const oneStar = reviews.filter(r => r.rating === 1).length;

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
          <div className="flex items-center gap-4">
            <a href="/admin" className="flex items-center gap-2">
              <img src="/logo.png" alt="ESTUDIOK" className="w-20 h-20 object-contain" />
            </a>
            <div>
              <h1 className="text-xl font-bold">Avaliações & Feedbacks</h1>
              <p className="text-sm text-gray-400">Avaliações dos clientes sobre projetos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#00D4FF]">{averageRating}</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Média Geral</p>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(star => (
                    <PremiumIcon 
                      key={star} 
                      name="star" 
                      size={14} 
                      className={star <= Math.round(Number(averageRating)) ? 'text-yellow-500' : 'text-gray-600'} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Total de Avaliações</p>
            <p className="text-3xl font-bold">{reviews.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">5 Estrelas</p>
            <p className="text-3xl font-bold text-green-500">{fiveStars}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">1 Estrelas</p>
            <p className="text-3xl font-bold text-red-500">{oneStar}</p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="card p-6 mb-8">
          <h3 className="font-bold text-lg mb-4">Distribuição de Avaliações</h3>
          <div className="space-y-3">
            {[
              { stars: 5, count: fiveStars, color: 'bg-green-500' },
              { stars: 4, count: fourStars, color: 'bg-green-400' },
              { stars: 3, count: threeStars, color: 'bg-yellow-500' },
              { stars: 2, count: twoStars, color: 'bg-orange-500' },
              { stars: 1, count: oneStar, color: 'bg-red-500' },
            ].map(item => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-12">{item.stars} ⭐</span>
                <div className="flex-1 h-4 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${reviews.length > 0 ? (item.count / reviews.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Todas as Avaliações</h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <PremiumIcon name="message" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma avaliação ainda</p>
              <p className="text-sm mt-2">As avaliações aparecem aqui após a conclusão de projetos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="p-4 bg-[#050505] rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{getUserName(review.userId)}</h4>
                      <p className="text-sm text-gray-400">{getProjectName(review.projectId)}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(star => (
                        <PremiumIcon 
                          key={star} 
                          name="star" 
                          size={16} 
                          className={star <= review.rating ? 'text-yellow-500' : 'text-gray-600'} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-3">{review.comment}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {review.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || 'Recentemente'}
                    </span>
                    {review.response ? (
                      <span className="text-green-500">✓ Respondido</span>
                    ) : (
                      <button 
                        onClick={() => setSelectedReview(review)}
                        className="text-[#00D4FF] hover:underline"
                      >
                        Responder
                      </button>
                    )}
                  </div>
                  {review.response && (
                    <div className="mt-3 p-3 bg-[#1A1A1A] rounded-lg">
                      <p className="text-sm text-gray-400">Resposta:</p>
                      <p className="text-sm">{review.response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Responder Avaliação</h2>
            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-2">Avaliação do cliente:</p>
              <p className="text-white">{selectedReview.comment}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Sua resposta:</label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Agradeça o feedback e responda..."
                className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white h-32"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => { setSelectedReview(null); setResponseText(''); }}
                className="flex-1 py-3 rounded-xl border border-[#242424] text-gray-400"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert('Resposta salva! (Funcionalidade em desenvolvimento)');
                  setSelectedReview(null);
                  setResponseText('');
                }}
                className="flex-1 btn-primary"
              >
                Enviar Resposta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}