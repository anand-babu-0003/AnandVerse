/**
 * Enhanced Image component with fallback handling for external URLs
 */

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  fallbackAlt?: string;
  showFallbackOnError?: boolean;
  onImageError?: (error: any) => void;
}

export function EnhancedImage({
  src,
  alt,
  fallbackSrc = 'https://placehold.co/800x600/3b82f6/ffffff?text=Image+Not+Available',
  fallbackAlt = 'Image not available',
  showFallbackOnError = true,
  onImageError,
  className,
  ...props
}: EnhancedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [imageAlt, setImageAlt] = useState(alt);
  const [hasError, setHasError] = useState(false);

  const handleError = (error: any) => {
    console.warn('Image failed to load:', imageSrc, error);
    
    if (showFallbackOnError && !hasError) {
      setImageSrc(fallbackSrc);
      setImageAlt(fallbackAlt);
      setHasError(true);
    }
    
    onImageError?.(error);
  };

  // Check if it's an external URL that might have CORS issues
  const isExternalUrl = typeof imageSrc === 'string' && 
    (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) &&
    !imageSrc.includes(process.env.NEXT_PUBLIC_SITE_URL || '');

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={imageAlt}
      className={cn(
        className,
        hasError && 'opacity-75'
      )}
      onError={handleError}
      // Add referrer policy for external images
      {...(isExternalUrl && {
        referrerPolicy: 'no-referrer'
      })}
    />
  );
}

export default EnhancedImage;
