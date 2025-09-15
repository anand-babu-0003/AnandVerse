import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface SEOImageProps extends Omit<ImageProps, 'alt'> {
  alt: string;
  title?: string;
  caption?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function SEOImage({
  alt,
  title,
  caption,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  className,
  ...props
}: SEOImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Generate a simple blur data URL if none provided
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

  return (
    <figure className={`seo-image-container ${className || ''}`}>
      <Image
        {...props}
        alt={alt}
        title={title || alt}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        onLoad={() => setIsLoading(false)}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className || ''}`}
        sizes={props.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        loading={priority ? 'eager' : 'lazy'}
      />
      {caption && (
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// SEO-optimized portfolio image component
interface SEOPortfolioImageProps {
  src: string;
  alt: string;
  title: string;
  description?: string;
  priority?: boolean;
  className?: string;
}

export function SEOPortfolioImage({
  src,
  alt,
  title,
  description,
  priority = false,
  className,
}: SEOPortfolioImageProps) {
  return (
    <SEOImage
      src={src}
      alt={`${title} - ${alt}`}
      title={`${title} - Portfolio Project`}
      caption={description}
      priority={priority}
      className={className}
      width={800}
      height={600}
      quality={90}
    />
  );
}

// SEO-optimized blog image component
interface SEOBlogImageProps {
  src: string;
  alt: string;
  title: string;
  caption?: string;
  priority?: boolean;
  className?: string;
}

export function SEOBlogImage({
  src,
  alt,
  title,
  caption,
  priority = false,
  className,
}: SEOBlogImageProps) {
  return (
    <SEOImage
      src={src}
      alt={`${title} - ${alt}`}
      title={`${title} - Blog Post Image`}
      caption={caption}
      priority={priority}
      className={className}
      width={1200}
      height={630}
      quality={85}
    />
  );
}

// SEO-optimized avatar image component
interface SEOAvatarImageProps {
  src: string;
  alt: string;
  name: string;
  title?: string;
  className?: string;
}

export function SEOAvatarImage({
  src,
  alt,
  name,
  title,
  className,
}: SEOAvatarImageProps) {
  return (
    <SEOImage
      src={src}
      alt={`${name} - ${alt}`}
      title={title || `${name} - Profile Picture`}
      className={`rounded-full ${className || ''}`}
      width={200}
      height={200}
      quality={95}
      priority
    />
  );
}
