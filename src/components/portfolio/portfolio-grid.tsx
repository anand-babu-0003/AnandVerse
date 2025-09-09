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
                    />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
      {items.map((item) => (
        <Card key={item.id} className="card-modern group overflow-hidden">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={item.images[0] || 'https://placehold.co/600x400.png?text=Project'}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                {item.liveUrl && (
                  <Button asChild size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
                {item.repoUrl && (
                  <Button asChild size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <a href={item.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              {item.createdAt && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
            
            <CardTitle className="text-lg sm:text-xl font-semibold line-clamp-2">
              {item.title}
            </CardTitle>
            
            <CardDescription className="line-clamp-3">
              {item.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6 pt-0">
            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 4}
                  </Badge>
                )}
              </div>
            )}
            
            <Button asChild className="btn-modern w-full">
              <Link href={`/portfolio/${item.slug}`}>
                <span className="flex items-center gap-2">
                  View Project
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
