"use client";

import { useEffect, useState } from 'react';
import { preloadImage } from '@/components/ui/optimized-image';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { cn } from '@/lib/utils';

interface ImagePreloaderProps {
  images: string[];
  priority?: boolean;
  delay?: number;
}

export function ImagePreloader({ images, priority = false, delay = 0 }: ImagePreloaderProps) {
  useEffect(() => {
    if (!priority) return;

    const preloadImages = () => {
      images.forEach((src, index) => {
        if (src && src.trim() !== '') {
          // Stagger preloading to avoid overwhelming the browser
          setTimeout(() => {
            preloadImage(src);
          }, index * 100);
        }
      });
    };

    if (delay > 0) {
      const timer = setTimeout(preloadImages, delay);
      return () => clearTimeout(timer);
    } else {
      preloadImages();
    }
  }, [images, priority, delay]);

  return null;
}

// Hook for lazy loading images with intersection observer
export function useImageLazyLoading() {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref]);

  return { ref: setRef, isVisible };
}

// Component for progressive image loading
interface ProgressiveImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

export function ProgressiveImage({
  src,
  alt,
  placeholder,
  className,
  width,
  height,
  fill = false,
  priority = false,
  quality = 85,
  sizes,
}: ProgressiveImageProps) {
  const { ref, isVisible } = useImageLazyLoading();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
  };

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {/* Placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm">Image failed to load</div>
          </div>
        </div>
      )}
      
      {/* Main image */}
      {isVisible && !imageError && (
        <OptimizedImage
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={cn(
            "transition-opacity duration-500",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          priority={priority}
          quality={quality}
          sizes={sizes}
          placeholder="blur"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

// Utility function to generate responsive image sizes
export function generateImageSizes(breakpoints: { [key: string]: string } = {}) {
  const defaultBreakpoints = {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  };

  const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };
  
  return Object.entries(mergedBreakpoints)
    .map(([key, value]) => `(max-width: ${value}) 100vw`)
    .join(', ') + ', 100vw';
}

// Utility function to optimize image URLs
export function optimizeImageUrl(url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
} = {}) {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  const { width, height, quality = 85, format = 'webp' } = options;
  
  // For external URLs, return as-is (Next.js will handle optimization)
  if (url.startsWith('http')) {
    return url;
  }

  // For local images, you could add optimization logic here
  return url;
}
