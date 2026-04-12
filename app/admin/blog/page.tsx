'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument, updateDocument, deleteDocument } from '@/lib/firebase-services';
import PremiumIcon from '@/components/PremiumIcon';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  createdAt: any;
  publishedAt?: any;
}

const CATEGORIES = [
  { id: 'design', name: 'Design', color: '#8B5CF6' },
  { id: 'desenvolvimento', name: 'Desenvolvimento', color: '#00D4FF' },
  { id: 'marketing', name: 'Marketing', color: '#22C55E' },
  { id: 'negocios', name: 'Negócios', color: '#F59E0B' },
];

export default function BlogPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft' as 'draft' | 'published',
  });
  const [saving, setSaving] = useState(false);

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
      const data = await getDocuments('articles');
      setPosts(data as BlogPost[]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async () => {
    if (!newPost.title || !newPost.content) return;
    
    setSaving(true);
    try {
      const slug = newPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const postData = {
        ...newPost,
        slug,
        author: userData?.name || 'Admin',
        tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
        views: 0,
        createdAt: new Date(),
        ...(newPost.status === 'published' && { publishedAt: new Date() }),
      };

      await createDocument('articles', postData);
      
      alert('Post salvo com sucesso!');
      setShowCreateModal(false);
      setNewPost({ title: '', excerpt: '', content: '', category: '', tags: '', status: 'draft' });
      loadData();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Erro ao salvar post');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (postId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    await updateDocument('articles', postId, { 
      status: newStatus,
      ...(newStatus === 'published' && { publishedAt: new Date() })
    });
    loadData();
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    await deleteDocument('articles', postId);
    loadData();
  };

  const publishedPosts = posts.filter(p => p.status === 'published');
  const draftPosts = posts.filter(p => p.status === 'draft');
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

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
                <h1 className="text-xl font-bold">Blog do Cliente</h1>
                <p className="text-sm text-gray-400">Gerencie artigos para projetos de conteúdo</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PremiumIcon name="add" size={18} />
              Novo Artigo
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Total de Artigos</p>
            <p className="text-3xl font-bold">{posts.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Publicados</p>
            <p className="text-3xl font-bold text-green-500">{publishedPosts.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Rascunhos</p>
            <p className="text-3xl font-bold text-yellow-500">{draftPosts.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Total de Visualizações</p>
            <p className="text-3xl font-bold text-[#00D4FF]">{totalViews}</p>
          </div>
        </div>

        {/* Posts List */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Todos os Artigos</h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <PremiumIcon name="file" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum artigo encontrado</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="text-[#00D4FF] hover:underline mt-2"
              >
                Criar primeiro artigo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const category = CATEGORIES.find(c => c.id === post.category);
                
                return (
                  <div key={post.id} className="p-4 bg-[#050505] rounded-xl flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{post.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          post.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                        {category && (
                          <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                            {category.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-1">{post.excerpt}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {post.author} • {post.views} visualizações
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => togglePublish(post.id, post.status)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          post.status === 'published' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
                        }`}
                      >
                        {post.status === 'published' ? 'Despublicar' : 'Publicar'}
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="px-3 py-1 text-red-500 text-sm hover:underline"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Novo Artigo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Título *</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                  placeholder="Título do artigo"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm block mb-2">Resumo</label>
                <textarea
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white h-20"
                  placeholder="Breve descrição do artigo..."
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Conteúdo</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white h-40"
                  placeholder="Conteúdo do artigo..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Categoria</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                  >
                    <option value="">Selecione</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Status</label>
                  <select
                    value={newPost.status}
                    onChange={(e) => setNewPost({ ...newPost, status: e.target.value as 'draft' | 'published' })}
                    className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                  placeholder="marketing, seo, design"
                />
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
                onClick={handleSavePost}
                disabled={!newPost.title || !newPost.content || saving}
                className="flex-1 btn-primary"
              >
                {saving ? 'Salvando...' : 'Salvar Artigo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}