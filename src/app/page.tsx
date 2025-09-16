import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Code, 
  Briefcase, 
  User, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter,
  Star,
  Zap,
  Shield,
  Heart
} from 'lucide-react';
import { fetchAllDataFromFirestore } from '@/actions/fetchAllDataAction';
import { defaultAboutMeDataForClient } from '@/lib/data';
import Starfield from '@/components/layout/starfield';
import { generatePageMetadata } from '@/lib/seo';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';
import type { Metadata } from 'next';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettingsAction();
  
  const metadata = generatePageMetadata({
    title: siteSettings.homePageMetaTitle || 'Professional Web Developer & Designer',
    description: siteSettings.homePageMetaDescription || 'Professional web developer specializing in modern web technologies. Creating beautiful, responsive, and user-friendly websites and applications.',
    keywords: ['web developer', 'frontend developer', 'react', 'nextjs', 'typescript', 'portfolio', 'web design', 'full stack developer'],
    type: 'website',
    pageMetaTags: siteSettings.homePageMetaTags,
  });

  // Add website structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteSettings.siteName || 'AnandVerse',
    description: siteSettings.defaultMetaDescription || 'Professional web developer specializing in modern web technologies.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://anandverse.com',
    author: {
      '@type': 'Person',
      name: 'Anand Verma',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://anandverse.com'}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return {
    ...metadata,
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
}

export default async function Home() {
  // Fetch all data from Firestore
  const appData = await fetchAllDataFromFirestore();
  const siteSettings = await getSiteSettingsAction();
  
  const displayedAboutMe = appData.aboutMe;
  const allPortfolioItems = appData.portfolioItems;
  const allSkills = appData.skills;

  // Get featured items
  const featuredProjects = allPortfolioItems.slice(0, 3);
  const featuredSkills = allSkills.slice(0, 6);
  // Create a short glimpse of the bio - first three sentences or up to 200 characters
  const fullBio = displayedAboutMe.bio || '';
  const sentences = fullBio.split('.');
  const firstThreeSentences = sentences.length >= 3 
    ? sentences.slice(0, 3).join('.') + '.'
    : sentences.length >= 2 
    ? sentences.slice(0, 2).join('.') + '.'
    : fullBio;
  const bioGlimpse = firstThreeSentences.length > 200 ? firstThreeSentences.substring(0, 200) + '...' : firstThreeSentences;
  const firstParagraphBio = bioGlimpse || 'Passionate developer creating amazing digital experiences.';


  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for performance with modern web technologies and best practices.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built with security in mind, following industry standards and best practices.',
    },
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Well-structured, maintainable code that follows modern development principles.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 overflow-hidden min-h-screen flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Animated Starfield */}
        <Starfield density={0.6} speed={0.2} twinkleSpeed={0.01} />
        
        <div className="relative z-10 container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-center w-full">
          <div className="max-w-6xl mx-auto">
            {/* Greeting Badge */}
            <div className="inline-flex items-center gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-primary/10 text-primary text-xs xs:text-sm font-medium border border-primary/20 mb-4 xs:mb-6 sm:mb-8 animate-fade-in">
              <Code className="h-3 w-3 xs:h-4 xs:w-4" />
              <span className="hidden xs:inline">Welcome to my digital space</span>
              <span className="xs:hidden">Welcome</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight mb-4 xs:mb-6 sm:mb-8 animate-fade-in leading-tight">
              <span className="block text-foreground mb-1 xs:mb-2 sm:mb-3">
                Hi, I&apos;m{' '}
                <span className="text-gradient">
                  {(displayedAboutMe.name || 'User').split(' ')[0]}
                </span>
              </span>
              <span className="block text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-muted-foreground font-normal leading-tight">
                {displayedAboutMe.title || 'Full-Stack Developer'}
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-6 xs:mb-8 sm:mb-10 lg:mb-12 animate-fade-in px-2 xs:px-4 sm:px-6 md:px-0">
              {firstParagraphBio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col xs:flex-row justify-center items-center gap-3 xs:gap-4 sm:gap-6 mb-8 xs:mb-10 sm:mb-12 lg:mb-16 animate-fade-in px-2 xs:px-4 sm:px-6 md:px-0">
              <Button asChild size="lg" className="btn-modern px-6 xs:px-8 sm:px-10 py-2.5 xs:py-3 sm:py-4 w-full xs:w-auto text-sm xs:text-base sm:text-lg font-semibold min-h-[44px]">
                <Link href="/portfolio">
                  <span className="flex items-center gap-2 xs:gap-3">
                    <Briefcase className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
                    <span className="hidden xs:inline">View My Work</span>
                    <span className="xs:hidden">Portfolio</span>
                    <ArrowRight className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                  </span>
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="btn-modern-outline px-6 xs:px-8 sm:px-10 py-2.5 xs:py-3 sm:py-4 w-full xs:w-auto text-sm xs:text-base sm:text-lg font-semibold min-h-[44px]">
                <Link href="/contact">
                  <span className="flex items-center gap-2 xs:gap-3">
                    <Mail className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
                    <span className="hidden xs:inline">Get in Touch</span>
                    <span className="xs:hidden">Contact</span>
                  </span>
                </Link>
              </Button>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-3 xs:bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-4 h-6 sm:w-5 sm:h-8 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-0.5 h-1.5 sm:w-1 sm:h-2 bg-primary/60 rounded-full mt-1 sm:mt-1.5 animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 md:gap-16 items-center">
            <div className="space-y-4 xs:space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div>
                <div className="inline-flex items-center gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-primary/10 text-primary text-xs xs:text-sm font-medium border border-primary/20 mb-3 xs:mb-4 sm:mb-6">
                  <User className="h-3 w-3 xs:h-4 xs:w-4" />
                  About Me
                </div>
                <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 xs:mb-4 sm:mb-6 leading-tight">
                  Passionate Developer &{' '}
                  <span className="text-gradient">Problem Solver</span>
                </h2>
                <p className="text-sm xs:text-base sm:text-lg text-muted-foreground leading-relaxed mb-3 xs:mb-4 sm:mb-6">
                  {firstParagraphBio}
                </p>
                <p className="text-sm xs:text-base sm:text-lg text-muted-foreground leading-relaxed">
                  I believe in creating digital experiences that not only look great but also solve real-world problems. 
                  Every project is an opportunity to learn, grow, and make a positive impact.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                <div className="text-center p-3 xs:p-4 sm:p-6 card-modern">
                  <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary mb-1 xs:mb-2">3+</div>
                  <div className="text-xs xs:text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center p-3 xs:p-4 sm:p-6 card-modern">
                  <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary mb-1 xs:mb-2">{allPortfolioItems.length}+</div>
                  <div className="text-xs xs:text-sm text-muted-foreground">Projects Delivered</div>
                </div>
              </div>

              <Button asChild size="lg" className="btn-modern px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 w-full sm:w-auto text-sm xs:text-base">
                <Link href="/about">
                  <span className="flex items-center gap-2">
                    <span className="hidden xs:inline">Learn More About Me</span>
                    <span className="xs:hidden">Learn More</span>
                    <ArrowRight className="h-3 w-3 xs:h-4 xs:w-4" />
                  </span>
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-xs xs:max-w-sm sm:max-w-md">
                <Image
                  src={displayedAboutMe.profileImage || defaultAboutMeDataForClient.profileImage}
                  alt={`Profile picture of ${(displayedAboutMe.name || defaultAboutMeDataForClient.name).split(' ')[0]}`}
                  width={400}
                  height={400}
                  className="rounded-2xl shadow-modern-xl object-cover aspect-square border border-border w-full h-auto"
                  data-ai-hint={displayedAboutMe.dataAiHint || defaultAboutMeDataForClient.dataAiHint}
                  priority
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-8 xs:mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-primary/10 text-primary text-xs xs:text-sm font-medium border border-primary/20 mb-3 xs:mb-4 sm:mb-6">
              <Star className="h-3 w-3 xs:h-4 xs:w-4" />
              Why Choose Me
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 xs:mb-4 sm:mb-6 leading-tight">
              What Makes Me{' '}
              <span className="text-gradient">Different</span>
            </h2>
            <p className="text-sm xs:text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2 xs:px-4 sm:px-0">
              I bring a unique combination of technical expertise, creative thinking, and attention to detail to every project.
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className="card-modern text-center">
                <CardHeader className="pb-2 xs:pb-3 sm:pb-4">
                  <div className="flex items-center justify-center w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl xs:rounded-2xl mx-auto mb-2 xs:mb-3 sm:mb-4">
                    <feature.icon className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <CardTitle className="text-base xs:text-lg sm:text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs xs:text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-12 xs:py-16 sm:py-20 md:py-24 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-8 xs:mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-primary/10 text-primary text-xs xs:text-sm font-medium border border-primary/20 mb-3 xs:mb-4 sm:mb-6">
              <Briefcase className="h-3 w-3 xs:h-4 xs:w-4" />
              Featured Work
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 xs:mb-4 sm:mb-6 leading-tight">
              Recent{' '}
              <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-sm xs:text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2 xs:px-4 sm:px-0">
              A showcase of my recent work and the technologies I love to work with.
            </p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8 mb-8 xs:mb-12 sm:mb-16">
              {featuredProjects.map((project, index) => (
                <Card key={project.id || `featured-${index}`} className="card-modern group overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={Array.isArray(project.images) && project.images.length > 0 ? project.images[0] : 'https://placehold.co/600x400.png'}
                      alt={`Screenshot of ${project.title || 'Project'}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 475px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader className="p-3 xs:p-4 sm:p-6">
                    <CardTitle className="text-sm xs:text-base sm:text-lg">{project.title || 'Untitled Project'}</CardTitle>
                    <CardDescription className="line-clamp-3 text-xs xs:text-sm sm:text-base">
                      {project.description || 'No description available.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 xs:p-4 sm:p-6 pt-0">
                    <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 mb-2 xs:mb-3 sm:mb-4">
                      {Array.isArray(project.tags) && project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-col xs:flex-row gap-1.5 xs:gap-2">
                      {project.liveUrl && (
                        <Button asChild size="sm" variant="outline" className="flex-1 text-xs xs:text-sm min-h-[36px]">
                          <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            View Demo
                          </Link>
                        </Button>
                      )}
                      {project.repoUrl && (
                        <Button asChild size="sm" variant="outline" className="flex-1 text-xs xs:text-sm min-h-[36px]">
                          <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                            View Code
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="max-w-md mx-auto px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Projects Coming Soon</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  I'm currently working on some exciting projects. Check back soon to see what I've been building!
                </p>
              </div>
            </div>
          )}

          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="btn-modern-outline px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto">
              <Link href="/portfolio">
                <span className="flex items-center gap-2">
                  View All Projects
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 sm:py-20 md:py-32">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium border border-primary/20 mb-4 sm:mb-6">
              <Code className="h-3 w-3 sm:h-4 sm:w-4" />
              Technical Skills
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              My{' '}
              <span className="text-gradient">Expertise</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Technologies and tools I use to bring ideas to life and solve complex problems.
            </p>
          </div>

          {featuredSkills.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 mb-12 sm:mb-16">
              {featuredSkills.map((skill, index) => (
                <Card key={skill.id || `skill-${index}`} className="card-modern text-center">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg mx-auto mb-3 sm:mb-4">
                      <Code className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2">
                      {skill.name}
                    </h3>
                    {skill.proficiency && (
                      <div className="w-full bg-muted rounded-full h-1 sm:h-1.5">
                        <div 
                          className="bg-primary h-1 sm:h-1.5 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="max-w-md mx-auto px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Code className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Skills Coming Soon</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  I'm constantly learning and updating my skill set. Check back soon to see my technical expertise!
                </p>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="btn-modern-outline px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto">
              <Link href="/skills">
                <span className="flex items-center gap-2">
                  View All Skills
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-32 bg-gradient-royal">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
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
                <Link href="/portfolio">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                    View My Work
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