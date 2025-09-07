
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Code2, ArrowRight, ExternalLink, Github } from 'lucide-react';
import type { PortfolioItem } from '@/lib/types';

interface PortfolioCardProps {
  project: PortfolioItem;
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  const imageUrl = (Array.isArray(project.images) && project.images.length > 0 && project.images[0]) 
                   ? project.images[0] 
                   : 'https://placehold.co/600x400.png';
  const projectTags = Array.isArray(project.tags) ? project.tags : [];

  return (
    <Card className="group flex flex-col h-full overflow-hidden card-professional rounded-lg">
      {/* Image Section */}
      <CardHeader className="p-0 relative aspect-video overflow-hidden">
        <Image
          src={imageUrl}
          alt={`Screenshot of ${project.title || 'Project'}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={project.dataAiHint || 'project technology'}
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/50">
          <div className="flex gap-2">
            {project.liveUrl && (
              <Button 
                asChild 
                size="sm"
                className="bg-white text-foreground hover:bg-white/90 transition-colors duration-200"
              >
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Demo
                </Link>
              </Button>
            )}
            {project.repoUrl && (
              <Button 
                asChild 
                size="sm"
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors duration-200"
              >
                <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  Code
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="p-6 flex-grow space-y-4">
        <div>
          <CardTitle className="font-headline text-lg text-foreground mb-3">
            {project.title || 'Untitled Project'}
          </CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed line-clamp-3">
            {project.description || 'No description available.'}
          </CardDescription>
        </div>

        {/* Tags */}
        {projectTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {projectTags.slice(0, 4).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs bg-muted text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
            {projectTags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{projectTags.length - 4} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="p-6 pt-0">
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-2">
            {project.liveUrl && (
              <Button 
                asChild 
                size="sm"
                variant="outline"
                className="border-border hover:bg-muted/50 transition-colors duration-200"
              >
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  Demo
                </Link>
              </Button>
            )}
            {project.repoUrl && (
              <Button 
                asChild 
                size="sm"
                variant="outline"
                className="border-border hover:bg-muted/50 transition-colors duration-200"
              >
                <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Code2 className="h-4 w-4 mr-2" />
                  Code
                </Link>
              </Button>
            )}
          </div>
          
          {project.slug && (
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors duration-200"
            >
              <Link href={`/portfolio/${project.slug}`}>
                <span className="flex items-center gap-2">
                  Details
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
