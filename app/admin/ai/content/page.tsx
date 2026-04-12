'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PremiumIcon from '@/components/PremiumIcon';

type ContentType = 'blog' | 'social' | 'video' | 'caption' | 'hashtags' | 'custom' | 'images' | 'package';
type Platform = 'linkedin' | 'instagram' | 'facebook' | 'twitter';
type Tone = 'professional' | 'casual' | 'persuasive';
type Duration = 'short' | 'medium' | 'long';

interface GeneratedContent {
  id: string;
  type: ContentType;
  content: string;
  topic: string;
  createdAt: Date;
  copied?: boolean;
}

export default function ContentGeneratorPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [tone, setTone] = useState<Tone>('professional');
  const [duration, setDuration] = useState<Duration>('medium');
  const [description, setDescription] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [activeTab, setActiveTab] = useState<string>('generate');
  const [schedulers, setSchedulers] = useState<any[]>([]);
  const [newScheduler, setNewScheduler] = useState({
    name: '',
    type: 'blog' as 'blog' | 'social' | 'video' | 'hashtags',
    topic: '',
    keywords: '',
    platform: 'linkedin',
    schedule: 'daily' as 'daily' | 'weekly' | 'monthly',
  });

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, authLoading, router]);

  useEffect(() => {
    if (activeTab === 'scheduler') {
      loadSchedulers();
    }
  }, [activeTab]);

  const loadSchedulers = async () => {
    try {
      const response = await fetch('/api/ai/content/scheduler', { method: 'GET' });
      const data = await response.json();
      if (data.schedulers) {
        setSchedulers(data.schedulers);
      }
    } catch (error) {
      console.error('Error loading schedulers:', error);
    }
  };

  const handleCreateScheduler = async () => {
    if (!newScheduler.name || !newScheduler.topic) {
      alert('Preencha o nome e o tema');
      return;
    }

    try {
      const response = await fetch('/api/ai/content/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-scheduler',
          scheduler: {
            ...newScheduler,
            keywords: newScheduler.keywords.split(',').map(k => k.trim()).filter(k => k),
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Scheduler criado com sucesso!');
        setNewScheduler({
          name: '',
          type: 'blog',
          topic: '',
          keywords: '',
          platform: 'linkedin',
          schedule: 'daily',
        });
        loadSchedulers();
      }
    } catch (error) {
      console.error('Error creating scheduler:', error);
      alert('Erro ao criar scheduler');
    }
  };

  const handleToggleScheduler = async (id: string) => {
    try {
      await fetch('/api/ai/content/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', scheduler: { id } })
      });
      loadSchedulers();
    } catch (error) {
      console.error('Error toggling scheduler:', error);
    }
  };

  const handleRunNow = async (scheduler: any) => {
    if (!confirm('Executar agora? O conteúdo será gerado e publicado automaticamente.')) return;
    
    try {
      const response = await fetch('/api/ai/content/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run-now', scheduler })
      });
      const data = await response.json();
      if (data.success) {
        alert('Conteúdo gerado e publicado com sucesso!');
      } else {
        alert('Erro: ' + data.error);
      }
    } catch (error) {
      console.error('Error running scheduler:', error);
      alert('Erro ao executar scheduler');
    }
  };

  const handleGenerate = async () => {
    if (!topic && !description && !customPrompt) {
      alert('Por favor, forneça um tema ou descrição');
      return;
    }

    setLoading(true);
    setGeneratedContent(null);

    try {
      let payload: any = { action: contentType };

      switch (contentType) {
        case 'blog':
          payload = {
            ...payload,
            topic,
            keywords: keywords.split(',').map(k => k.trim()).filter(k => k)
          };
          break;
        case 'social':
          payload = {
            ...payload,
            topic,
            platform,
            tone
          };
          break;
        case 'video':
          payload = {
            ...payload,
            topic,
            duration
          };
          break;
        case 'caption':
          payload = {
            ...payload,
            description,
            platform
          };
          break;
        case 'hashtags':
          payload = {
            ...payload,
            topic
          };
          break;
        case 'custom':
          payload = {
            ...payload,
            prompt: customPrompt
          };
          break;
        case 'images':
          payload = {
            ...payload,
            action: 'images',
            prompt: topic
          };
          break;
        case 'package':
          payload = {
            ...payload,
            action: 'package',
            type: 'social',
            topic,
            platform
          };
          break;
      }

      const response = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        if (contentType === 'images' && data.images) {
          setGeneratedImages(data.images);
        } else if (contentType === 'package') {
          setGeneratedContent({
            id: Date.now().toString(),
            type: contentType,
            content: data.content?.content || data.text?.content || '',
            topic: topic,
            createdAt: new Date()
          });
          setGeneratedImages(data.images?.images || []);
        } else {
          const newContent: GeneratedContent = {
            id: Date.now().toString(),
            type: contentType,
            content: data.content,
            topic: topic || description || customPrompt.substring(0, 50),
            createdAt: new Date()
          };
          setGeneratedContent(newContent);
          setHistory(prev => [newContent, ...prev].slice(0, 20));
        }
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Erro ao gerar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setGeneratedContent(prev => prev ? { ...prev, copied: true } : null);
    setTimeout(() => {
      setGeneratedContent(prev => prev ? { ...prev, copied: false } : null);
    }, 2000);
  };

  const contentTypeLabels: Record<ContentType, { icon: string; label: string; desc: string }> = {
    blog: { icon: 'file-text', label: 'Artigo de Blog', desc: 'Gera artigo completo com SEO' },
    social: { icon: 'share', label: 'Post Redes Sociais', desc: 'LinkedIn, Instagram, Facebook, Twitter' },
    video: { icon: 'video', label: 'Roteiro de Vídeo', desc: 'Reels, Shorts, YouTube' },
    caption: { icon: 'image', label: 'Legenda de Imagem', desc: 'Para fotos e carrosséis' },
    hashtags: { icon: 'hash', label: 'Hashtags', desc: 'Tags otimizadas para alcance' },
    custom: { icon: 'edit', label: 'Prompt Customizado', desc: 'Escreva seu próprio prompt' },
    images: { icon: 'image', label: '🎨 Gerar Imagens IA', desc: 'Cria imagens com Gemini' },
    package: { icon: 'gift', label: '📦 Pacote Completo', desc: 'Texto + Imagens + Hashtags' }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <PremiumIcon name="cpu" className="text-[#00D4FF]" />
              Gerador de Conteúdo AI
            </h1>
            <p className="text-gray-400 mt-2">
              Gere posts, blogs, roteiros e muito mais com Inteligência Artificial
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'generate' ? 'bg-[#00D4FF] text-black' : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
              }`}
            >
              Gerar
            </button>
            <button
              onClick={() => setActiveTab('scheduler')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'scheduler' ? 'bg-purple-500 text-white' : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
              }`}
            >
              🚀 Auto
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'history' ? 'bg-[#00D4FF] text-black' : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
              }`}
            >
              Histórico ({history.length})
            </button>
          </div>
        </div>

        {activeTab === 'generate' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-4">
                <h3 className="font-semibold mb-4">Tipo de Conteúdo</h3>
                <div className="space-y-2">
                  {(Object.keys(contentTypeLabels) as ContentType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setContentType(type)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        contentType === type
                          ? 'bg-[#00D4FF]/20 border border-[#00D4FF] text-white'
                          : 'bg-[#050505] border border-transparent text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <PremiumIcon name={contentTypeLabels[type].icon as any} size={18} />
                        <span className="font-medium">{contentTypeLabels[type].label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{contentTypeLabels[type].desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {contentType === 'blog' && (
                <div className="card p-4">
                  <label className="block text-sm font-medium mb-2">Título/Tema do Artigo</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Como aumentar vendas com marketing digital"
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none"
                  />
                  <label className="block text-sm font-medium mb-2 mt-4">Palavras-chave (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Ex: marketing, vendas, conversão"
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none"
                  />
                </div>
              )}

              {contentType === 'social' && (
                <div className="card p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tema do Post</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Ex: 5 dicas para vender mais"
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Plataforma</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as Platform)}
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white focus:border-[#00D4FF] focus:outline-none"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter/X</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tom</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as Tone)}
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white focus:border-[#00D4FF] focus:outline-none"
                    >
                      <option value="professional">Profissional</option>
                      <option value="casual">Casual</option>
                      <option value="persuasive">Persuasivo</option>
                    </select>
                  </div>
                </div>
              )}

              {contentType === 'video' && (
                <div className="card p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tema do Vídeo</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Ex: Como criar um site que vende"
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Duração</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value as Duration)}
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white focus:border-[#00D4FF] focus:outline-none"
                    >
                      <option value="short">Curto (15-60s) - Reels/Shorts</option>
                      <option value="medium">Médio (1-3min)</option>
                      <option value="long">Longo (5-10min)</option>
                    </select>
                  </div>
                </div>
              )}

              {contentType === 'caption' && (
                <div className="card p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição da Imagem</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva o que aparece na imagem..."
                      rows={4}
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Plataforma</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as Platform)}
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white focus:border-[#00D4FF] focus:outline-none"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>
                </div>
              )}

              {contentType === 'hashtags' && (
                <div className="card p-4">
                  <label className="block text-sm font-medium mb-2">Tema</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: marketing digital"
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none"
                  />
                </div>
              )}

              {contentType === 'custom' && (
                <div className="card p-4">
                  <label className="block text-sm font-medium mb-2">Seu Prompt</label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Escreva o que você quer que a IA gere..."
                    rows={6}
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none resize-none"
                  />
                </div>
              )}

              {(contentType === 'images' || contentType === 'package') && (
                <div className="card p-4">
                  <label className="block text-sm font-medium mb-2">Descrição para gerar imagens</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Um profissional trabalhando em seu laptop em um escritório moderno com luz natural..."
                    rows={4}
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00D4FF] focus:outline-none resize-none"
                  />
                  {contentType === 'package' && (
                    <>
                      <label className="block text-sm font-medium mb-2 mt-4">Plataforma</label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value as Platform)}
                        className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white focus:border-[#00D4FF] focus:outline-none"
                      >
                        <option value="linkedin">LinkedIn</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter/X</option>
                      </select>
                    </>
                  )}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <PremiumIcon name="zap" size={20} />
                    Gerar Conteúdo
                  </>
                )}
              </button>
            </div>

            <div className="lg:col-span-2">
              <div className="card p-6 min-h-[500px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Resultado</h3>
                  {generatedContent && (
                    <span className="text-sm text-gray-500">
                      {contentTypeLabels[generatedContent.type].label}
                    </span>
          )}
        </div>

        {/* Scheduler Tab */}
        {(activeTab as string) === 'scheduler' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <PremiumIcon name="zap" className="text-purple-400" />
                Criar Automação
              </h3>
              <p className="text-gray-400 mb-6">
                Configure geração automática de conteúdo. A IA criará e publicará sem intervenção!
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Automação</label>
                  <input
                    type="text"
                    value={newScheduler.name}
                    onChange={(e) => setNewScheduler({ ...newScheduler, name: e.target.value })}
                    placeholder="Ex: Blog Diário"
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Conteúdo</label>
                  <select
                    value={newScheduler.type}
                    onChange={(e) => setNewScheduler({ ...newScheduler, type: e.target.value as any })}
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white"
                  >
                    <option value="blog">📝 Artigo de Blog</option>
                    <option value="social">📱 Post Redes Sociais</option>
                    <option value="video">🎬 Roteiro de Vídeo</option>
                    <option value="hashtags">#️⃣ Hashtags</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tema</label>
                  <input
                    type="text"
                    value={newScheduler.topic}
                    onChange={(e) => setNewScheduler({ ...newScheduler, topic: e.target.value })}
                    placeholder="Ex: Marketing digital para pequenas empresas"
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white"
                  />
                </div>
                {newScheduler.type === 'blog' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Palavras-chave (vírgula)</label>
                    <input
                      type="text"
                      value={newScheduler.keywords}
                      onChange={(e) => setNewScheduler({ ...newScheduler, keywords: e.target.value })}
                      placeholder="marketing, vendas, conversão"
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                )}
                {newScheduler.type === 'social' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Plataforma</label>
                    <select
                      value={newScheduler.platform}
                      onChange={(e) => setNewScheduler({ ...newScheduler, platform: e.target.value })}
                      className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter/X</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Frequência</label>
                <select
                  value={newScheduler.schedule}
                  onChange={(e) => setNewScheduler({ ...newScheduler, schedule: e.target.value as any })}
                  className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 text-white"
                >
                  <option value="daily">📅 Todos os dias</option>
                  <option value="weekly">📅 Toda semana</option>
                  <option value="monthly">📅 Todo mês</option>
                </select>
              </div>

              <button
                onClick={handleCreateScheduler}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2"
              >
                <PremiumIcon name="zap" size={20} />
                Criar Automação
              </button>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Automações Ativas</h3>
              {schedulers.length > 0 ? (
                <div className="space-y-4">
                  {schedulers.map((scheduler) => (
                    <div key={scheduler.id} className="p-4 bg-[#050505] rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{scheduler.name}</h4>
                        <p className="text-sm text-gray-400">
                          {scheduler.type} • {scheduler.schedule} • {scheduler.topic}
                        </p>
                        {scheduler.lastRun && (
                          <p className="text-xs text-gray-500 mt-1">
                            Última execução: {new Date(scheduler.lastRun).toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRunNow(scheduler)}
                          className="px-3 py-2 bg-[#00D4FF]/20 text-[#00D4FF] rounded-lg hover:bg-[#00D4FF]/30 text-sm"
                        >
                          ▶ Executar
                        </button>
                        <button
                          onClick={() => handleToggleScheduler(scheduler.id)}
                          className={`px-3 py-2 rounded-lg text-sm ${
                            scheduler.enabled 
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                              : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                          }`}
                        >
                          {scheduler.enabled ? '✅ Ativo' : '⏸️ Pausado'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <PremiumIcon name="zap" size={48} className="mb-4 opacity-50" />
                  <p>Nenhuma automação criada ainda</p>
                  <p className="text-sm mt-2">Crie acima para gerar conteúdo automaticamente</p>
                </div>
              )}
            </div>
          </div>
        )}

                {generatedContent ? (
                  <div className="relative">
                    <div className="bg-[#050505] rounded-lg p-6 whitespace-pre-wrap text-gray-300 leading-relaxed max-h-[500px] overflow-y-auto">
                      {generatedContent.content}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => copyToClipboard(generatedContent.content)}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <PremiumIcon name="copy" size={16} />
                        {generatedContent.copied ? 'Copiado!' : 'Copiar'}
                      </button>
                      {generatedContent.type === 'blog' && (
                        <button
                          onClick={() => {
                            localStorage.setItem('generatedBlogContent', JSON.stringify({
                              title: generatedContent.topic,
                              content: generatedContent.content,
                              category: 'marketing'
                            }));
                            router.push('/admin/blog?new=1');
                          }}
                          className="btn-primary flex items-center gap-2"
                        >
                          <PremiumIcon name="plus" size={16} />
                          Criar Post no Blog
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                    <PremiumIcon name="file-text" size={48} className="mb-4 opacity-50" />
                    <p>Selecione um tipo e clique em "Gerar Conteúdo"</p>
                    <p className="text-sm mt-2">O conteúdo será criado automaticamente</p>
                  </div>
                )}

                {(contentType === 'images' || contentType === 'package') && generatedImages.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Imagens Geradas</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {generatedImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img} 
                            alt={`Generated ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = img;
                              link.download = `generated-image-${index + 1}.png`;
                              link.click();
                            }}
                            className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Baixar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded bg-[#00D4FF]/20 text-[#00D4FF]">
                      {contentTypeLabels[item.type].label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.createdAt.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.topic}</p>
                  <button
                    onClick={() => {
                      setContentType(item.type);
                      setTopic(item.topic);
                      setGeneratedContent(item);
                      setActiveTab('generate');
                    }}
                    className="text-sm text-[#00D4FF] hover:underline"
                  >
                    Ver conteúdo →
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <PremiumIcon name="clock" size={48} className="mb-4 opacity-50" />
                <p>Nenhum conteúdo gerado ainda</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}