'use client';

import { useState } from 'react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
}

const videos: Video[] = [
  {
    id: '1',
    title: 'Criando seu primeiro site em 10 minutos',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
    duration: '10:32',
    views: 1240
  },
  {
    id: '2',
    title: 'Design responsivo: Guia completo',
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=225&fit=crop',
    duration: '15:45',
    views: 890
  },
  {
    id: '3',
    title: 'JavaScript para iniciantes',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=225&fit=crop',
    duration: '22:18',
    views: 2340
  },
  {
    id: '4',
    title: 'Como vender mais com Landing Pages',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=225&fit=crop',
    duration: '18:05',
    views: 1560
  },
];

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ESTUDIOK" className="w-12 h-12 object-contain" />
            <span className="font-bold text-xl">Vídeos</span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Vídeos e <span className="text-[#00D4FF]">Tutoriais</span>
            </h1>
            <p className="text-gray-400">
              Aprenda com nossos conteúdos gratuitos
            </p>
          </div>

          {/* Featured Video */}
          {selectedVideo && (
            <div className="mb-8">
              <div className="aspect-video bg-[#000] rounded-xl overflow-hidden mb-4">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#00D4FF]/20 flex items-center justify-center cursor-pointer hover:bg-[#00D4FF]/30 transition-colors">
                      <svg className="w-10 h-10 text-[#00D4FF] ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-gray-400">Reproduzindo: {selectedVideo.title}</p>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
              <div className="flex items-center gap-4 text-gray-400 text-sm mt-2">
                <span>👁 {selectedVideo.views} visualizações</span>
                <span>⏱ {selectedVideo.duration}</span>
              </div>
            </div>
          )}

          {/* Videos Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => (
              <button
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="card overflow-hidden text-left group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-[#00D4FF]/80 flex items-center justify-center">
                      <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-2">{video.title}</h3>
                  <p className="text-gray-500 text-sm mt-2">{video.views} visualizações</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
