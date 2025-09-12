"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Github, 
  Calendar,
  Clock,
  Eye,
  Star,
  ArrowRight
} from 'lucide-react';
import type { PortfolioItem } from '@/lib/types';

interface PortfolioGridProps {
  items: PortfolioItem[];
  viewMode: 'grid' | 'list';
}

export function PortfolioGrid({ items, viewMode }: PortfolioGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Eye className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria to find more projects.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="card-modern group">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Project Image */}
                <div className="lg:w-64 flex-shrink-0">
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={item.images[0] || 'https://placehold.co/600x400.png?text=Project'}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 256px"
                    />
                    {/* Image count indicator for list view */}
                    {item.images.length > 1 && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.images.length}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Project Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Project Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    {item.createdAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    )}
                    {item.updatedAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Updated {new Date(item.updatedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 6).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 6} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" className="btn-modern">
                      <Link href={`/portfolio/${item.slug}`}>
                        <span className="flex items-center gap-2">
                          View Project
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </Link>
                    </Button>
                    
                    {item.liveUrl && (
                      <Button asChild size="sm" variant="outline">
                        <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    
                    {item.repoUrl && (
                      <Button asChild size="sm" variant="outline">
                        <a href={item.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3 w-3 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <Card key={item.id} className="group overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:shadow-2xl">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={item.images[0] || 'https://placehold.co/600x450.png?text=Project'}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Image count indicator */}
            {item.images.length > 1 && (
              <div className="absolute top-3 left-3">
                <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                  <Eye className="h-3 w-3" />
                  {item.images.length}
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                {item.liveUrl && (
                  <Button asChild size="sm" variant="secondary" className="h-8 w-8 p-0 backdrop-blur-sm">
                    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
                {item.repoUrl && (
                  <Button asChild size="sm" variant="secondary" className="h-8 w-8 p-0 backdrop-blur-sm">
                    <a href={item.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Project overlay info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-white">
                <h3 className="text-lg font-semibold mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-white/90 line-clamp-2">{item.description}</p>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
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
            
            <CardTitle className="text-xl font-bold mb-3 line-clamp-2">
              {item.title}
            </CardTitle>
            
            <CardDescription className="text-muted-foreground mb-4 line-clamp-2">
              {item.description}
            </CardDescription>
            
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
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
