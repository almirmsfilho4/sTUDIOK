'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = '';
    };
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {children}
    </div>
  );
}
