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
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 xs:py-10 sm:py-12">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6 xs:gap-8 mb-6 xs:mb-8">
          {/* Brand Section */}
          <div className="xs:col-span-2 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 xs:gap-3 mb-3 xs:mb-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 xs:w-10 xs:h-10 bg-gradient-royal rounded-lg">
                <Code className="h-4 w-4 xs:h-6 xs:w-6 text-white" />
              </div>
              <span className="text-xl xs:text-2xl font-bold text-foreground">
                AnandVerse
              </span>
            </Link>
            
            <p className="text-sm xs:text-base text-muted-foreground max-w-md leading-relaxed mb-4 xs:mb-6">
              Full-Stack Developer crafting exceptional digital experiences through innovative design and cutting-edge technology.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2 xs:gap-3">
              {footerLinks.social.map((social) => (
                <Button
                  key={social.href}
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 xs:h-10 xs:w-10 rounded-lg hover:bg-accent"
                >
                  <Link 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={social.label}
                    onClick={() => console.log(`Social button clicked: ${social.label}`)}
                  >
                    <social.icon className="h-4 w-4 xs:h-5 xs:w-5" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-base xs:text-lg font-semibold text-foreground mb-3 xs:mb-4">Navigation</h3>
            <ul className="space-y-2 xs:space-y-3">
              {footerLinks.main.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm xs:text-base text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
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
            <h3 className="text-base xs:text-lg font-semibold text-foreground mb-3 xs:mb-4">Legal</h3>
            <ul className="space-y-2 xs:space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm xs:text-base text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
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
        <div className="flex flex-col xs:flex-row items-center justify-between gap-3 xs:gap-4 pt-6 xs:pt-8 border-t border-border">
          <div className="text-xs xs:text-sm text-muted-foreground text-center xs:text-left">
            © {currentYear} AnandVerse. All rights reserved.
          </div>
          
          <div className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm text-muted-foreground">
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
        className="fixed bottom-4 xs:bottom-6 right-4 xs:right-6 h-10 w-10 xs:h-12 xs:w-12 rounded-full bg-primary/10 hover:bg-primary/20 text-primary shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        aria-label="Scroll to top"
        style={{ pointerEvents: 'auto' }}
      >
        <ArrowUp className="h-4 w-4 xs:h-5 xs:w-5" />
      </Button>
    </footer>
  );
}