"use client";

import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Code, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerLinks = {
  main: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' },
  ],
  social: [
    { href: 'https://github.com', label: 'GitHub', icon: Github },
    { href: 'https://linkedin.com', label: 'LinkedIn', icon: Linkedin },
    { href: 'https://twitter.com', label: 'Twitter', icon: Twitter },
    { href: 'mailto:contact@example.com', label: 'Email', icon: Mail },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    console.log('Scroll to top clicked!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-background" style={{ pointerEvents: 'auto', zIndex: 10 }}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-royal rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                AnandVerse
              </span>
            </Link>
            
            <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
              Full-Stack Developer crafting exceptional digital experiences through innovative design and cutting-edge technology.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {footerLinks.social.map((social) => (
                <Button
                  key={social.href}
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-lg hover:bg-accent"
                >
                  <Link 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={social.label}
                    onClick={() => console.log(`Social button clicked: ${social.label}`)}
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-3">
              {footerLinks.main.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                    onClick={() => console.log(`Navigation link clicked: ${link.label}`)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                    onClick={() => console.log(`Legal link clicked: ${link.label}`)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <div className="text-sm text-muted-foreground">
            © {currentYear} AnandVerse. All rights reserved.
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built by</span>
            <Link
              href="/admin"
              className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-1"
              onClick={() => console.log('Admin link clicked')}
            >
              Anand
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        variant="ghost"
        size="icon"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary/10 hover:bg-primary/20 text-primary shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        aria-label="Scroll to top"
        style={{ pointerEvents: 'auto' }}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
}