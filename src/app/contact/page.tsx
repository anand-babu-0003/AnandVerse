import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Github,
  Linkedin,
  Twitter,
  ExternalLink
} from 'lucide-react';
import { fetchAllDataFromFirestore } from '@/actions/fetchAllDataAction';
import Starfield from '@/components/layout/starfield';
import { ContactForm } from '@/components/contact/contact-form';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ContactPage() {
  // Fetch all data from Firestore
  const appData = await fetchAllDataFromFirestore();
  const displayedData = appData.aboutMe;

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: displayedData.email || 'contact@example.com',
      href: `mailto:${displayedData.email || 'contact@example.com'}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: displayedData.phone || '+1 (555) 123-4567',
      href: `tel:${displayedData.phone || '+15551234567'}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: displayedData.location || 'Remote / Global',
      href: '#',
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: 'Within 24 hours',
      href: '#',
    },
  ];

  const socialLinks = [
    ...(displayedData.githubUrl ? [{
      icon: Github,
      label: 'GitHub',
      href: displayedData.githubUrl,
      description: 'Check out my code and projects',
    }] : []),
    ...(displayedData.linkedinUrl ? [{
      icon: Linkedin,
      label: 'LinkedIn',
      href: displayedData.linkedinUrl,
      description: 'Connect with me professionally',
    }] : []),
    ...(displayedData.twitterUrl ? [{
      icon: Twitter,
      label: 'Twitter',
      href: displayedData.twitterUrl,
      description: 'Follow me for updates',
    }] : []),
  ];

  const faqs = [
    {
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary depending on complexity, but most projects range from 2-8 weeks. I\'ll provide a detailed timeline during our initial consultation.',
    },
    {
      question: 'Do you work with clients remotely?',
      answer: 'Yes! I work with clients worldwide and have extensive experience with remote collaboration tools and processes.',
    },
    {
      question: 'What technologies do you specialize in?',
      answer: 'I specialize in modern web technologies including React, Next.js, Node.js, TypeScript, and various databases and deployment platforms.',
    },
    {
      question: 'Do you provide ongoing support?',
      answer: 'Absolutely! I offer maintenance and support packages to ensure your project continues to perform optimally after launch.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        {/* Animated Starfield */}
        <Starfield density={0.9} speed={0.2} twinkleSpeed={0.012} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
              <MessageCircle className="h-4 w-4" />
              Get in Touch
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-gradient">Contact Me</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Ready to start your next project? I'd love to hear from you. 
              Let's discuss how we can work together to bring your ideas to life.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="card-modern">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                      <Send className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">Send a Message</CardTitle>
                      <CardDescription>
                        Fill out the form below and I'll get back to you as soon as possible.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Contact Details */}
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Contact Information</CardTitle>
                  <CardDescription>
                    Prefer other ways to reach out? Here are my contact details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{info.label}</p>
                        {info.href.startsWith('mailto:') || info.href.startsWith('tel:') ? (
                          <Link 
                            href={info.href}
                            className="text-foreground hover:text-primary transition-colors duration-200"
                          >
                            {info.value}
                          </Link>
                        ) : (
                          <p className="text-foreground">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Follow Me</CardTitle>
                  <CardDescription>
                    Connect with me on social media for updates and insights.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-200">
                        <social.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{social.label}</p>
                        <p className="text-sm text-muted-foreground">{social.description}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Response */}
              <Card className="card-modern bg-gradient-royal text-white">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mx-auto mb-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Quick Response</h3>
                  <p className="text-white/90 text-sm">
                    I typically respond to all inquiries within 24 hours. 
                    For urgent matters, feel free to call or text.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Frequently Asked{' '}
              <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here are some common questions I receive. Don't see your question? 
              Feel free to reach out directly!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="card-modern">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-royal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Let&apos;s Start Your{' '}
              <span className="text-white/90">Next Project</span>
            </h2>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              I'm excited to work with you and help bring your vision to life. 
              Whether you have a specific project in mind or just want to explore possibilities, 
              let's start the conversation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-3">
                <Link href="#contact-form">
                  <span className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Message
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3">
                <Link href="/portfolio">
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
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