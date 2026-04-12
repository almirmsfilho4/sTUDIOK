'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PremiumIcon } from './PremiumIcons';

export default function AdminHeader() {
  const pathname = usePathname();

  const getPageInfo = () => {
    const path = pathname || '';
    const segments = path.split('/').filter(Boolean);
    
    const pageNames: Record<string, string> = {
      'admin': 'Dashboard',
      'dashboard': 'Dashboard',
      'leads': 'Leads',
      'ia-content': 'Conteúdo AI',
      'projects': 'Projetos',
      'portfolio': 'Portfólio',
      'financeiro': 'Financeiro',
      'assinaturas': 'Assinaturas',
      'relatórios': 'Relatórios',
      'marketing': 'Marketing',
      'analytics': 'Analytics',
      'blog': 'Blog',
      'cupons': 'Cupons',
      'settings': 'Configurações',
      'integrations': 'Integrações',
      'api-keys': 'API Keys',
      'users': 'Usuários',
      'api-status': 'Status das APIs',
      'indicacoes': 'Indicações',
      'fila': 'Fila de Projetos',
      'contratos': 'Contratos',
      'avaliacoes': 'Avaliações',
      'fiscal': 'Fiscal',
      'templates': 'Templates',
      'webhooks': 'Webhooks',
      'galeria': 'Galeria',
      'agendamentos': 'Agendamentos',
    };

    const mainPage = segments[1] || 'dashboard';
    const pageName = pageNames[mainPage] || mainPage;

    return {
      pageName,
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: pageName, href: path }
      ]
    };
  };

  const { pageName, breadcrumbs } = getPageInfo();

  return (
    <header className="h-16 bg-black/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6">
      {/* Breadcrumbs / Voltar */}
      <div className="flex items-center gap-4">
        {pathname !== '/admin/dashboard' && (
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <PremiumIcon name="ChevronLeft" size={20} />
            <span className="text-sm">Voltar ao Dashboard</span>
          </Link>
        )}
        
        {pathname === '/admin/dashboard' && (
          <div className="flex items-center gap-2">
            <PremiumIcon name="Home" size={20} />
            <span className="text-gray-400">/</span>
            <span className="text-white font-medium">{pageName}</span>
          </div>
        )}

        {pathname !== '/admin/dashboard' && (
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && (
                  <PremiumIcon name="ChevronRight" size={16} />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-white font-medium">{crumb.label}</span>
                ) : (
                  <Link 
                    href={crumb.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Ações do Header */}
      <div className="flex items-center gap-4">
        {/* Busca Rápida */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/50 w-48"
          />
          <PremiumIcon name="Search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        {/* Notificações */}
        <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
          <PremiumIcon name="Bell" size={20} />
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </button>

        {/* Ajuda */}
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <PremiumIcon name="HelpCircle" size={20} />
        </button>

        {/*Logout */}
        <Link href="/" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <PremiumIcon name="ExternalLink" size={20} />
        </Link>
      </div>
    </header>
  );
}