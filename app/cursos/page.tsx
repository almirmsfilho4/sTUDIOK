'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument } from '@/lib/firebase-services';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  lessons: number;
  category: string;
  level: 'iniciante' | 'intermediário' | 'avançado';
  price: number;
  featured: boolean;
  modules: { title: string; lessons: { title: string; videoUrl: string; duration: string }[] }[];
}

const coursesData: Course[] = [
  {
    id: '1',
    title: ' Introdução ao Desenvolvimento Web',
    description: 'Aprenda os fundamentos da criação de sites e aplicações web do zero.',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
    duration: '8 horas',
    lessons: 24,
    category: 'Desenvolvimento',
    level: 'iniciante',
    price: 0,
    featured: true,
    modules: [
      {
        title: 'Módulo 1: HTML Básico',
        lessons: [
          { title: 'Introdução ao HTML', videoUrl: '', duration: '15 min' },
          { title: 'Tags e Elementos', videoUrl: '', duration: '20 min' },
          { title: 'Formulários', videoUrl: '', duration: '25 min' },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'CSS Moderno',
    description: 'Domine CSS moderno com Flexbox, Grid e animações.',
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=400&fit=crop',
    duration: '6 horas',
    lessons: 18,
    category: 'Design',
    level: 'intermediário',
    price: 97,
    featured: true,
    modules: []
  },
  {
    id: '3',
    title: 'JavaScript do Básico ao Avançado',
    description: 'Curso completo de JavaScript para aplicações modernas.',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=400&fit=crop',
    duration: '12 horas',
    lessons: 36,
    category: 'Programação',
    level: 'avançado',
    price: 197,
    featured: false,
    modules: []
  },
];

export default function CoursesPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [myCourses, setMyCourses] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/cursos');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadMyCourses();
    }
  }, [user]);

  const loadMyCourses = async () => {
    try {
      const data = await getDocuments('enrollments');
      const myCourseIds = (data as any[]).filter(e => e.userId === user?.uid).map(e => e.courseId);
      setMyCourses(myCourseIds);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const enrollCourse = async (courseId: string) => {
    if (!user) return;
    try {
      await createDocument('enrollments', {
        userId: user.uid,
        courseId,
        enrolledAt: new Date(),
        progress: 0
      });
      setMyCourses(prev => [...prev, courseId]);
      router.push(`/cursos/${courseId}`);
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  const filteredCourses = filter === 'all' 
    ? courses 
    : filter === 'free' 
    ? courses.filter(c => c.price === 0)
    : courses.filter(c => c.price > 0);

  const levelColors = {
    iniciante: 'bg-green-500/20 text-green-500',
    intermediário: 'bg-yellow-500/20 text-yellow-500',
    avançado: 'bg-red-500/20 text-red-500'
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ESTUDIOK" className="w-12 h-12 object-contain" />
            <span className="font-bold text-xl">Cursos</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="text-gray-300 hover:text-[#00D4FF]">
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Academia <span className="text-[#00D4FF]">ESTUDIOK</span>
            </h1>
            <p className="text-gray-400">
              Aprenda com os melhores especialistas em tecnologia
            </p>
          </div>

          <div className="flex gap-2 justify-center mb-8">
            {['all', 'free', 'premium'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm ${
                  filter === f ? 'bg-[#00D4FF] text-black' : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#242424]'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'free' ? 'Gratuitos' : 'Premium'}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <div key={course.id} className="card overflow-hidden group">
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {course.price === 0 && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      GRÁTIS
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${levelColors[course.level]}`}>
                      {course.level}
                    </span>
                    <span className="text-xs text-gray-500">{course.category}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>⏱ {course.duration}</span>
                    <span>📚 {course.lessons} aulas</span>
                  </div>
                  {myCourses.includes(course.id) ? (
                    <button 
                      onClick={() => router.push(`/cursos/${course.id}`)}
                      className="btn-primary w-full"
                    >
                      Continuar Curso
                    </button>
                  ) : (
                    <button 
                      onClick={() => course.price === 0 ? enrollCourse(course.id) : router.push(`/cursos/${course.id}`)}
                      className="btn-primary w-full"
                    >
                      {course.price === 0 ? 'Inscrever-se Grátis' : `R$ ${course.price} - Matricular`}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
