
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PortfolioItem } from '@/lib/types';
import { getPortfolioItemsAction, getPortfolioItemBySlugAction } from '@/actions/admin/portfolioActions';
import { defaultPortfolioItemsDataForClient } from '@/lib/data'; 

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Remove static generation - use dynamic routes instead

export default async function PortfolioDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!params.slug) {
    console.warn("PortfolioDetailPage: No slug provided in params.");
    notFound();
  }

  let project: PortfolioItem | null = null;
  try {
    project = await getPortfolioItemBySlugAction(params.slug);
  } catch (error) {
    console.error(`Error fetching portfolio item for slug ${params.slug}:`, error);
    // project remains null, notFound() will be called below
  }

  if (!project) {
    notFound();
  }
  
  const projectImages = Array.isArray(project.images) && project.images.length > 0 
    ? project.images.filter(src => typeof src === 'string' && src.trim() !== '') // Ensure valid image URLs
    : [];
  
  const displayImages = projectImages.length > 0 
    ? projectImages
    : [defaultPortfolioItemsDataForClient[0]?.images[0] || 'https://placehold.co/1200x675.png?text=ProjectImage'];
  
  const projectTags = Array.isArray(project.tags) ? project.tags.filter(tag => typeof tag === 'string' && tag.trim() !== '') : [];


  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Button asChild variant="outline" className="mb-8">
        <Link href="/portfolio">
          <span>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </span>
        </Link>
      </Button>

      <PageHeader title={project.title || 'Project Details'} />

      {displayImages.length > 0 && (
        <div className="mb-16">
          <Carousel className="w-full max-w-3xl mx-auto shadow-2xl rounded-lg overflow-hidden">
            <CarouselContent>
              {displayImages.map((src, index) => (
                <CarouselItem key={src || `project-image-${index}-${Date.now()}`}>
                  <div className="aspect-video relative">
                    <Image
                      src={src || defaultPortfolioItemsDataForClient[0]?.images[0] || 'https://placehold.co/1200x675.png'}
                      alt={`${project.title || 'Project'} - Screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                      data-ai-hint={project.dataAiHint || 'project detail'}
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {displayImages.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-16">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">About this project</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {project.longDescription || project.description || 'Detailed project description coming soon.'}
            </p>
          </CardContent>
        </Card>

        {projectTags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Technologies Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {projectTags.map((tag) => (
                  <Badge key={tag} variant="default" className="text-sm px-3 py-1">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(project.liveUrl || project.repoUrl) && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <Button asChild>
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <span className="inline-flex items-center">
                        <ExternalLink className="mr-2 h-5 w-5" /> View Live Demo
                      </span>
                    </Link>
                  </Button>
                )}
                {project.repoUrl && (
                  <Button asChild variant="secondary">
                    <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <span className="inline-flex items-center">
                        <Github className="mr-2 h-5 w-5" /> View Code on GitHub
                      </span>
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {project.readmeContent && (
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Project README</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert lg:prose-lg xl:prose-xl max-w-none markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.readmeContent}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
