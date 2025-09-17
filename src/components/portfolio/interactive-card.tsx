"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Github, 
  Eye,
  ArrowUpRight,
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react';
import { OptimizedImage, preloadImage } from '@/components/ui/optimized-image';
import Link from 'next/link';
import type { PortfolioItem } from '@/lib/types';

interface InteractiveCardProps {
  item: PortfolioItem;
  index: number;
  featured?: boolean;
}

export function InteractiveCard({ item, index, featured = false }: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Staggered animation delay
  const animationDelay = index * 150;

  return (
    <Card 
      ref={cardRef}
      className={`
        group overflow-hidden border-0 bg-card/50 backdrop-blur-sm 
        hover:bg-card/80 transition-all duration-700 hover:shadow-2xl
        transform transition-transform duration-500 hover:scale-[1.02]
        ${featured ? 'lg:col-span-2' : ''}
      `}
      style={{
        animationDelay: `${animationDelay}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards',
        opacity: 0
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <OptimizedImage
          src={item.images[0] || 'https://placehold.co/600x450.png?text=Project'}
          alt={item.title}
          fill
          className={`
            object-cover transition-all duration-700 
            ${isHovered ? 'scale-110 brightness-110' : 'scale-100 brightness-100'}
          `}
          sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          priority={featured || index < 2}
          quality={90}
          placeholder="blur"
        />
        
        {/* Dynamic gradient overlay */}
        <div 
          className={`
            absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
            transition-opacity duration-500
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        />
        
        {/* Spotlight effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(0,0,0,0.3) 70%)`
          }}
        />

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-primary text-primary-foreground animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        {/* Image count indicator */}
        {item.images.length > 1 && (
          <div className="absolute top-4 left-4 z-10" style={{ left: featured ? '5rem' : '1rem' }}>
            <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
              <Eye className="h-3 w-3" />
              {item.images.length}
            </div>
          </div>
        )}

        {/* Action buttons with enhanced animations */}
        <div className={`
          absolute top-4 right-4 flex gap-2 transition-all duration-300
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}>
          {item.liveUrl && (
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 w-8 p-0 backdrop-blur-sm hover:scale-110 transition-transform duration-200" 
              asChild
            >
              <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
          {item.repoUrl && (
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 w-8 p-0 backdrop-blur-sm hover:scale-110 transition-transform duration-200" 
              asChild
            >
              <a href={item.repoUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>

        {/* Project info overlay with enhanced animations */}
        <div className={`
          absolute bottom-0 left-0 right-0 p-6 transition-all duration-500
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          <div className="text-white space-y-3">
            <h3 className={`font-bold ${featured ? 'text-2xl' : 'text-xl'} line-clamp-2`}>
              {item.title}
            </h3>
            <p className={`text-white/90 line-clamp-2 ${featured ? 'text-base' : 'text-sm'}`}>
              {item.description}
            </p>
            
            {/* Animated tags */}
            <div className="flex flex-wrap gap-2">
              {item.tags.slice(0, featured ? 4 : 3).map((tag, tagIndex) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors duration-200"
                  style={{
                    animationDelay: `${tagIndex * 100}ms`,
                    animation: isHovered ? 'fadeInScale 0.3s ease-out forwards' : 'none'
                  }}
                >
                  {tag}
                </Badge>
              ))}
              {item.tags.length > (featured ? 4 : 3) && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  +{item.tags.length - (featured ? 4 : 3)}
                </Badge>
              )}
            </div>

            <Button 
              asChild 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-200"
            >
              <Link href={`/portfolio/${item.slug}`}>
                <span className="flex items-center gap-2">
                  View Project
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Card content with enhanced styling */}
      <CardContent className="p-6">
        {/* Date with icon animation */}
        {item.createdAt && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <Calendar className="h-3 w-3" />
            {new Date(item.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        )}
        
        <h4 className={`font-bold mb-3 line-clamp-2 ${featured ? 'text-2xl' : 'text-xl'}`}>
          {item.title}
        </h4>
        
        <p className={`text-muted-foreground mb-4 line-clamp-2 ${featured ? 'text-base' : 'text-sm'}`}>
          {item.description}
        </p>
        
        {/* Enhanced tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.slice(0, featured ? 4 : 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs hover:bg-primary/20 transition-colors duration-200">
                {tag}
              </Badge>
            ))}
            {item.tags.length > (featured ? 4 : 3) && (
              <Badge variant="secondary" className="text-xs">
                +{item.tags.length - (featured ? 4 : 3)}
              </Badge>
            )}
          </div>
        )}
        
        {/* Enhanced CTA button */}
        <Button 
          asChild 
          className="w-full bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
        >
          <Link href={`/portfolio/${item.slug}`}>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              View Project
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
