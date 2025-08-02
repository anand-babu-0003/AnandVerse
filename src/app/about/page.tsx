
import Image from 'next/image';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, GraduationCap, Award, Sparkles, Package } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/shared/scroll-animation-wrapper';
import type { Experience, Education, Certification, Skill } from '@/lib/types';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import { getSkillsAction } from '@/actions/admin/skillsActions';
import { defaultAboutMeDataForClient, defaultSkillsDataForClient, lucideIconsMap, skillCategories } from '@/lib/data';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';


export default async function AboutPage() {
  const [aboutMeData, skillsData] = await Promise.all([
    getAboutMeDataAction(),
    getSkillsAction()
  ]);

  const displayedData = aboutMeData || defaultAboutMeDataForClient; 
  const displayedSkills = skillsData || defaultSkillsDataForClient;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <ScrollAnimationWrapper>
        <PageHeader 
          title="About Me" 
          subtitle={`Get to know the person behind the code: ${(displayedData.name || 'User').split(' ')[0]}.`}
        />
      </ScrollAnimationWrapper>

      <div className="grid lg:grid-cols-3 gap-12 items-start mb-16 md:mb-24">
        <ScrollAnimationWrapper className="lg:col-span-1 flex flex-col items-center" delay={100}>
          <Image
            src={displayedData.profileImage || defaultAboutMeDataForClient.profileImage}
            alt={`Profile picture of ${displayedData.name || defaultAboutMeDataForClient.name}`}
            width={350}
            height={350}
            className="rounded-full shadow-2xl object-cover mb-8 aspect-square"
            data-ai-hint={displayedData.dataAiHint || defaultAboutMeDataForClient.dataAiHint}
            priority
          />
          <h2 className="font-headline text-3xl font-semibold text-primary text-center">{displayedData.name || defaultAboutMeDataForClient.name}</h2>
          <p className="text-muted-foreground text-center mt-1">{displayedData.title || defaultAboutMeDataForClient.title}</p>
        </ScrollAnimationWrapper>

        <ScrollAnimationWrapper className="lg:col-span-2" delay={200}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">My Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-lg text-foreground/80 leading-relaxed">
              {(displayedData.bio || defaultAboutMeDataForClient.bio).split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </CardContent>
          </Card>
        </ScrollAnimationWrapper>
      </div>

      <ScrollAnimationWrapper className="mb-16 md:mb-24" delay={300}>
        <section id="experience-education">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-8 text-center">My Journey</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h3 className="font-headline text-2xl font-semibold text-primary/90 mb-6 flex items-center">
                <Briefcase className="mr-3 h-7 w-7 text-primary" /> Professional Journey
              </h3>
              <div className="space-y-6">
                {(displayedData.experience || []).length > 0 ? (
                  (displayedData.experience || []).map((exp: Experience, index: number) => (
                    <ScrollAnimationWrapper key={exp.id || `exp-${index}-${Date.now()}`} delay={index * 100}>
                      <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="font-headline text-xl text-primary">{exp.role}</CardTitle>
                          <p className="text-sm text-muted-foreground">{exp.company} | {exp.period}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-foreground/80">{exp.description}</p>
                        </CardContent>
                      </Card>
                    </ScrollAnimationWrapper>
                  ))
                ) : (
                    <p className="text-muted-foreground">No professional experience listed yet. Updates are on the way!</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <h3 className="font-headline text-2xl font-semibold text-primary/90 mb-6 flex items-center">
                <GraduationCap className="mr-3 h-7 w-7 text-primary" /> Academic Background
              </h3>
              <div className="space-y-6">
                {(displayedData.education || []).length > 0 ? (
                  (displayedData.education || []).map((edu: Education, index: number) => (
                    <ScrollAnimationWrapper key={edu.id || `edu-${index}-${Date.now()}`} delay={index * 100}>
                      <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="font-headline text-xl text-primary">{edu.degree}</CardTitle>
                          <p className="text-sm text-muted-foreground">{edu.institution} | {edu.period}</p>
                        </CardHeader>
                      </Card>
                    </ScrollAnimationWrapper>
                  ))
                ) : (
                  <p className="text-muted-foreground">No academic background listed yet. Details coming soon!</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <h3 className="font-headline text-2xl font-semibold text-primary/90 mb-6 flex items-center">
                <Award className="mr-3 h-7 w-7 text-primary" /> Certifications
              </h3>
              <div className="space-y-6">
                {(displayedData.certifications || []).length > 0 ? (
                  (displayedData.certifications || []).map((cert: Certification, index: number) => (
                    <ScrollAnimationWrapper key={cert.id || `cert-${index}-${Date.now()}`} delay={index * 100}>
                      <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="font-headline text-xl text-primary">{cert.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{cert.issuingBody} | {cert.date}</p>
                        </CardHeader>
                      </Card>
                    </ScrollAnimationWrapper>
                  ))
                ) : (
                  <p className="text-muted-foreground">No certifications listed yet. Details coming soon!</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimationWrapper>

       <ScrollAnimationWrapper id="skills">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-primary mb-12">My Skills & Expertise</h2>
        <div className="space-y-12">
            {skillCategories.map((category, categoryIndex) => {
            const categorySkills = displayedSkills.filter((skill) => skill.category === category);
            
            if (categorySkills.length === 0) return null; 

            return (
                <ScrollAnimationWrapper key={category} delay={categoryIndex * 100}>
                <Card className="shadow-xl overflow-hidden rounded-xl">
                    <CardHeader className="bg-muted/30">
                    <CardTitle className="font-headline text-2xl md:text-3xl text-center text-primary py-2 flex items-center justify-center gap-3">
                        <Sparkles className="h-7 w-7" />
                        {category}
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categorySkills.map((skill: Skill, skillIndex: number) => {
                        const IconComponent = lucideIconsMap[skill.iconName] || Package;
                        return (
                            <ScrollAnimationWrapper key={skill.id || `skill-${category}-${skillIndex}-${Date.now()}`} delay={skillIndex * 50} threshold={0.05}>
                            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] h-full flex flex-col rounded-lg overflow-hidden border border-border/70">
                                <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
                                <IconComponent className="h-12 w-12 text-primary mb-4" aria-hidden="true" />
                                <h3 className="text-xl font-semibold font-headline text-primary/95 mb-3">{skill.name}</h3>

                                <div className="w-full mt-auto pt-3">
                                    {skill.proficiency !== undefined && skill.proficiency !== null ? (
                                    <>
                                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-1 px-1">
                                        <span>Proficiency</span>
                                        <span>{skill.proficiency}%</span>
                                        </div>
                                        <Progress
                                        value={skill.proficiency}
                                        aria-label={`${skill.name} proficiency ${skill.proficiency}%`}
                                        className="h-2 rounded-full"
                                        />
                                    </>
                                    ) : (
                                    <div className="text-center pt-2">
                                        <Badge variant="outline" className="font-normal text-xs px-2 py-0.5 border-primary/30 text-primary/80">Experienced</Badge>
                                    </div>
                                    )}
                                </div>
                                </CardContent>
                            </Card>
                            </ScrollAnimationWrapper>
                        );
                        })}
                    </div>
                    </CardContent>
                </Card>
                </ScrollAnimationWrapper>
            );
            })}
            {displayedSkills.length === 0 && (
                <ScrollAnimationWrapper className="text-center">
                    <p className="text-muted-foreground text-lg">
                    My skills are currently being polished! Please check back soon for a full list.
                    </p>
                </ScrollAnimationWrapper>
            )}
        </div>
      </ScrollAnimationWrapper>
    </div>
  );
}
