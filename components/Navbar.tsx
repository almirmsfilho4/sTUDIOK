'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, userData, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-dark py-3' : 'py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
<img 
                src="/logo.png" 
                alt="ESTUDIOK Logo"
                className="w-32 h-auto object-contain"
              />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/#servicos" 
              className={`text-sm font-medium transition-colors hover:text-[#00D4FF] ${
                isActive('/#servicos') ? 'text-[#00D4FF]' : 'text-gray-300'
              }`}
            >
              Serviços
            </Link>
            <Link 
              href="/#beneficios" 
              className={`text-sm font-medium transition-colors hover:text-[#00D4FF] ${
                isActive('/#beneficios') ? 'text-[#00D4FF]' : 'text-gray-300'
              }`}
            >
              Benefícios
            </Link>
<Link
  href="/#portfolio"
  className={`text-sm font-medium transition-colors hover:text-[#00D4FF] ${
    isActive('/#portfolio') ? 'text-[#00D4FF]' : 'text-gray-300'
  }`}
>
  Portfólio
</Link>
<Link
  href="/planos"
  className={`text-sm font-medium transition-colors hover:text-[#00D4FF] ${
    isActive('/planos') ? 'text-[#00D4FF]' : 'text-gray-300'
  }`}
>
  Planos
</Link>
<Link
  href="/orcamento"
  className="btn-primary text-sm"
>
              Fazer Orçamento
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-[#00D4FF] ${
                    isActive('/dashboard') ? 'text-[#00D4FF]' : 'text-gray-300'
                  }`}
                >
                  Dashboard
                </Link>
{userData?.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className={`text-sm font-medium transition-colors hover:text-[#00D4FF] ${
                        isActive('/admin') ? 'text-[#00D4FF]' : 'text-gray-300'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={toggleTheme}
                    className="p-2 text-gray-300 hover:text-[#00D4FF] transition-colors"
                    title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                  >
                    {theme === 'dark' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                  <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/cadastro" 
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-black/90 backdrop-blur-md rounded-lg p-4">
            <div className="flex flex-col gap-4">
              <Link href="/#servicos" className="text-gray-300 hover:text-[#00D4FF] py-2">Serviços</Link>
              <Link href="/#beneficios" className="text-gray-300 hover:text-[#00D4FF] py-2">Benefícios</Link>
              <Link href="/#portfolio" className="text-gray-300 hover:text-[#00D4FF] py-2">Portfólio</Link>
              <Link href="/orcamento" className="btn-primary text-center">Fazer Orçamento</Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-[#00D4FF] py-2">Dashboard</Link>
                  <button onClick={() => signOut()} className="text-left text-gray-400 py-2">Sair</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-[#00D4FF] py-2">Login</Link>
                  <Link href="/cadastro" className="btn-secondary text-center">Cadastrar</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}