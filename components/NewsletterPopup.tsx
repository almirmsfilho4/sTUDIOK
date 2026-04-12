'use client';

import { useState, useEffect } from 'react';
import { createDocument } from '@/lib/firebase-services';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const hasSeen = localStorage.getItem('newsletter_seen');
        if (!hasSeen) {
          setIsVisible(true);
        }
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await createDocument('newsletters', {
        email,
        createdAt: new Date(),
        source: 'popup'
      });
      setSubmitted(true);
      localStorage.setItem('newsletter_seen', 'true');
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter_seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-fade-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Obrigado!</h3>
            <p className="text-gray-400">Você receberá nossas novidades em breve.</p>
          </div>
        ) : (
          <div className="text-center">
            <img 
              src="/logo.png" 
              alt="ESTUDIOK" 
              className="w-20 h-20 object-contain mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">
              Receba <span className="text-[#00D4FF]">Ofertas Exclusivas</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Inscreva-se e receba dicas de marketing, promoções e novidades sobre tecnologia.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor email"
                required
                className="input-field w-full"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Inscrevendo...' : 'Quero Receber'}
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4">
              Sem spam. Prometemos!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
