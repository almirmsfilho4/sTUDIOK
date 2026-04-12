'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlanosRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/precos');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecionando...</p>
      </div>
    </div>
  );
}