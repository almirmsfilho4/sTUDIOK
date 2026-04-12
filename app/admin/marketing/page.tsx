'use client';

import { useState } from 'react';
import PremiumIcon from '@/components/PremiumIcon';

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#25D366' },
];

const contentTypes = [
  { id: 'post', name: 'Post Imagem', icon: '🖼️' },
  { id: 'video', name: 'Reels/Video', icon: '🎬' },
  { id: 'story', name: 'Story', icon: '⏱️' },
  { id: 'carousel', name: 'Carrossel', icon: '🎠' },
];

const templates = [
  { id: 1, title: 'Promoção Relâmpago', category: 'Promoção' },
  { id: 2, title: 'Depoimento Cliente', category: 'Prova Social' },
  { id: 3, title: 'Novo Serviço', category: 'Serviços' },
  { id: 4, title: 'Dica do Dia', category: 'Educação' },
  { id: 5, title: 'Pergunta Engagement', category: 'Engajamento' },
  { id: 6, title: 'Portfólio', category: 'Portfólio' },
];

const mockMedia = [
  { id: 1, name: 'banner-principal.jpg', type: 'image', thumbnail: '/portfolio/ESTUDIOK.png' },
  { id: 2, name: 'produto-1.jpg', type: 'image', thumbnail: '/portfolio/girocash.png' },
  { id: 3, name: 'video-promo.mp4', type: 'video', thumbnail: null },
  { id: 4, name: 'logo-estudiok.png', type: 'image', thumbnail: '/logo.png' },
];

const mockSchedule = [
  { id: 1, platform: 'instagram', type: 'post', title: 'Post Promoção', date: '2024-04-07', time: '10:00', status: 'scheduled' },
  { id: 2, platform: 'facebook', type: 'story', title: 'Story Novo Serviço', date: '2024-04-08', time: '14:00', status: 'scheduled' },
  { id: 3, platform: 'tiktok', type: 'video', title: 'Reels Dica', date: '2024-04-09', time: '18:00', status: 'draft' },
  { id: 4, platform: 'whatsapp', type: 'post', title: 'Mensagem Oferta', date: '2024-04-06', time: '09:00', status: 'published' },
];

const mockStats = {
  postsCreated: 24,
  postsScheduled: 8,
  postsPublished: 16,
  totalEngagement: 12450,
  reach: 45600,
  clicks: 2340,
};

export default function MarketingPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [contentType, setContentType] = useState('post');
  const [template, setTemplate] = useState('');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerated] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState('create');

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const generateContent = () => {
    if (!topic || !template) {
      alert('Selecione um modelo e descreva o tema');
      return;
    }
    setIsGenerated(true);
    setTimeout(() => {
      setGeneratedContent({
        caption: `🔥 ${topic.toUpperCase()}?\n\nVocê sabia que...\n\nAqui na ESTUDIOK transformamos ideias em resultados reais! 💡\n\n💬 Comenta aqui qual é sua maior dificuldade.\n\n👇 Clique no link para conhecer:\n\n#marketingdigital #empresa #sucesso #brasil #startup #estudiok`,
        hashtags: ['#marketingdigital', '#empresa', '#sucesso', '#brasil', '#startup', '#estudiok'],
      });
      setIsGenerated(false);
    }, 2000);
  };

  const schedulePost = () => {
    if (!generatedContent) {
      alert('Gere o conteúdo primeiro');
      return;
    }
    alert(`Post agendado para ${scheduleDate} às ${scheduleTime}!`);
  };

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Automação de Marketing</h1>
            <p className="text-gray-400">Crie, gere e agende conteúdo para suas redes sociais</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'create' ? 'bg-[#8B5CF6] text-white' : 'bg-[#0A0A0A] text-gray-400 border border-white/10'}`}
            >
              Criar
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'schedule' ? 'bg-[#8B5CF6] text-white' : 'bg-[#0A0A0A] text-gray-400 border border-white/10'}`}
            >
              Agendados
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'media' ? 'bg-[#8B5CF6] text-white' : 'bg-[#0A0A0A] text-gray-400 border border-white/10'}`}
            >
              Mídia
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'stats' ? 'bg-[#8B5CF6] text-white' : 'bg-[#0A0A0A] text-gray-400 border border-white/10'}`}
            >
              Métricas
            </button>
          </div>
        </div>

        {activeTab === 'create' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">1. Escolha as Plataformas</h2>
                <div className="flex flex-wrap gap-4">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-white font-medium">{platform.name}</span>
                      {selectedPlatforms.includes(platform.id) && (
                        <PremiumIcon name="check" size={16} className="text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">2. Tipo de Conteúdo</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setContentType(type.id)}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        contentType === type.id
                          ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className="text-3xl block mb-2">{type.icon}</span>
                      <span className="text-white text-sm font-medium">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">3. Crie seu Conteúdo</h2>
                
                <div className="mb-4">
                  <label className="text-gray-400 text-sm block mb-2">Modelo de Conteúdo</label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-white"
                  >
                    <option value="">Selecione um modelo...</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.title} - {t.category}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="text-gray-400 text-sm block mb-2">Sobre o que você quer falar?</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Criação de sites para pequenas empresas..."
                    className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-white h-24"
                  />
                </div>

                <button
                  onClick={generateContent}
                  disabled={isGenerating}
                  className="w-full bg-[#8B5CF6] hover:opacity-90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Gerando com IA...
                    </>
                  ) : (
                    <>
                      <PremiumIcon name="star" size={20} />
                      Gerar Conteúdo com IA
                    </>
                  )}
                </button>
              </div>

              {generatedContent && (
                <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-4">4. Resultado Gerado</h2>
                  
                  <div className="mb-4">
                    <label className="text-gray-400 text-sm block mb-2">Legenda</label>
                    <div className="bg-[#050505] border border-white/10 rounded-xl p-4 text-white whitespace-pre-wrap">
                      {generatedContent.caption}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-gray-400 text-sm block mb-2">Hashtags</label>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.hashtags.map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-gray-400 text-sm block mb-2">Data</label>
                      <input 
                        type="date" 
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm block mb-2">Hora</label>
                      <input 
                        type="time" 
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={schedulePost}
                      className="flex-1 bg-[#8B5CF6] hover:opacity-90 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <PremiumIcon name="calendar" size={16} />
                      Agendar Post
                    </button>
                    <button className="flex-1 bg-green-500 hover:opacity-90 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                      <PremiumIcon name="arrow-right" size={16} />
                      Publicar Agora
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Estatísticas do Mês</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-[#050505] rounded-xl">
                    <span className="text-gray-400">Posts Criados</span>
                    <span className="text-white font-bold text-xl">{mockStats.postsCreated}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#050505] rounded-xl">
                    <span className="text-gray-400">Agendados</span>
                    <span className="text-[#8B5CF6] font-bold text-xl">{mockStats.postsScheduled}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#050505] rounded-xl">
                    <span className="text-gray-400">Publicados</span>
                    <span className="text-green-500 font-bold text-xl">{mockStats.postsPublished}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#050505] rounded-xl">
                    <span className="text-gray-400">Engajamento</span>
                    <span className="text-white font-bold text-xl">{mockStats.totalEngagement.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Próximos Posts</h3>
                <div className="space-y-3">
                  {mockSchedule.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex items-center gap-3 p-3 bg-[#050505] rounded-xl">
                      <div className="text-2xl">
                        {platforms.find(p => p.id === post.platform)?.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{post.title}</p>
                        <p className="text-gray-500 text-xs">{post.date} às {post.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-500' : 
                        post.status === 'published' ? 'bg-green-500/20 text-green-500' : 
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {post.status === 'scheduled' ? 'Agendado' : post.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Posts Agendados</h2>
            <div className="space-y-4">
              {mockSchedule.map((post) => (
                <div key={post.id} className="flex items-center gap-4 p-4 bg-[#050505] rounded-xl border border-white/10">
                  <div className="text-3xl">
                    {platforms.find(p => p.id === post.platform)?.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{post.title}</h3>
                    <p className="text-gray-400 text-sm">{post.date} às {post.time}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      post.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-500' : 
                      post.status === 'published' ? 'bg-green-500/20 text-green-500' : 
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {post.status === 'scheduled' ? 'Agendado' : post.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-white">
                    <PremiumIcon name="edit" size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500">
                    <PremiumIcon name="delete" size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Biblioteca de Mídia</h2>
              <button className="bg-[#8B5CF6] hover:opacity-90 text-white px-4 py-2 rounded-xl font-medium">
                + Upload
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mockMedia.map((media) => (
                <div key={media.id} className="relative group">
                  <div className="aspect-square bg-[#050505] rounded-xl border border-white/10 overflow-hidden">
                    {media.thumbnail ? (
                      <img src={media.thumbnail} alt={media.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">🎬</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mt-2 truncate">{media.name}</p>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <button className="bg-white text-black px-3 py-1 rounded-lg text-sm font-medium">Usar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
              <div className="text-gray-400 text-sm mb-2">Total de Posts</div>
              <div className="text-4xl font-black text-white">24</div>
              <div className="text-green-500 text-sm mt-2">+12% este mês</div>
            </div>
            <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
              <div className="text-gray-400 text-sm mb-2">Alcance Total</div>
              <div className="text-4xl font-black text-white">45.6K</div>
              <div className="text-green-500 text-sm mt-2">+23% este mês</div>
            </div>
            <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
              <div className="text-gray-400 text-sm mb-2">Engajamento</div>
              <div className="text-4xl font-black text-white">12.4K</div>
              <div className="text-green-500 text-sm mt-2">+8% este mês</div>
            </div>
            <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
              <div className="text-gray-400 text-sm mb-2">Cliques</div>
              <div className="text-4xl font-black text-white">2.34K</div>
              <div className="text-green-500 text-sm mt-2">+15% este mês</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}