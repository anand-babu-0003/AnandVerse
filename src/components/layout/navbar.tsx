"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Home, User, Briefcase, BookOpen, Code, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ThemeToggleButton } from './theme-toggle-button';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: User },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/contact', label: 'Contact', icon: Mail },
];

const socialLinks = [
  { href: 'https://github.com', label: 'GitHub', icon: Github },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://twitter.com', label: 'Twitter', icon: Twitter },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-royal rounded-lg">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">AnandVerse</span>
          </Link>
          <div className="h-8 w-8" />
        </div>
      </header>
    );
  }

  const NavLink = ({ href, label, icon: Icon, onClick }: { href: string; label: string; icon: React.ElementType; onClick?: () => void; }) => (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        pathname === href
          ? "text-primary bg-primary/10"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      )}
      aria-current={pathname === href ? "page" : undefined}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{label}</span>
      {pathname === href && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
      )}
    </Link>
  );

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "border-b border-border/50 bg-background/95 backdrop-blur-sm shadow-modern" 
          : "border-b border-border/20 bg-background/80 backdrop-blur-sm" 
      )}>
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link 
          href="/" 
          className="group flex items-center gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg transition-all duration-200 hover:scale-105"
        >
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-gradient-royal rounded-lg group-hover:shadow-lg transition-all duration-200">
            <Code className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
            AnandVerse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Social Links - Desktop */}
          <div className="hidden lg:flex items-center gap-1 sm:gap-2">
            {socialLinks.map((social) => (
              <Button
                key={social.href}
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-accent/50 transition-colors duration-200"
              >
                <Link href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                  <social.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            ))}
          </div>

          {/* Theme Toggle */}
          <ThemeToggleButton />
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  aria-label="Open menu"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-accent/50 transition-colors duration-200"
                >
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full max-w-xs sm:max-w-sm p-0 bg-background border-l border-border"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex justify-between items-center p-4 sm:p-6 border-b border-border">
                    <Link 
                      href="/" 
                      className="flex items-center gap-2 sm:gap-3" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-gradient-royal rounded-lg">
                        <Code className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <span className="text-lg sm:text-xl font-bold text-foreground">AnandVerse</span>
                    </Link>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        aria-label="Close menu"
                        className="h-8 w-8 rounded-lg hover:bg-accent/50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                  </div>
                  
                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-4 sm:p-6 space-y-1 sm:space-y-2">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <NavLink {...item} onClick={() => setIsMobileMenuOpen(false)} />
                      </SheetClose>
                    ))}
                  </nav>
                  
                  {/* Mobile Social Links */}
                  <div className="p-4 sm:p-6 border-t border-border">
                    <div className="flex items-center justify-center gap-3 sm:gap-4">
                      {socialLinks.map((social) => (
                        <Button
                          key={social.href}
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg hover:bg-accent/50 transition-colors duration-200"
                        >
                          <Link href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                            <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}