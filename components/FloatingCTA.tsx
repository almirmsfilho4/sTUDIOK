'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    visible && (
      <div className="fixed bottom-4 right-4 z-40 animate-[slideIn_0.5s_ease-out]">
        <div className="bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-xl p-1 shadow-2xl">
          <div className="bg-[#0A0A0A] rounded-lg p-4 relative">
            <button 
              onClick={() => setDismissed(true)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
            
            <div className="text-center">
              <p className="text-sm text-white font-medium mb-3">
                🚀 Quer um site profissional?
              </p>
              <Link 
                href="/orcamento"
                className="inline-block bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-black font-bold py-2 px-4 rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                Solicitar Orçamento →
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  );
}