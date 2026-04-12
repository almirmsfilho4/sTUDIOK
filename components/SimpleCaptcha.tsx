'use client';

import { useState, useEffect } from 'react';

interface SimpleCaptchaProps {
  onVerify: (verified: boolean) => void;
}

export default function SimpleCaptcha({ onVerify }: SimpleCaptchaProps) {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setError(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = () => {
    if (userInput.toUpperCase() === captchaText) {
      setVerified(true);
      onVerify(true);
      setError(false);
    } else {
      setError(true);
      onVerify(false);
      generateCaptcha();
    }
  };

  if (verified) {
    return (
      <div className="flex items-center gap-2 text-green-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm">Verificado</span>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#242424]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">Verificação de segurança</span>
        <button
          type="button"
          onClick={generateCaptcha}
          className="text-xs text-[#00D4FF] hover:underline"
        >
          Novo código
        </button>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="bg-[#0A0A0A] px-4 py-2 rounded font-mono text-lg tracking-wider text-[#00D4FF] select-none">
          {captchaText.split('').map((char, i) => (
            <span key={i} style={{ transform: `rotate(${Math.random() * 20 - 10}deg)` }}>
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value.toUpperCase())}
          placeholder="Digite o código"
          maxLength={5}
          className={`flex-1 bg-[#0A0A0A] border rounded-lg px-3 py-2 text-sm focus:outline-none ${
            error ? 'border-red-500' : 'border-[#242424] focus:border-[#00D4FF]'
          }`}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-[#00D4FF] text-black rounded-lg font-medium text-sm hover:bg-[#00B8E0] transition-colors"
        >
          Verificar
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-2">Código incorreto. Tente novamente.</p>
      )}
    </div>
  );
}