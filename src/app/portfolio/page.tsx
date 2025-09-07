import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Briefcase, 
  ExternalLink, 
  Github, 
  Eye,
  Filter,
  Search,
  Calendar,
  Tag
} from 'lucide-react';
import { fetchAllPortfolioItems } from '@/actions/fetchAllDataAction';
import Starfield from '@/components/layout/starfield';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PortfolioPage() {
  const portfolioItems = await fetchAllPortfolioItems();

  const categories = Array.from(new Set(portfolioItems.flatMap(item => item.tags || [])));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        {/* Animated Starfield */}
        <Starfield density={0.6} speed={0.4} twinkleSpeed={0.02} />
        
        <div className="relative container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium border border-primary/20 mb-4 sm:mb-6">
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
              My Work
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
              <span className="text-gradient">Portfolio</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
              A collection of projects I've passionately built, showcasing my skills in modern web development, 
              design, and problem-solving.
            </p>
            <div className="flex flex-col xs:flex-row justify-center items-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="btn-modern px-6 sm:px-8 py-2.5 sm:py-3 w-full xs:w-auto">
                <Link href="/contact">
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                    Start a Project
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Stats */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center p-4 sm:p-6 card-modern">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{portfolioItems.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Projects</div>
            </div>
            <div className="text-center p-4 sm:p-6 card-modern">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{categories.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Technologies</div>
            </div>
            <div className="text-center p-4 sm:p-6 card-modern">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">3+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center p-4 sm:p-6 card-modern">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 sm:py-20 md:py-32">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {portfolioItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {portfolioItems.map((project, index) => (
                <Card key={project.id || `portfolio-${index}`} className="card-modern group overflow-hidden">
                  {/* Project Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={Array.isArray(project.images) && project.images.length > 0 ? project.images[0] : 'https://placehold.co/600x400.png'}
                      alt={`Screenshot of ${project.title || 'Project'}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={project.dataAiHint || 'project technology'}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Action Buttons */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        {project.liveUrl && (
                          <Button 
                            asChild 
                            size="sm"
                            className="bg-white text-foreground hover:bg-white/90 text-xs sm:text-sm"
                          >
                            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              <span className="hidden xs:inline">Live Demo</span>
                              <span className="xs:hidden">Demo</span>
                            </Link>
                          </Button>
                        )}
                        {project.repoUrl && (
                          <Button 
                            asChild 
                            size="sm"
                            variant="outline"
                            className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                          >
                            <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Code
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-base sm:text-lg font-semibold mb-2">
                          {project.title || 'Untitled Project'}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-sm sm:text-base">
                          {project.description || 'No description available.'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                    {/* Tags */}
                    {Array.isArray(project.tags) && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {project.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tags.length - 4} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Project Meta */}
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      {project.createdAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{new Date(project.createdAt).getFullYear()}</span>
                        </div>
                      )}
                      {project.category && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{project.category}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      {project.liveUrl && (
                        <Button asChild size="sm" variant="outline" className="flex-1 text-xs sm:text-sm">
                          <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Demo
                          </Link>
                        </Button>
                      )}
                      {project.repoUrl && (
                        <Button asChild size="sm" variant="outline" className="flex-1 text-xs sm:text-sm">
                          <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Code
                          </Link>
                        </Button>
                      )}
                      {project.slug && (
                        <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 text-xs sm:text-sm">
                          <Link href={`/portfolio/${project.slug}`}>
                            Details
                            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20">
              <div className="max-w-md mx-auto px-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Projects Coming Soon</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                  I'm currently working on some exciting projects. Check back soon to see what I've been building!
                </p>
                <Button asChild size="lg" className="btn-modern px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto">
                  <Link href="/contact">
                    <span className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                      Start a Project
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-32 bg-gradient-royal">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Have a Project in{' '}
              <span className="text-white/90">Mind?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
              I'm always excited to work on new projects and help bring your ideas to life. 
              Let's discuss how we can work together to create something amazing.
            </p>
            <div className="flex flex-col xs:flex-row justify-center items-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-6 sm:px-8 py-2.5 sm:py-3 w-full xs:w-auto">
                <Link href="/contact">
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                    Get in Touch
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </span>
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6 sm:px-8 py-2.5 sm:py-3 w-full xs:w-auto">
                <Link href="/about">
                  <span className="flex items-center gap-2">
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