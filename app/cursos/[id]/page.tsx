'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Lesson {
  title: string;
  videoUrl: string;
  duration: string;
  completed?: boolean;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  lessons: number;
  category: string;
  level: string;
  price: number;
  modules: Module[];
}

const courseData: Record<string, Course> = {
  '1': {
    id: '1',
    title: 'Introdução ao Desenvolvimento Web',
    description: 'Aprenda os fundamentos da criação de sites e aplicações web do zero.',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
    duration: '8 horas',
    lessons: 24,
    category: 'Desenvolvimento',
    level: 'iniciante',
    price: 0,
    modules: [
      {
        title: 'Módulo 1: HTML Básico',
        lessons: [
          { title: 'O que é HTML?', videoUrl: 'https://www.youtube.com/embed/ok-plXyR3fA', duration: '15 min', completed: true },
          { title: 'Estrutura de uma página', videoUrl: 'https://www.youtube.com/embed/ok-plXyR3fA', duration: '20 min', completed: true },
          { title: 'Tags principais', videoUrl: 'https://www.youtube.com/embed/ok-plXyR3fA', duration: '25 min', completed: false },
          { title: 'Formulários HTML', videoUrl: 'https://www.youtube.com/embed/ok-plXyR3fA', duration: '30 min', completed: false },
        ]
      },
      {
        title: 'Módulo 2: CSS Básico',
        lessons: [
          { title: 'Introdução ao CSS', videoUrl: 'https://www.youtube.com/embed/ok-plXyR3fA', duration: '15 min', completed: false },
          { title: 'Seletores CSS', videoUrl: 'https://www.youtube.com/embed/ok-plXyR3fA', duration: '20 min', completed: false },
          { title: 'Box Model', videoUrl: 'https://www.youtube.com/embed/ok-plXyR3fA', duration: '25 min', completed: false },
        ]
      }
    ]
  },
  '2': {
    id: '2',
    title: 'CSS Moderno',
    description: 'Domine CSS moderno com Flexbox, Grid e animações.',
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=400&fit=crop',
    duration: '6 horas',
    lessons: 18,
    category: 'Design',
    level: 'intermediário',
    price: 97,
    modules: []
  },
  '3': {
    id: '3',
    title: 'JavaScript do Básico ao Avançado',
    description: 'Curso completo de JavaScript para aplicações modernas.',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=400&fit=crop',
    duration: '12 horas',
    lessons: 36,
    category: 'Programação',
    level: 'avançado',
    price: 197,
    modules: []
  },
};

export default function CoursePlayerPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const c = courseData[courseId];
    if (c) {
      setCourse(c);
      const firstLesson = c.modules[0]?.lessons[0];
      if (firstLesson) setCurrentLesson(firstLesson);
    }
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
          <button onClick={() => router.push('/cursos')} className="text-[#00D4FF] hover:underline">
            Ver todos os cursos
          </button>
        </div>
      </div>
    );
  }

  const allLessons = course.modules.flatMap(m => m.lessons);
  const completedLessons = allLessons.filter(l => l.completed).length;
  const progress = Math.round((completedLessons / allLessons.length) * 100) || 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden transition-all duration-300 border-r border-[#1A1A1A] fixed md:relative h-screen`}>
        <div className="w-80 h-full overflow-y-auto bg-[#0A0A0A]">
          <div className="p-4 border-b border-[#1A1A1A]">
            <button onClick={() => router.push('/cursos')} className="text-[#00D4FF] text-sm mb-2">
              ← Voltar aos Cursos
            </button>
            <h2 className="font-bold">{course.title}</h2>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00D4FF] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {course.modules.map((module, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="font-medium text-sm text-gray-400 mb-2">{module.title}</h3>
                <div className="space-y-1">
                  {module.lessons.map((lesson, lIdx) => (
                    <button
                      key={lIdx}
                      onClick={() => setCurrentLesson(lesson)}
                      className={`w-full text-left p-2 rounded-lg text-sm flex items-center gap-2 ${
                        currentLesson?.title === lesson.title 
                          ? 'bg-[#00D4FF]/10 text-[#00D4FF]' 
                          : 'hover:bg-[#1A1A1A] text-gray-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        lesson.completed ? 'bg-green-500' : 'bg-[#242424]'
                      }`}>
                        {lesson.completed ? '✓' : lIdx + 1}
                      </span>
                      <span className="flex-1">{lesson.title}</span>
                      <span className="text-xs text-gray-500">{lesson.duration}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-4 flex items-center justify-between border-b border-[#1A1A1A]">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-gray-400 text-sm">
            {currentLesson?.title}
          </div>
          <div></div>
        </div>

        <div className="aspect-video bg-[#000]">
          {currentLesson?.videoUrl ? (
            <iframe
              src={currentLesson.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Selecione uma aula para começar</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{currentLesson?.title}</h1>
          <p className="text-gray-400">Duração: {currentLesson?.duration}</p>
        </div>
      </main>
    </div>
  );
}
