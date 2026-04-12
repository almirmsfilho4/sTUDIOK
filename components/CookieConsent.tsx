'use client';

import { useState, useEffect } from 'react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const parsed = JSON.parse(consent);
      if (!parsed.analytics && !parsed.marketing) {
        setShowBanner(true);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      ...prefs,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
    setShowSettings(false);

    if (prefs.analytics) {
      enableAnalytics();
    }
  };

  const enableAnalytics = () => {
    console.log('Analytics enabled');
  };

  const acceptAll = () => {
    const all = { necessary: true, analytics: true, marketing: true };
    setPreferences(all);
    savePreferences(all);
  };

  const declineAll = () => {
    const minimal = { necessary: true, analytics: false, marketing: false };
    setPreferences(minimal);
    savePreferences(minimal);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-4xl mx-auto bg-[#1A1A1A] border border-[#242424] rounded-xl shadow-2xl p-6">
          {!showSettings ? (
            <>
              <div className="flex items-start gap-4">
                <div className="text-4xl">🍪</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    usamos cookies
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Utilizamos cookies para melhorar sua experiência, analisar tráfego e personalizar conteúdo. 
                    Alguns são essenciais para o funcionamento do site.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 bg-[#242424] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors text-sm"
                >
                  Personalizar
                </button>
                <button
                  onClick={declineAll}
                  className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg hover:bg-[#242424] transition-colors text-sm"
                >
                  Recusar
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 bg-[#00D4FF] text-black font-medium rounded-lg hover:bg-[#00B8E0] transition-colors text-sm"
                >
                  Aceitar Todos
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-white mb-4">
                Preferências de Cookies
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Cookies Necessários</p>
                    <p className="text-gray-400 text-xs">Essential for the website to function properly.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="w-5 h-5 accent-[#00D4FF]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Cookies Analíticos</p>
                    <p className="text-gray-400 text-xs">Help us understand how visitors interact with our website.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-5 h-5 accent-[#00D4FF]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Cookies de Marketing</p>
                    <p className="text-gray-400 text-xs">Used to track visitors across websites for advertising purposes.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-5 h-5 accent-[#00D4FF]"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg hover:bg-[#242424] transition-colors text-sm"
                >
                  Voltar
                </button>
                <button
                  onClick={() => savePreferences(preferences)}
                  className="px-4 py-2 bg-[#00D4FF] text-black font-medium rounded-lg hover:bg-[#00B8E0] transition-colors text-sm"
                >
                  Salvar Preferências
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}