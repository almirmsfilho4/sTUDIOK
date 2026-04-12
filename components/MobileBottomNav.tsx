'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  activePaths: string[];
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkMobile = () => {
      setIsVisible(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [mounted]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const navItems: NavItem[] = [
    {
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      href: '/',
      activePaths: ['/', '/home']
    },
    {
      label: 'Orçamento',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      href: '/orcamento',
      activePaths: ['/orcamento', '/orcamento/*']
    },
    {
      label: 'Blog',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      href: '/blog',
      activePaths: ['/blog', '/blog/*']
    },
    {
      label: 'Quiz',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: '/quiz',
      activePaths: ['/quiz']
    },
    {
      label: 'Chat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      href: '#chat',
      activePaths: []
    }
  ];
  
  const isActive = (item: NavItem) => {
    if (item.href === '#chat') return false;
    return item.activePaths.some(path => 
      pathname === path || 
      (path.endsWith('/*') && pathname.startsWith(path.slice(0, -2)))
    );
  };
  
  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const chatbotBtn = document.querySelector('[data-chatbot-button]') as HTMLElement;
    if (chatbotBtn) {
      chatbotBtn.click();
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <>
      {showNotification && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-white p-3 rounded-lg shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium">Navegação otimizada para mobile!</span>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-white/80 hover:text-white"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A] border-t border-[#1A1A1A] shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item, index) => {
            const active = isActive(item);
            
            if (item.href === '#chat') {
              return (
                <button
                  key={index}
                  onClick={handleChatClick}
                  className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all hover:bg-[#1A1A1A] active:scale-95"
                >
                  <div className={`relative p-2 rounded-full ${active ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'text-gray-400 hover:text-[#00D4FF]'}`}>
                    {item.icon}
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  </div>
                  <span className={`text-xs ${active ? 'text-[#00D4FF] font-medium' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </button>
              );
            }
            
            return (
              <Link
                key={index}
                href={item.href}
                className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all hover:bg-[#1A1A1A] active:scale-95"
              >
                <div className={`relative p-2 rounded-full ${active ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'text-gray-400 hover:text-[#00D4FF]'}`}>
                  {item.icon}
                </div>
                <span className={`text-xs ${active ? 'text-[#00D4FF] font-medium' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        
        <div className="border-t border-[#242424] pt-2 px-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Sistema online</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>SSL Secure</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}