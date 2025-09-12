"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Quote, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Award,
  Heart
} from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  project?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'TechCorp',
    content: 'Anand delivered an exceptional web application that exceeded our expectations. His attention to detail and modern development practices made the entire process smooth and professional.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    project: 'E-commerce Platform'
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'CEO',
    company: 'StartupXYZ',
    content: 'Working with Anand was a game-changer for our startup. He built a scalable solution that grew with our business needs. Highly recommend for any complex web projects.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    project: 'SaaS Dashboard'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Design Director',
    company: 'Creative Studio',
    content: 'Anand\'s technical expertise combined with his understanding of design principles created a perfect partnership. The final product was both beautiful and functional.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    project: 'Portfolio Website'
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'CTO',
    company: 'InnovateLab',
    content: 'The mobile app Anand developed for us has been a huge success. His React Native expertise and clean code practices made maintenance a breeze.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    project: 'Mobile Application'
  }
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
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

    const element = document.getElementById('testimonials');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
              <Users className="h-4 w-4" />
              Client Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                What Clients Say
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take my word for it. Here's what my clients have to say about working with me.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Testimonial */}
            <div className="lg:col-span-2">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <Quote className="h-8 w-8 text-primary/60 mt-1" />
                    <div className="flex-1">
                      <p className="text-lg leading-relaxed mb-6">
                        "{currentTestimonial.content}"
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < currentTestimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>

                      {/* Client Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                          {currentTestimonial.avatar ? (
                            <Image
                              src={currentTestimonial.avatar}
                              alt={currentTestimonial.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          ) : (
                            <Users className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">{currentTestimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {currentTestimonial.role} at {currentTestimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex gap-2">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            index === currentIndex ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevTestimonial}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextTestimonial}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats & Additional Info */}
            <div className="space-y-6">
              {/* Project Badge */}
              {currentTestimonial.project && (
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 text-center">
                    <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Project</h3>
                    <Badge variant="secondary">{currentTestimonial.project}</Badge>
                  </CardContent>
                </Card>
              )}

              {/* Overall Stats */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Client Satisfaction
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Rating</span>
                        <span>5.0/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Communication</span>
                        <span>5.0/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quality</span>
                        <span>5.0/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">100%</div>
                      <div className="text-xs text-muted-foreground">Satisfaction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">24/7</div>
                      <div className="text-xs text-muted-foreground">Support</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">50+</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">3+</div>
                      <div className="text-xs text-muted-foreground">Years</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
