"use client";

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Code, 
  Globe, 
  Zap, 
  Database,
  Smartphone,
  Cloud,
  Shield,
  Palette,
  Cpu,
  GitBranch
} from 'lucide-react';

interface TechCategory {
  name: string;
  icon: React.ComponentType<any>;
  technologies: string[];
  color: string;
  description: string;
}

const techCategories: TechCategory[] = [
  {
    name: 'Frontend',
    icon: Code,
    color: 'text-blue-500',
    description: 'Modern user interfaces and experiences',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'ShadCN UI', 'Framer Motion']
  },
  {
    name: 'Backend',
    icon: Globe,
    color: 'text-green-500',
    description: 'Robust server-side solutions',
    technologies: ['Node.js', 'Express', 'Firebase', 'PostgreSQL', 'MongoDB', 'API Design']
  },
  {
    name: 'Mobile',
    icon: Smartphone,
    color: 'text-purple-500',
    description: 'Cross-platform mobile development',
    technologies: ['React Native', 'Expo', 'iOS', 'Android', 'Flutter', 'PWA']
  },
  {
    name: 'Cloud & DevOps',
    icon: Cloud,
    color: 'text-orange-500',
    description: 'Scalable cloud infrastructure',
    technologies: ['AWS', 'Vercel', 'Docker', 'Kubernetes', 'CI/CD', 'Monitoring']
  },
  {
    name: 'Design & UX',
    icon: Palette,
    color: 'text-pink-500',
    description: 'Beautiful and intuitive designs',
    technologies: ['Figma', 'Adobe XD', 'Sketch', 'Framer', 'User Research', 'Prototyping']
  },
  {
    name: 'Tools & Others',
    icon: Cpu,
    color: 'text-gray-500',
    description: 'Development tools and methodologies',
    technologies: ['Git', 'VS Code', 'Jest', 'Webpack', 'Agile', 'Testing']
  }
];

export function TechShowcase() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('tech-showcase');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="tech-showcase" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
              <Code className="h-4 w-4" />
              Technology Stack
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Built With Modern Tools
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Leveraging cutting-edge technologies and frameworks to deliver exceptional performance and user experiences.
            </p>
          </div>

          {/* Interactive Tech Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Navigation */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold mb-6">Explore My Skills</h3>
              {techCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card
                    key={category.name}
                    className={`
                      cursor-pointer transition-all duration-300 hover:shadow-lg
                      ${activeCategory === index 
                        ? 'bg-primary/10 border-primary/30 shadow-lg' 
                        : 'hover:bg-card/80'
                      }
                    `}
                    onClick={() => setActiveCategory(index)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center
                          ${activeCategory === index ? 'bg-primary/20' : 'bg-muted'}
                          transition-colors duration-300
                        `}>
                          <IconComponent className={`h-6 w-6 ${category.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">{category.name}</h4>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {category.technologies.length} skills
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Active Category Display */}
            <div className="lg:pl-8">
              <div className="sticky top-8">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        {(() => {
                          const IconComponent = techCategories[activeCategory].icon;
                          return <IconComponent className={`h-8 w-8 ${techCategories[activeCategory].color}`} />;
                        })()}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{techCategories[activeCategory].name}</h3>
                        <p className="text-muted-foreground">{techCategories[activeCategory].description}</p>
                      </div>
                    </div>

                    {/* Animated Technology Tags */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Technologies & Skills</h4>
                      <div className="flex flex-wrap gap-3">
                        {techCategories[activeCategory].technologies.map((tech, index) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className={`
                              transition-all duration-300 hover:scale-105 hover:bg-primary/10
                              ${isVisible ? 'animate-fade-in-scale' : 'opacity-0'}
                            `}
                            style={{
                              animationDelay: `${index * 100}ms`
                            }}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-8 pt-6 border-t border-border">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>Proficiency</span>
                        <span>Advanced</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: isVisible ? '85%' : '0%',
                            transitionDelay: '500ms'
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Technologies', value: '25+' },
              { label: 'Projects Built', value: '50+' },
              { label: 'Years Experience', value: '3+' },
              { label: 'Certifications', value: '8' }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
