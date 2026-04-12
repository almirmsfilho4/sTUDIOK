'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument, deleteDocument } from '@/lib/firebase-services';

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  url: string;
  category: string;
  featured: boolean;
  createdAt: any;
}

const categories = ['Site', 'App', 'Sistema', 'E-commerce', 'Logo', 'Banner', 'Ilustração'];

export default function GalleryAdminPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    category: 'Site',
    featured: false
  });

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, authLoading, router]);

  useEffect(() => {
    if (user && userData?.role === 'admin') {
      loadImages();
    }
  }, [user, userData]);

  const loadImages = async () => {
    try {
      const data = await getDocuments('gallery');
      setImages(data as GalleryImage[]);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDocument('gallery', {
        ...formData,
        createdAt: new Date()
      });
      setShowForm(false);
      setFormData({ title: '', description: '', url: '', category: 'Site', featured: false });
      loadImages();
    } catch (error) {
      console.error('Error creating gallery image:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta imagem?')) return;
    try {
      await deleteDocument('gallery', id);
      loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const toggleFeatured = async (image: GalleryImage) => {
    try {
      await import('@/lib/firebase-services').then(m => 
        m.updateDocument('gallery', image.id, { featured: !image.featured })
      );
      loadImages();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

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
                <h1 className="text-xl font-bold">Galeria de Imagens</h1>
                <p className="text-sm text-gray-400">{images.length} imagens</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowForm(true)} className="btn-primary">
                + Adicionar Imagem
              </button>
              <a href="/admin" className="text-[#00D4FF] hover:underline">
                Voltar
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="card mb-8 p-6">
            <h3 className="text-lg font-bold mb-4">Nova Imagem</h3>
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
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL da Imagem *</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm">Destacar na home</label>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary">Adicionar</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map(img => (
            <div key={img.id} className="card overflow-hidden group">
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={img.url} 
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {img.featured && (
                  <span className="absolute top-2 right-2 bg-[#00D4FF] text-black text-xs px-2 py-1 rounded-full">
                    ★ Destaque
                  </span>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-[#00D4FF]">{img.category}</span>
                <h3 className="font-bold mt-1">{img.title}</h3>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => toggleFeatured(img)}
                    className="text-xs text-gray-400 hover:text-[#00D4FF]"
                  >
                    {img.featured ? '★ Destacado' : '☆ Destacar'}
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && !showForm && (
          <div className="text-center py-16 card">
            <p className="text-gray-400">Nenhuma imagem na galeria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
