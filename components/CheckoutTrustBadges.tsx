'use client';

import { useState, useEffect } from 'react';

export default function CheckoutTrustBadges() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-600 rounded-xl p-6 shadow-lg my-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-bold text-gray-800">
              Pagamento 100% Seguro
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
              <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">SSL</div>
                <div className="text-xs text-gray-500">Criptografia</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Stripe</div>
                <div className="text-xs text-gray-500">Processamento</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
              <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-full">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Garantia</div>
                <div className="text-xs text-gray-500">7 dias</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Compra protegida</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Dados criptografados</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Sem risco de fraude</span>
            </div>
          </div>
        </div>
        
        <div className="text-center bg-white p-4 rounded-lg shadow-md border border-green-200">
          <div className="text-xs text-gray-500 mb-1">Processamento ativo há</div>
          <div className="text-2xl font-mono font-bold text-gray-800">
            {formatTime(seconds)}
          </div>
          <div className="text-xs text-gray-500 mt-1">sem problemas</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-green-200">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16l-4-4 1.41-1.41 2.59 2.58 6.59-6.59 1.41 1.41-8 8z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold">Google Safe</div>
              <div className="text-xs text-gray-500">Verificado</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16l-4-4 1.41-1.41 2.59 2.58 6.59-6.59 1.41 1.41-8 8z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold">Norton Secured</div>
              <div className="text-xs text-gray-500">Protegido</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16l-4-4 1.41-1.41 2.59 2.58 6.59-6.59 1.41 1.41-8 8z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold">McAfee Secure</div>
              <div className="text-xs text-gray-500">Seguro</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16l-4-4 1.41-1.41 2.59 2.58 6.59-6.59 1.41 1.41-8 8z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold">TrustArc</div>
              <div className="text-xs text-gray-500">Certificado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}