'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const adminMenu = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Projetos', href: '/admin/projects', icon: '📁' },
  { name: 'Leads', href: '/admin/leads', icon: '👥' },
  { name: 'Portfólio', href: '/admin/portfolio', icon: '🖼️' },
  { name: 'Financeiro', href: '/admin/financeiro', icon: '💰' },
  { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
  { name: 'Marketing', href: '/admin/marketing', icon: '📢' },
  { name: 'Email Marketing', href: '/admin/marketing/bulk-email', icon: '✉️' },
  { name: 'Blog', href: '/admin/blog', icon: '📝' },
  { name: 'Templates', href: '/admin/templates', icon: '🎨' },
  { name: 'Galeria', href: '/admin/galeria', icon: '🖼️' },
  { name: 'IA Content', href: '/admin/ai/content', icon: '🤖' },
  { name: 'Relatórios', href: '/admin/relatorios', icon: '📋' },
  { name: 'Indicações', href: '/admin/indicacoes', icon: '🤝' },
  { name: 'API Status', href: '/admin/api-status', icon: '🔌' },
  { name: 'Webhooks', href: '/admin/webhooks', icon: '⚡' },
  { name: 'Contratos', href: '/admin/contratos', icon: '📄' },
  { name: 'Fila', href: '/admin/fila', icon: '⏳' },
  { name: 'Agendamentos', href: '/admin/agendamentos', icon: '📅' },
  { name: 'Avaliações', href: '/admin/avaliacoes', icon: '⭐' },
  { name: 'Cupons', href: '/admin/cupons', icon: '🎫' },
  { name: 'Assinaturas', href: '/admin/assinaturas', icon: '📋' },
  { name: 'Fiscal', href: '/admin/fiscal', icon: '📊' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = '';
    };
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="ESTUDIOK Logo" 
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold">Admin ESTUDIOK</h1>
                  <p className="text-sm text-gray-400">Painel de Controle Completo</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-[#00D4FF] hover:underline text-sm">
                Voltar ao Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar Menu */}
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
              
              <div className="mt-6 pt-4 border-t border-[#242424]">
                <p className="text-xs text-gray-500 mb-2">Quick Stats</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-[#242424] rounded-lg">
                    <p className="text-sm font-bold">0</p>
                    <p className="text-xs text-gray-400">Leads Hoje</p>
                  </div>
                  <div className="text-center p-2 bg-[#242424] rounded-lg">
                    <p className="text-sm font-bold">0</p>
                    <p className="text-xs text-gray-400">Projetos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
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
