
"use client"; 

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { lucideIconsMap, skillCategories as SKILL_CATEGORIES_STATIC, defaultSkillsDataForClient } from '@/lib/data';
import type { Skill } from '@/lib/types';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import { Package, Sparkles, Code2, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FullScreenLoader from '@/components/shared/FullScreenLoader';

interface SkillsPageClientContentProps {
  initialSkills: Skill[];
  fetchError?: string | null; 
}

export default function SkillsPageClientContent({ initialSkills, fetchError }: SkillsPageClientContentProps) {
  const [skillsData, setSkillsData] = useState<Skill[]>(initialSkills);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(fetchError || null);

  useEffect(() => {
    setSkillsData(initialSkills);
    setError(fetchError || null);
  }, [initialSkills, fetchError]);

  if (error && (!skillsData || skillsData.length === 0)) {
    return (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
            <PageHeader title="Error" subtitle={error} />
        </div>
    );
  }

  const displaySkills = skillsData && skillsData.length > 0 ? skillsData : defaultSkillsDataForClient;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
                <Sparkles className="h-4 w-4" />
                Technical Skills
              </div>
              <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight mb-6">
                <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
                  Skills & Expertise
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                A curated showcase of the technologies, tools, and methodologies I leverage to build impactful solutions.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {SKILL_CATEGORIES_STATIC.map((category, categoryIndex) => {
              const categorySkills = displaySkills.filter((skill) => skill.category === category);
              
              if (categorySkills.length === 0) {
                 return null; 
              }

              return (
                <ScrollAnimationWrapper key={category} delay={categoryIndex * 100}>
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="font-headline text-3xl md:text-4xl font-bold text-gradient mb-4">
                        {category}
                      </h2>
                      <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categorySkills.map((skill: Skill, skillIndex: number) => {
                        const IconComponent = lucideIconsMap[skill.iconName] || Package;
                        return (
                          <ScrollAnimationWrapper 
                            key={skill.id || `skill-${category}-${skillIndex}-${Date.now()}`} 
                            delay={skillIndex * 50} 
                            threshold={0.05}
                          >
                            <Card className="group glass border border-primary/10 hover:border-primary/20 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-105 card-hover h-full">
                              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                                <div className="relative mb-6">
                                  <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                  <div className="relative bg-primary/10 p-4 rounded-2xl group-hover:bg-primary/20 transition-colors duration-300">
                                    <IconComponent className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                                  </div>
                                </div>
                                
                                <h3 className="text-lg font-semibold font-headline text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                                  {skill.name}
                                </h3>

                                <div className="w-full mt-auto">
                                  {skill.proficiency !== undefined && skill.proficiency !== null ? (
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                                        <span>Proficiency</span>
                                        <span className="font-semibold text-primary">{skill.proficiency}%</span>
                                      </div>
                                      <div className="w-full bg-muted rounded-full h-2">
                                        <div 
                                          className="bg-gradient-primary h-2 rounded-full transition-all duration-1000 ease-out"
                                          style={{ width: `${skill.proficiency}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <Badge 
                                        variant="secondary" 
                                        className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-300"
                                      >
                                        Experienced
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </ScrollAnimationWrapper>
                        );
                      })}
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              );
            })}
            
            {displaySkills.length === 0 && !isLoading && !error && (
              <ScrollAnimationWrapper className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Skills Coming Soon</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    My skills are currently being polished! Please check back soon for a full list of my technical expertise.
                  </p>
                </div>
              </ScrollAnimationWrapper>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
