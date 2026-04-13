'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const adminMenu = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Projetos', href: '/admin/projects', icon: '📁' },
  { name: 'Leads', href: '/admin/leads', icon: '👥' },
  { name: 'Portfólio', href: '/admin/portfolio', icon: '🖼️' },
  { name: 'Financeiro', href: '/admin/financeiro', icon: '💰' },
  { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
  { name: 'Marketing', href: '/admin/marketing', icon: '📢' },
  { name: 'Blog', href: '/admin/blog', icon: '📝' },
  { name: 'Relatórios', href: '/admin/relatorios', icon: '📋' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [pathname]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-lg flex items-center justify-center font-bold">
                K
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin ESTUDIOK</h1>
                <p className="text-sm text-gray-400">Painel de Controle</p>
              </div>
            </Link>
            <Link href="/" className="text-[#00D4FF] hover:underline text-sm">
              Voltar ao Site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] rounded-xl p-4">
              <h2 className="font-bold text-lg mb-4">Menu Admin</h2>
              <nav className="space-y-2">
                {adminMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.href || pathname?.startsWith(item.href + '/')
                        ? 'bg-[#00D4FF]/20 text-[#00D4FF]'
                        : 'text-gray-300 hover:bg-[#242424]'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#1A1A1A] rounded-xl p-6 min-h-[80vh]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
