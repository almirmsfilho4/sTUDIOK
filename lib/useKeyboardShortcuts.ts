'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function useGlobalShortcuts() {
  const router = useRouter();

  const shortcuts: KeyboardShortcut[] = [
    { key: 'h', alt: true, action: () => router.push('/'), description: 'Ir para Home' },
    { key: 'd', alt: true, action: () => router.push('/dashboard'), description: 'Ir para Dashboard' },
    { key: 'a', alt: true, action: () => router.push('/admin'), description: 'Ir para Admin' },
    { key: 'p', alt: true, action: () => router.push('/portfolio'), description: 'Ir para Portfólio' },
    { key: 'q', alt: true, action: () => router.push('/quiz'), description: 'Ir para Orçamento' },
    { key: 'c', alt: true, action: () => router.push('/contato'), description: 'Ir para Contato' },
    { key: 'l', alt: true, action: () => router.push('/login'), description: 'Ir para Login' },
  ];

  useKeyboardShortcuts(shortcuts);
}

export const globalShortcuts: KeyboardShortcut[] = [
  { key: 'h', alt: true, action: () => {}, description: 'Home' },
  { key: 'd', alt: true, action: () => {}, description: 'Dashboard' },
  { key: 'a', alt: true, action: () => {}, description: 'Admin' },
  { key: 'p', alt: true, action: () => {}, description: 'Portfolio' },
  { key: 'q', alt: true, action: () => {}, description: 'Quiz' },
  { key: 'c', alt: true, action: () => {}, description: 'Contato' },
];