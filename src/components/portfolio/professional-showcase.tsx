"use client";

import Link from 'next/link';
import { OptimizedImage, preloadImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ExternalLink, 
  Github, 
  Star,
  ArrowUpRight,
  Calendar,
  Eye,
  Code,
  Zap
} from 'lucide-react';
import type { PortfolioItem } from '@/lib/types';

interface ProfessionalShowcaseProps {
  items: PortfolioItem[];
}

export function ProfessionalShowcase({ items }: ProfessionalShowcaseProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Code className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Projects Coming Soon</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          I'm currently working on some exciting projects. Check back soon to see what I've been building!
        </p>
        <Button asChild size="lg" className="btn-modern">
          <Link href="/contact">
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Start a Project
            </span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Featured Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {items.slice(0, 2).map((item, index) => (
          <Card key={item.id} className="group overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:shadow-2xl">
            <div className="relative aspect-[16/10] overflow-hidden">
              <OptimizedImage
                src={item.images[0] || 'https://placehold.co/800x500.png?text=Project'}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
                quality={90}
                placeholder="blur"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Featured Badge */}
              {index === 0 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}

              {/* Image Count */}
              {item.images.length > 1 && (
                <div className="absolute top-4 left-4 ml-20">
                  <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                    <Eye className="h-3 w-3" />
                    {item.images.length}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2">
                  {item.liveUrl && (
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0 backdrop-blur-sm" asChild>
                      <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  {item.repoUrl && (
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0 backdrop-blur-sm" asChild>
                      <a href={item.repoUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Project Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/90 mb-4 line-clamp-2">{item.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link href={`/portfolio/${item.slug}`}>
                    <span className="flex items-center gap-2">
                      View Project
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Projects */}
      {items.length > 2 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold">All Projects</h3>
            <div className="text-sm text-muted-foreground">
              Showing {items.length} projects
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.slice(2).map((item) => (
              <Card key={item.id} className="group overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.images[0] || 'https://placehold.co/600x450.png?text=Project'}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Image Count */}
                  {item.images.length > 1 && (
                    <div className="absolute top-3 left-3">
                      <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                        <Eye className="h-3 w-3" />
                        {item.images.length}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      {item.liveUrl && (
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0 backdrop-blur-sm" asChild>
                          <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                      {item.repoUrl && (
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0 backdrop-blur-sm" asChild>
                          <a href={item.repoUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Project Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white">
                      <h4 className="text-lg font-semibold mb-1 line-clamp-1">{item.title}</h4>
                      <p className="text-sm text-white/90 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Date */}
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
                  
                  <h4 className="text-xl font-bold mb-3 line-clamp-2">
                    {item.title}
                  </h4>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <Link href={`/portfolio/${item.slug}`}>
                      <span className="flex items-center gap-2">
                        View Project
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
