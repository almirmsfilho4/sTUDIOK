'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument, updateDocument, deleteDocument } from '@/lib/firebase-services';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  client?: string;
  url?: string;
  createdAt?: any;
}

export default function PortfolioAdminPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    description: '',
    client: '',
    url: ''
  });

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, authLoading, router]);

  useEffect(() => {
    if (user && userData?.role === 'admin') {
      loadItems();
    }
  }, [user, userData]);

  const loadItems = async () => {
    try {
      const data = await getDocuments('portfolio');
      setItems(data as PortfolioItem[]);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateDocument('portfolio', editingItem.id, formData);
      } else {
        await createDocument('portfolio', {
          ...formData,
          createdAt: new Date()
        });
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({ title: '', category: '', image: '', description: '', client: '', url: '' });
      loadItems();
    } catch (error) {
      console.error('Error saving portfolio item:', error);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      image: item.image,
      description: item.description || '',
      client: item.client || '',
      url: item.url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    try {
      await deleteDocument('portfolio', id);
      loadItems();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
    }
  };

  const categories = ['Site Institucional', 'E-commerce', 'App Mobile', 'Sistema Web', 'Landing Page', 'SaaS'];

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
                <img 
                  src="/logo.png" 
                  alt="ESTUDIOK Logo"
                  className="w-20 h-20 object-contain"
                />
              </a>
              <div>
                <h1 className="text-xl font-bold">Gerenciar Portfólio</h1>
                <p className="text-sm text-gray-400">Adicione seus projetos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="/admin" className="text-[#00D4FF] hover:underline">
                Voltar ao Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{items.length} projetos no portfólio</h2>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
              setFormData({ title: '', category: '', image: '', description: '', client: '', url: '' });
            }}
            className="btn-primary"
          >
            + Adicionar Projeto
          </button>
        </div>

        {showForm && (
          <div className="card mb-8">
            <h3 className="text-lg font-bold mb-4">
              {editingItem ? 'Editar Projeto' : 'Novo Projeto'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Título *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="E-commerce Fashion"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Categoria *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Selecione...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL da Imagem *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="input-field"
                  placeholder="https://images.unsplash.com/..."
                />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Descrição do projeto..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Cliente</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={e => setFormData({ ...formData, client: e.target.value })}
                    className="input-field"
                    placeholder="Nome do cliente"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">URL do Projeto</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                    className="input-field"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Salvar Alterações' : 'Adicionar Projeto'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {items.length === 0 && !showForm ? (
          <div className="text-center py-16 card">
            <p className="text-gray-400 text-lg">Nenhum projeto no portfólio ainda.</p>
            <p className="text-gray-500 mt-2">Adicione seu primeiro projeto!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="card overflow-hidden group">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#00D4FF]/20 text-[#00D4FF]">
                      {item.category}
                    </span>
                    {item.client && (
                      <span className="text-xs text-gray-500">{item.client}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-xs text-[#00D4FF] hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
