'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link 
        href="/" 
        className="text-gray-400 hover:text-[#00D4FF] transition-colors"
      >
        Início
      </Link>
      
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          <span className="text-gray-600">/</span>
          {item.href ? (
            <Link 
              href={item.href} 
              className="text-gray-400 hover:text-[#00D4FF] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
