'use client';

import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

useEffect(() => {
 if (priority) return;

 const observer = new IntersectionObserver(
  (entries) => {
   const entry = entries[0];
   if (entry?.isIntersecting) {
    setIsInView(true);
    observer.disconnect();
   }
  },
  { rootMargin: '100px' }
 );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const webpSrc = src.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: width && height ? `${width}/${height}` : 'auto' }}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#1A1A1A] animate-pulse" />
      )}
      {isInView && (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </picture>
      )}
    </div>
  );
}

export function getImageUrl(path: string, width?: number, height?: number): string {
  if (!path) return '/placeholder.jpg';
  
  if (path.startsWith('http')) return path;
  
  let url = path;
  if (width || height) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    url += `?${params.toString()}`;
  }
  
  return url;
}