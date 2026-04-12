'use client';

import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-8">
      <div className="max-w-lg text-center">
        <div className="text-8xl mb-6">😵</div>
        <h1 className="text-4xl font-bold text-[#00D4FF] mb-4">Ops! Algo deu errado</h1>
        <p className="text-gray-400 mb-8">
          Desculpe pelo incômodo. O erro foi registrado e nossa equipe será notificada.
        </p>
        
        {process.env.NODE_ENV === 'development' && error?.message && (
          <div className="bg-[#1A1A1A] p-4 rounded-lg text-left text-sm mb-8 overflow-auto">
            <p className="text-red-400 font-mono">{error.message}</p>
            {error.digest && (
              <p className="text-gray-500 mt-2">Error ID: {error.digest}</p>
            )}
          </div>
        )}
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#00D4FF] text-black font-medium rounded-lg hover:bg-[#00B8E0] transition-colors"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-[#1A1A1A] text-white font-medium rounded-lg hover:bg-[#242424] transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}