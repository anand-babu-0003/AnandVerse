"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Users,
  Award,
  ThumbsUp
} from 'lucide-react';
import { getApprovedTestimonialsAction } from '@/actions/admin/testimonialActions';
import type { Testimonial } from '@/lib/types';

interface TestimonialsSectionProps {
  limit?: number;
  showTitle?: boolean;
  showStats?: boolean;
}

export function TestimonialsSection({ 
  limit = 6, 
  showTitle = true, 
  showStats = true 
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await getApprovedTestimonialsAction();
        setTestimonials(data.slice(0, limit));
      } catch (error) {
        console.error('Error loading testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, [limit]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 md:py-32">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              What Clients <span className="text-gradient">Say</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take my word for it. Here's what clients and colleagues have to say about working with me.
            </p>
          </div>
        )}

        {showStats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            <div className="text-center p-4 sm:p-6 card-modern">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                {testimonials.length}+
              </div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            
            <div className="text-center p-4 sm:p-6 card-modern">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                {testimonials.length > 0 
                  ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                  : '5.0'
                }
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            
            <div className="text-center p-4 sm:p-6 card-modern">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="card-modern group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage 
                      src={testimonial.clientImage || ''} 
                      alt={testimonial.clientName}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.clientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate">
                        {testimonial.clientName}
                      </h4>
                      {testimonial.status === 'featured' && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {testimonial.clientTitle}
                    </p>
                    {testimonial.clientCompany && (
                      <p className="text-sm text-muted-foreground truncate">
                        {testimonial.clientCompany}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                <blockquote className="text-muted-foreground leading-relaxed relative">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
                  <p className="pl-4 italic">
                    "{testimonial.content}"
                  </p>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Testimonial Carousel */}
        {testimonials.filter(t => t.status === 'featured').length > 0 && (
          <div className="mt-16 sm:mt-20">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Featured <span className="text-gradient">Testimonial</span>
              </h3>
            </div>
            
            <Card className="card-modern max-w-4xl mx-auto">
              <CardContent className="p-8 sm:p-12">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-6">
                    {renderStars(testimonials[currentIndex]?.rating || 5)}
                  </div>
                  
                  <blockquote className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
                    <Quote className="h-8 w-8 text-primary/30 mx-auto mb-4" />
                    <p className="italic">
                      "{testimonials[currentIndex]?.content || ''}"
                    </p>
                  </blockquote>
                  
                  <div className="flex items-center justify-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage 
                        src={testimonials[currentIndex]?.clientImage || ''} 
                        alt={testimonials[currentIndex]?.clientName || ''}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                        {testimonials[currentIndex]?.clientName?.split(' ').map(n => n[0]).join('').toUpperCase() || ''}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="text-left">
                      <h4 className="font-semibold text-foreground text-lg">
                        {testimonials[currentIndex]?.clientName || ''}
                      </h4>
                      <p className="text-muted-foreground">
                        {testimonials[currentIndex]?.clientTitle || ''}
                      </p>
                      {testimonials[currentIndex]?.clientCompany && (
                        <p className="text-muted-foreground">
                          {testimonials[currentIndex]?.clientCompany}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {testimonials.length > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevTestimonial}
                        className="h-10 w-10 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex gap-2">
                        {testimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 w-2 rounded-full transition-colors ${
                              index === currentIndex ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextTestimonial}
                        className="h-10 w-10 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
