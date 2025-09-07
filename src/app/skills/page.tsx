import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Code, 
  Star,
  TrendingUp,
  Award,
  Zap,
  Shield,
  Users,
  Target,
  Lightbulb
} from 'lucide-react';
import { fetchAllSkills } from '@/actions/fetchAllDataAction';
import Starfield from '@/components/layout/starfield';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SkillsPage() {
  const allSkills = await fetchAllSkills();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        {/* Animated Starfield */}
        <Starfield density={0.5} speed={0.35} twinkleSpeed={0.025} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
              <Code className="h-4 w-4" />
              Technical Skills
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-gradient">Skills & Expertise</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              A comprehensive overview of my technical skills, tools, and technologies I use to create 
              exceptional digital experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {allSkills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allSkills.map((skill, index) => (
                <Card key={skill.id || `skill-${index}`} className="card-modern group">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{skill.name}</h4>
                    {skill.proficiency !== undefined && skill.proficiency !== null ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>Proficiency</span>
                          <span className="font-semibold text-primary">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Experienced
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Code className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Skills Coming Soon</h3>
                <p className="text-muted-foreground mb-8">
                  I'm constantly learning and updating my skill set. Check back soon to see my technical expertise!
                </p>
                <Button asChild size="lg" className="btn-modern px-8 py-3">
                  <Link href="/contact">
                    <span className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Let's Discuss Your Project
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-royal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Something{' '}
              <span className="text-white/90">Amazing?</span>
            </h2>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              I'm always excited to work on new projects and help bring your ideas to life. 
              Let's discuss how my skills can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-3">
                <Link href="/contact">
                  <span className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Start a Project
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3">
                <Link href="/portfolio">
                  <span className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
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