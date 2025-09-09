import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Eye,
  Star,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { fetchAllPortfolioItems } from '@/actions/fetchAllDataAction';
import Starfield from '@/components/layout/starfield';
import { PortfolioFilters } from '@/components/portfolio/portfolio-filters';
import { PortfolioGrid } from '@/components/portfolio/portfolio-grid';
import type { PortfolioItem } from '@/lib/types';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Portfolio',
    description: 'Explore my portfolio of web development projects. See the technologies I use, the problems I solve, and the solutions I create.',
    keywords: ['portfolio', 'projects', 'web development', 'react', 'nextjs', 'typescript', 'projects showcase'],
    type: 'website',
  });
}

export default async function PortfolioPage() {
  const portfolioItems = await fetchAllPortfolioItems();
  const categories = Array.from(new Set(portfolioItems.flatMap(item => item.tags || [])));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        {/* Animated Starfield */}
        <Starfield density={0.6} speed={0.4} twinkleSpeed={0.02} />
        
        <div className="relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium border border-primary/20 mb-6 sm:mb-8">
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
              My Work
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-6 sm:mb-8">
              <span className="text-gradient">Portfolio</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-6 md:px-0">
              A collection of projects I've passionately built, showcasing my skills in modern web development, 
              design, and problem-solving.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
              <Button asChild size="lg" className="btn-modern px-8 sm:px-10 py-3 sm:py-4 w-full sm:w-auto text-base sm:text-lg font-semibold">
                <Link href="/contact">
                  <span className="flex items-center gap-2 sm:gap-3">
                    <ExternalLink className="h-5 w-5 sm:h-6 sm:w-6" />
                    Start a Project
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Stats */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
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

      {/* Enhanced Portfolio Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {portfolioItems.length > 0 ? (
            <div className="space-y-8">
              {/* Projects Grid */}
              <PortfolioGrid 
                items={portfolioItems}
                viewMode="grid"
              />
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