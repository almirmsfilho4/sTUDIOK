'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function PremiumSidebar() {
  const pathname = usePathname();
  const { userData, signOut } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Leads', href: '/admin/leads', icon: '👥' },
    { label: 'Projetos', href: '/admin/projects', icon: '📁' },
    { label: 'Portfólio', href: '/admin/portfolio', icon: '🎨' },
    { label: 'Financeiro', href: '/admin/financeiro', icon: '💰' },
    { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { label: 'Marketing', href: '/admin/marketing', icon: '📣' },
    { label: 'Assinaturas', href: '/admin/assinaturas', icon: '💳' },
    { label: 'Indicações', href: '/admin/indicacoes', icon: '🤝' },
    { label: 'API Status', href: '/admin/api-status', icon: '🔌' },
  ];

  const toggleItem = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <aside className="w-64 min-h-screen bg-[#0A0A0A] border-r border-[#1A1A1A] flex flex-col">
      <div className="p-6 border-b border-[#1A1A1A]">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <img src="/logo.png" alt="ESTUDIOK" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="font-bold text-lg">ESTUDIOK</h1>
            <p className="text-xs text-gray-500">Painel Admin</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-[#00D4FF]/20 text-[#00D4FF]'
                : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1A1A1A]">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B2CBF] flex items-center justify-center font-bold text-black">
            {userData?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{userData?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500">{userData?.email || 'admin@estudiok.com'}</p>
          </div>
        </div>
        <Link
          href="/"
          className="block text-center text-sm text-gray-400 hover:text-[#00D4FF] py-2"
        >
          Ver Site
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full text-center text-sm text-red-400 hover:text-red-300 py-2"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
