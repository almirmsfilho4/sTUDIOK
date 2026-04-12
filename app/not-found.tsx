'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-8">
      <div className="max-w-lg text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-[#00D4FF] mb-4">Página não encontrada</h1>
        <p className="text-gray-400 mb-8">
          A página que você procura não existe ou foi movida.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#00D4FF] text-black font-medium rounded-lg hover:bg-[#00B8E0] transition-colors"
          >
            Voltar ao início
          </Link>
          <Link
            href="/contato"
            className="px-6 py-3 bg-[#1A1A1A] text-white font-medium rounded-lg hover:bg-[#242424] transition-colors"
          >
            Fale conosco
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Use os atalhos do teclado:</p>
          <div className="flex gap-4 justify-center mt-2">
            <span className="px-2 py-1 bg-[#1A1A1A] rounded">Alt + H</span>
            <span className="px-2 py-1 bg-[#1A1A1A] rounded">Home</span>
          </div>
        </div>
      </div>
    </div>
  );
}