import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  User, 
  MapPin, 
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Download,
  ExternalLink
} from 'lucide-react';
import { fetchAllDataFromFirestore } from '@/actions/fetchAllDataAction';
import Starfield from '@/components/layout/starfield';
import { defaultAboutMeDataForClient } from '@/lib/data';
import { generatePageMetadata, generatePersonStructuredData } from '@/lib/seo';
import type { Metadata } from 'next';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const appData = await fetchAllDataFromFirestore();
  const aboutMe = appData.aboutMe;
  
  return generatePageMetadata({
    title: 'About Me',
    description: aboutMe.bio || 'Learn about my journey, passion, and what drives me to create amazing digital experiences.',
    keywords: ['about', 'developer', 'portfolio', 'experience', 'skills'],
    type: 'website',
  });
}

export default async function AboutPage() {
  // Fetch all data from Firestore
  const appData = await fetchAllDataFromFirestore();
  const displayedData = appData.aboutMe;
  
  // Generate structured data
  const structuredData = await generatePersonStructuredData(displayedData);
  

  const bioParagraphs = (displayedData.bio || 'Passionate developer creating amazing digital experiences.').split('\n\n');
  
  // Use real experience data from Firestore
  const experience = displayedData.experience || [];

  // Use real education data from Firestore
  const education = displayedData.education || [];


  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        {/* Animated Starfield */}
        <Starfield density={0.7} speed={0.25} twinkleSpeed={0.018} />
        
        <div className="relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium border border-primary/20 mb-4 sm:mb-6">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              About Me
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
              <span className="text-gradient">About Me</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed px-4 sm:px-0">
              Get to know the person behind the code: {displayedData.name || 'User'}. 
              Learn about my journey, passion, and what drives me to create amazing digital experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid lg:grid-cols-3 gap-12 sm:gap-16 lg:gap-20 items-start">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <Card className="card-modern text-center">
                <CardContent className="p-8">
                  <div className="relative mb-8">
          <Image
            src={displayedData.profileImage || defaultAboutMeDataForClient.profileImage}
            alt={`Profile picture of ${displayedData.name || defaultAboutMeDataForClient.name}`}
                      width={200}
                      height={200}
                      className="rounded-2xl shadow-modern-lg object-cover aspect-square border border-border mx-auto"
            data-ai-hint={displayedData.dataAiHint || defaultAboutMeDataForClient.dataAiHint}
            priority
          />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {displayedData.name || defaultAboutMeDataForClient.name}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    {displayedData.title || defaultAboutMeDataForClient.title}
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                      <span>Remote</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="h-5 w-5" />
                      <span>Available for projects</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button asChild className="btn-modern w-full">
                      <Link href="/contact">
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Get in Touch
                        </span>
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="btn-modern-outline w-full">
                      <Link href="/portfolio">
                        <span className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          View My Work
                        </span>
                      </Link>
                    </Button>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-3 mt-8 pt-8 border-t border-border">
                    {displayedData.githubUrl && (
                      <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-lg">
                        <Link href={displayedData.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                          <Github className="h-5 w-5" />
                        </Link>
                      </Button>
                    )}
                    {displayedData.linkedinUrl && (
                      <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-lg">
                        <Link href={displayedData.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                          <Linkedin className="h-5 w-5" />
                        </Link>
                      </Button>
                    )}
                    {displayedData.twitterUrl && (
                      <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-lg">
                        <Link href={displayedData.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                          <Twitter className="h-5 w-5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Section */}
            <div className="lg:col-span-2 space-y-16">
              {/* My Story */}
              <Card className="card-modern">
            <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <User className="h-6 w-6 text-primary" />
                    My Story
                  </CardTitle>
            </CardHeader>
                <CardContent className="space-y-6">
                  {bioParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
              ))}
            </CardContent>
          </Card>


              {/* Experience */}
              <Card className="card-modern">
                        <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <Briefcase className="h-6 w-6 text-primary" />
                    Professional Experience
                  </CardTitle>
                        </CardHeader>
                        <CardContent>
                  <div className="space-y-6">
                    {experience.length > 0 ? experience.map((exp, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{exp.title}</h3>
                          <p className="text-primary font-medium mb-2">{exp.company}</p>
                          <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
                          <p className="text-muted-foreground">{exp.description}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No experience data available yet.</p>
                      </div>
                    )}
                  </div>
                        </CardContent>
                      </Card>

              {/* Education */}
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {education.length > 0 ? education.map((edu, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{edu.degree}</h3>
                          <p className="text-primary font-medium mb-2">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground mb-2">{edu.period}</p>
                        <p className="text-muted-foreground">{edu.description}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No education data available yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-royal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Let&apos;s Work{' '}
              <span className="text-white/90">Together</span>
            </h2>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              I'm always excited to work on new projects and help bring your ideas to life. 
              Whether you have a specific project in mind or just want to chat about possibilities, 
              I'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-3">
                <Link href="/contact">
                  <span className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Get in Touch
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3">
                <Link href="/portfolio">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
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