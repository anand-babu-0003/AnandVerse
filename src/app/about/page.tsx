import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  ExternalLink,
  Heart,
  Code,
  Zap,
  Target,
  Users,
  CheckCircle,
  Sparkles,
  Rocket,
  Coffee,
  Globe,
  Lightbulb,
  TrendingUp,
  Clock
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
  const skills = appData.skills || [];
  const portfolioItems = appData.portfolioItems || [];
  
  // Generate structured data
  const structuredData = await generatePersonStructuredData(displayedData);
  
  const bioParagraphs = (displayedData.bio || 'Passionate developer creating amazing digital experiences.').split('\n\n');
  const experience = displayedData.experience || [];
  const education = displayedData.education || [];

  // Personal values and philosophy
  const values = [
    {
      icon: Heart,
      title: 'Passion-Driven',
      description: 'I believe in creating solutions that matter, driven by genuine passion for technology and its potential to make a difference.'
    },
    {
      icon: Target,
      title: 'Results-Oriented',
      description: 'Every project is approached with clear goals and measurable outcomes, ensuring client satisfaction and project success.'
    },
    {
      icon: Users,
      title: 'Collaborative',
      description: 'Great products come from great partnerships. I work closely with clients to understand their vision and bring it to life.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Staying ahead of the curve with cutting-edge technologies and modern development practices to deliver exceptional results.'
    }
  ];

  // Fun facts
  const funFacts = [
    { icon: Coffee, text: 'Coffee enthusiast' },
    { icon: Globe, text: 'Remote work advocate' },
    { icon: Code, text: 'Open source contributor' },
    { icon: Lightbulb, text: 'Problem solver at heart' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Hero Section */}
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
              <User className="h-4 w-4" />
              About Me
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Get to Know
              </span>
              <span className="block bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent mt-2">
                The Developer
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
              Learn about my journey, passion, and what drives me to create{' '}
              <span className="font-semibold text-primary">amazing</span> digital experiences
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
              <Button asChild size="lg" className="btn-modern px-8 py-3 text-lg font-semibold">
                <Link href="/contact">
                  <span className="flex items-center gap-3">
                    <Mail className="h-5 w-5" />
                    Get in Touch
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="px-8 py-3 text-lg">
                <Link href="/portfolio">
                  <span className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5" />
                    View My Work
                  </span>
                </Link>
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-xl transition-all duration-300 hover-glow">
                <div className="text-3xl font-bold text-primary mb-2">3+</div>
                <div className="text-sm text-muted-foreground">Years</div>
              </div>
              
              <div className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-xl transition-all duration-300 hover-glow">
                <div className="text-3xl font-bold text-primary mb-2">{portfolioItems.length}+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              
              <div className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-xl transition-all duration-300 hover-glow">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
              
              <div className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-xl transition-all duration-300 hover-glow">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 dark:via-slate-900/50 to-transparent" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Profile Image */}
              <div className="text-center lg:text-left">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-xl"></div>
                  <Image
                    src={displayedData.profileImage || defaultAboutMeDataForClient.profileImage}
                    alt={`Profile picture of ${displayedData.name || defaultAboutMeDataForClient.name}`}
                    width={400}
                    height={400}
                    className="relative rounded-3xl shadow-modern-lg object-cover aspect-square border border-border"
                    data-ai-hint={displayedData.dataAiHint || defaultAboutMeDataForClient.dataAiHint}
                    priority
                  />
                </div>
              </div>

              {/* Story Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
                  <Sparkles className="h-4 w-4" />
                  My Story
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    Hi, I'm {displayedData.name?.split(' ')[0] || 'Anand'}
                  </span>
                </h2>

                <div className="space-y-4">
                  {bioParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Fun Facts */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {funFacts.map((fact, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                      <fact.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{fact.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
                <Heart className="h-4 w-4" />
                Values & Philosophy
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  What Drives Me
                </span>
              </h2>

              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                These core values guide every project and interaction, ensuring exceptional results and meaningful partnerships.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <Card key={value.title} className="card-modern text-center group hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl mx-auto mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <value.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-semibold">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Experience Timeline */}
      {(experience.length > 0 || education.length > 0) && (
        <section className="py-16 sm:py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
                  <Award className="h-4 w-4" />
                  Journey & Experience
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    My Professional Journey
                  </span>
                </h2>

                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  A timeline of my professional growth, education, and key milestones that shaped my career.
                </p>
              </div>

              <div className="space-y-8">
                {/* Experience */}
                {experience.length > 0 && experience.map((exp, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <h3 className="text-xl font-bold text-foreground mb-2">{exp.title}</h3>
                        <p className="text-primary font-semibold mb-2">{exp.company}</p>
                        <p className="text-sm text-muted-foreground mb-3">{exp.period}</p>
                        <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Education */}
                {education.length > 0 && education.map((edu, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <h3 className="text-xl font-bold text-foreground mb-2">{edu.degree}</h3>
                        <p className="text-primary font-semibold mb-2">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground mb-3">{edu.period}</p>
                        <p className="text-muted-foreground leading-relaxed">{edu.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {experience.length === 0 && education.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Award className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">Experience Coming Soon</h3>
                    <p className="text-muted-foreground mb-6">
                      I'm currently building my professional journey. Check back soon for updates!
                    </p>
                    <Button asChild className="btn-modern">
                      <Link href="/contact">
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Let's Connect
                        </span>
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="py-16 sm:py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
                  <TrendingUp className="h-4 w-4" />
                  Technical Skills
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    Skills & Expertise
                  </span>
                </h2>

                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Here's a comprehensive overview of my technical skills and proficiency levels across different technologies.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {skills.map((skill, index) => (
                  <Card key={skill.id || `skill-${index}`} className="card-modern group hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                        <Code className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-3">{skill.name}</h4>
                      {skill.proficiency !== undefined && skill.proficiency !== null ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>Proficiency</span>
                            <span className="font-semibold text-primary">{skill.proficiency}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                            {skill.proficiency >= 80 ? (
                              <>
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span className="text-green-600">Expert</span>
                              </>
                            ) : skill.proficiency >= 60 ? (
                              <>
                                <Zap className="h-3 w-3 text-yellow-500" />
                                <span className="text-yellow-600">Proficient</span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 text-blue-500" />
                                <span className="text-blue-600">Learning</span>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          Experienced
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-32 bg-gradient-royal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Start Your{' '}
              <span className="text-white/90">Next Project?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
              I'm always excited to work on new challenges and help bring your ideas to life. Let's create something amazing together.
            </p>
            <div className="flex flex-col xs:flex-row justify-center items-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-6 sm:px-8 py-2.5 sm:py-3 w-full xs:w-auto">
                <Link href="/contact">
                  <span className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
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