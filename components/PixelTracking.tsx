'use client';

import { useEffect } from 'react';

interface PixelTrackingProps {
  pixelId?: string;
  eventName?: string;
}

export default function PixelTracking({ pixelId, eventName }: PixelTrackingProps) {
  useEffect(() => {
    if (pixelId && typeof window !== 'undefined') {
      (window as any).fbq = (window as any).fbq || function() {
        ((window as any).fbq.q = (window as any).fbq.q || []).push(arguments);
      };
      (window as any).fbq.l = +new Date();
      
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=${eventName || 'PageView'}&noscript=1`;
      
      document.head.appendChild(img);
    }
  }, [pixelId, eventName]);

  return null;
}

export function fireLeadEvent(pixelId?: string) {
  if (pixelId && typeof window !== 'undefined') {
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=Lead&noscript=1`;
    document.head.appendChild(img);
  }
}

export function firePurchaseEvent(pixelId: string, value: number, currency: string = 'BRL') {
  if (typeof window !== 'undefined') {
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=Purchase&value=${value}&currency=${currency}&noscript=1`;
    document.head.appendChild(img);
  }
}

export function fireViewContentEvent(pixelId: string, contentName: string) {
  if (typeof window !== 'undefined') {
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=ViewContent&content_name=${encodeURIComponent(contentName)}&noscript=1`;
    document.head.appendChild(img);
  }
}