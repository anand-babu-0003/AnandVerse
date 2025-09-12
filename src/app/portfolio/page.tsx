import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  Eye,
  Briefcase,
  Github,
  Code,
  Zap,
  Users,
  Target,
  CheckCircle,
  Sparkles,
  Rocket,
  Mail,
  User,
  ExternalLink
} from 'lucide-react';
import { fetchAllPortfolioItems } from '@/actions/fetchAllDataAction';
import Starfield from '@/components/layout/starfield';
import type { PortfolioItem } from '@/lib/types';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Image from 'next/image';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Portfolio | Creative Digital Solutions',
    description: 'Discover innovative web development projects that blend creativity with cutting-edge technology. From concept to deployment, delivering exceptional digital experiences.',
    keywords: ['portfolio', 'web development', 'creative solutions', 'react', 'nextjs', 'typescript', 'ui/ux', 'full-stack'],
    type: 'website',
  });
}

export default async function PortfolioPage() {
  const portfolioItems = await fetchAllPortfolioItems();
  const categories = Array.from(new Set(portfolioItems.flatMap(item => item.tags || [])));
  
  // Calculate portfolio statistics
  const totalTechnologies = categories.length;
  const featuredProjects = portfolioItems.filter(item => item.tags?.includes('Featured')).length;
  const recentProjects = portfolioItems.filter(item => {
    const createdAt = new Date(item.createdAt || '');
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return createdAt > sixMonthsAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section - Redesigned */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Animated Starfield */}
        <Starfield density={0.4} speed={0.3} twinkleSpeed={0.01} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Professional Portfolio
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Creative
              </span>
              <span className="block bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent mt-2">
                Digital
              </span>
              <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mt-2">
                Solutions
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
              Transforming ideas into{' '}
              <span className="font-semibold text-primary">beautiful</span>,{' '}
              <span className="font-semibold text-blue-600">functional</span>, and{' '}
              <span className="font-semibold text-primary">innovative</span> web experiences
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
              <Button asChild size="lg" className="btn-modern px-8 py-3 text-lg font-semibold">
                <Link href="/contact">
                  <span className="flex items-center gap-3">
                    <Rocket className="h-5 w-5" />
                    Start Your Project
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="px-8 py-3 text-lg">
                <Link href="#projects">
                  <span className="flex items-center gap-3">
                    <Eye className="h-5 w-5" />
                    Explore My Work
                  </span>
                </Link>
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-xl transition-all duration-300 hover-glow">
                <div className="text-3xl font-bold text-primary mb-2">{portfolioItems.length}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              
              <div className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-xl transition-all duration-300 hover-glow">
                <div className="text-3xl font-bold text-primary mb-2">{totalTechnologies}</div>
                <div className="text-sm text-muted-foreground">Technologies</div>
              </div>
              
              <div className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-xl transition-all duration-300 hover-glow">
                <div className="text-3xl font-bold text-primary mb-2">3+</div>
                <div className="text-sm text-muted-foreground">Years</div>
              </div>
              
              <div className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-xl transition-all duration-300 hover-glow">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section - Redesigned */}
      {portfolioItems.length > 0 && (
        <section id="projects" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-muted/30">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 dark:via-slate-900/50 to-transparent" />
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
                  <Briefcase className="h-4 w-4" />
                  Featured Projects
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    Recent Projects
                  </span>
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A showcase of my recent work and the technologies I love to work with.
                </p>
              </div>

              {/* Projects Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
                {portfolioItems.slice(0, 6).map((item, index) => (
                  <Card key={item.id || `featured-${index}`} className="card-modern group overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : 'https://placehold.co/600x400.png'}
                        alt={`Screenshot of ${item.title || 'Project'}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-base sm:text-lg">{item.title || 'Untitled Project'}</CardTitle>
                      <CardDescription className="line-clamp-3 text-sm sm:text-base">
                        {item.description || 'No description available.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        {Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2">
                        {/* Project Details Button - Always visible */}
                        <Button asChild size="sm" className="w-full text-xs sm:text-sm bg-primary hover:bg-primary/90">
                          <Link href={`/portfolio/${item.slug || 'project'}`}>
                            <span className="flex items-center gap-2">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              Project Details
                              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                            </span>
                          </Link>
                        </Button>
                        
                        {/* Secondary buttons */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          {item.liveUrl && (
                            <Button asChild size="sm" variant="outline" className="flex-1 text-xs sm:text-sm">
                              <Link href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                                <span className="flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                                  Live Demo
                                </span>
                              </Link>
                            </Button>
                          )}
                          {item.repoUrl && (
                            <Button asChild size="sm" variant="outline" className="flex-1 text-xs sm:text-sm">
                              <Link href={item.repoUrl} target="_blank" rel="noopener noreferrer">
                                <span className="flex items-center gap-1">
                                  <Github className="h-3 w-3 sm:h-4 sm:w-4" />
                                  View Code
                                </span>
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* View All Projects Button */}
              {portfolioItems.length > 6 && (
                <div className="text-center">
                  <Button asChild size="lg" variant="outline" className="btn-modern-outline px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto">
                    <Link href="#all-projects">
                      <span className="flex items-center gap-2">
                        View All {portfolioItems.length} Projects
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}


      {/* Process Section */}
      <section className="py-16 sm:py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
                <Target className="h-4 w-4" />
                My Process
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  How I Work
                </span>
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A systematic approach to delivering exceptional results, from concept to deployment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  icon: Users,
                  title: 'Discovery',
                  description: 'Understanding your needs and goals'
                },
                {
                  icon: Code,
                  title: 'Design',
                  description: 'Creating wireframes and prototypes'
                },
                {
                  icon: Zap,
                  title: 'Development',
                  description: 'Building with modern technologies'
                },
                {
                  icon: CheckCircle,
                  title: 'Deploy',
                  description: 'Testing and launching your project'
                }
              ].map((step, index) => (
                <Card key={step.title} className="card-modern text-center">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl mx-auto mb-3 sm:mb-4">
                      <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-semibold">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-32 bg-gradient-royal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Start Your{' '}
              <span className="text-white/90">Next Project?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
              Let's work together to create something amazing. I'm always excited to take on new challenges and help bring your ideas to life.
            </p>
            <div className="flex flex-col xs:flex-row justify-center items-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-6 sm:px-8 py-2.5 sm:py-3 w-full xs:w-auto">
                <Link href="/contact">
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                    Get in Touch
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </span>
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6 sm:px-8 py-2.5 sm:py-3 w-full xs:w-auto">
                <Link href="/about">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    Learn More About Me
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}