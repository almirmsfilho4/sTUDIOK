'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Algo deu errado</h2>
        <p className="text-gray-400 mb-6">
          Ocorreu um erro ao carregar o painel admin. Por favor, tente novamente.
        </p>
        <button
          onClick={reset}
          className="bg-[#00D4FF] text-black px-6 py-3 rounded-lg font-bold hover:opacity-90"
        >
          🔄 Tentar Novamente
        </button>
        <a
          href="/"
          className="block mt-4 text-[#00D4FF] hover:underline"
        >
          ← Voltar ao Site
        </a>
      </div>
    </div>
  );
}