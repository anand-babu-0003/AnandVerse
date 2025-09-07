import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar,
  Clock,
  User,
  Code,
  Globe,
  Star,
  ChevronRight,
  CheckCircle,
  Zap,
  Shield,
  Heart
} from 'lucide-react';
import { getPortfolioItemBySlugAction } from '@/actions/admin/portfolioActions';
import { defaultPortfolioItemsDataForClient } from '@/lib/data';
import type { PortfolioItem } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Starfield from '@/components/layout/starfield';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Remove static generation - use dynamic routes instead

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  if (!slug) {
    console.warn("PortfolioDetailPage: No slug provided in params.");
    notFound();
  }

  let project: PortfolioItem | null = null;
  try {
    project = await getPortfolioItemBySlugAction(slug);
  } catch (error) {
    console.error(`Error fetching portfolio item for slug ${slug}:`, error);
    // project remains null, notFound() will be called below
  }

  if (!project) {
    notFound();
  }

  // Process images - filter out empty strings and ensure we have valid URLs
  const displayImages = (project.images || [])
    .filter((img): img is string => Boolean(img) && img.trim() !== '')
    .slice(0, 5); // Limit to 5 images for performance

  // Process tags
  const projectTags = Array.isArray(project.tags) ? project.tags : [];


  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Starfield />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Back Button */}
          <Button asChild variant="outline" className="mb-8">
            <Link href="/portfolio">
              <span className="flex items-center gap-2">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
              </span>
            </Link>
          </Button>

          {/* Project Header */}
          <div className="py-12 md:py-16 text-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
              {project.title || 'Project Details'}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {project.description || 'Explore this amazing project'}
            </p>
          </div>

          {/* Hero Section with Images */}
          {displayImages.length > 0 && (
            <div className="mb-16">
              <Carousel className="w-full max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden">
                <CarouselContent>
                  {displayImages.map((src, index) => (
                    <CarouselItem key={`${project.slug || 'project'}-image-${index}-${src ? src.split('/').pop() : 'placeholder'}`}>
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

          <div className="max-w-6xl mx-auto space-y-16">
            {/* Project Overview */}
            <Card className="card-professional">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="font-headline text-3xl text-primary mb-2">
                      {project.title || 'Untitled Project'}
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                      {project.description || 'No description available.'}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.liveUrl && (
                      <Button asChild size="lg" className="btn-modern">
                        <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Live Demo
                        </Link>
                      </Button>
                    )}
                    {project.repoUrl && (
                      <Button asChild size="lg" variant="outline" className="btn-modern">
                        <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-5 w-5" />
                          View Code
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Technologies Used */}
            {projectTags.length > 0 && (
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                    <Code className="h-6 w-6" />
                    Technologies Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {projectTags.map((tag) => (
                      <Badge key={tag} variant="default" className="text-sm px-4 py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* README File Display */}
            {project.repoUrl && (
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                    <Code className="h-6 w-6" />
                    README.md
                  </CardTitle>
                  <CardDescription>
                    Project documentation and setup instructions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-6 border">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="ml-2 text-sm text-muted-foreground font-mono">README.md</span>
                    </div>
                    <div className="prose prose-sm max-w-none font-mono text-foreground/80">
                      <pre className="whitespace-pre-wrap">
{`# ${project.title || 'Project'}

${project.description || 'A professional project built with modern technologies.'}

## 🚀 Features

- Responsive design for all devices
- Modern UI/UX with clean interface
- Optimized performance and fast loading
- Cross-browser compatibility
- Professional code structure

## 🛠️ Technologies Used

${projectTags.map(tag => `- ${tag}`).join('\n')}

## 📦 Installation

\`\`\`bash
# Clone the repository
git clone ${project.repoUrl}

# Navigate to project directory
cd ${project.title?.toLowerCase().replace(/\s+/g, '-') || 'project'}

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## 🎯 Usage

1. Follow the installation steps above
2. Configure your environment variables
3. Run the development server
4. Open your browser and navigate to the local URL

## 🌐 Live Demo

${project.liveUrl ? `Visit the live demo: [${project.liveUrl}](${project.liveUrl})` : 'Live demo coming soon!'}

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For questions or support, please open an issue in the repository.`}
                      </pre>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          View on GitHub
                        </Link>
                      </Button>
                      {project.liveUrl && (
                        <Button asChild size="sm" variant="outline">
                          <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Live Demo
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-professional text-center">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">2024</div>
                  <div className="text-sm text-muted-foreground">Year Completed</div>
                </CardContent>
              </Card>
              
              <Card className="card-professional text-center">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">2-4 Weeks</div>
                  <div className="text-sm text-muted-foreground">Development Time</div>
                </CardContent>
              </Card>
              
              <Card className="card-professional text-center">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-2">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </CardContent>
              </Card>
            </div>

            {/* Key Features */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Responsive Design</h4>
                      <p className="text-sm text-muted-foreground">Fully responsive across all devices and screen sizes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Modern UI/UX</h4>
                      <p className="text-sm text-muted-foreground">Clean, intuitive user interface with excellent user experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Performance Optimized</h4>
                      <p className="text-sm text-muted-foreground">Fast loading times and optimized performance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Cross-browser Compatible</h4>
                      <p className="text-sm text-muted-foreground">Works seamlessly across all modern browsers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="card-professional bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-8 pb-8 text-center">
                <h3 className="text-2xl font-bold text-primary mb-4">Interested in this project?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Let's discuss how we can work together to bring your ideas to life with similar quality and attention to detail.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="btn-modern">
                    <Link href="/contact">
                      <span className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Get In Touch
                      </span>
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="btn-modern">
                    <Link href="/portfolio">
                      <span className="flex items-center gap-2">
                        View More Projects
                        <ChevronRight className="h-5 w-5" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}