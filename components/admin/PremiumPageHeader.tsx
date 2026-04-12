'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function PremiumPageHeader() {
  const pathname = usePathname();
  
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { href, label };
  });

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
      <Link href="/admin" className="hover:text-white transition-colors">
        Admin
      </Link>
      {breadcrumbs.slice(1).map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-2">
          <span>/</span>
          <Link href={crumb.href} className="hover:text-white transition-colors">
            {crumb.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
