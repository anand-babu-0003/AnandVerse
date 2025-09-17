/**
 * Security configuration and utilities for the application
 */

// Content Security Policy configuration
export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "'unsafe-eval'", // Required for Next.js development
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://www.gstatic.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://pagead2.googlesyndication.com', // Google AdSense
    'https://www.google.com', // Google services
    'https://*.google.com', // All Google subdomains
    'https://googleads.g.doubleclick.net', // Google AdSense
    'https://tpc.googlesyndication.com', // Google AdSense
    'https://ep1.adtrafficquality.google', // Google AdSense SODAR
    'https://ep2.adtrafficquality.google', // Google AdSense SODAR
    'https://*.adtrafficquality.google', // Google AdSense traffic quality
    'https://partner.googleadservices.com', // Google AdSense
    'https://www.googleadservices.com', // Google AdSense
    'https://googlesyndication.com', // Google AdSense
    'https://*.googlesyndication.com', // Google AdSense subdomains
    'https://fundingchoicesmessages.google.com', // Google AdSense funding choices
    'https://*.fundingchoicesmessages.google.com', // Google AdSense funding choices
    'https://va.vercel-scripts.com', // Vercel Analytics
    'https://vitals.vercel-insights.com', // Vercel Speed Insights
    'https://vercel.live', // Vercel Live feedback
    'https://*.vercel.live', // Vercel Live subdomains
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components and inline styles
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://placehold.co',
    'https://github.com',
    'https://raw.githubusercontent.com',
    'https://photos.fife.usercontent.google.com',
    'https://cdn.dribbble.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://www.google.com', // Google images
    'https://firebase.googleapis.com', // Firebase images
    'https://*.googleusercontent.com', // Google user content
    'https://*.googleapis.com', // Google APIs images
    'https://pagead2.googlesyndication.com', // Google AdSense
    'https://googleads.g.doubleclick.net', // Google AdSense
    'https://tpc.googlesyndication.com', // Google AdSense
    'https://images.unsplash.com', // Unsplash images
    'https://*.unsplash.com', // Unsplash subdomains
    'https://images.pexels.com', // Pexels images
    'https://*.pexels.com', // Pexels subdomains
    'https://via.placeholder.com', // Placeholder images
    'https://*.placeholder.com', // Placeholder subdomains
    'https://*.googlesyndication.com', // Google AdSense subdomains
    'https://partner.googleadservices.com', // Google AdSense
    'https://www.googleadservices.com', // Google AdSense
    'https://ep1.adtrafficquality.google', // Google AdSense SODAR
    'https://ep2.adtrafficquality.google', // Google AdSense SODAR
    'https://*.adtrafficquality.google', // Google AdSense traffic quality
    'https://*.google.com', // All Google subdomains for images
    'https://www.google.co.in', // Google India domain
    'https://*.google.co.in', // Google India subdomains
    'https://www.guvi.in', // External blog images
    'https://fundingchoicesmessages.google.com', // Google AdSense funding choices
    'https://*.fundingchoicesmessages.google.com', // Google AdSense funding choices
  ],
  'font-src': [
    "'self'",
    'data:',
    'https://fonts.gstatic.com',
    'https://fonts.googleapis.com',
  ],
  'connect-src': [
    "'self'",
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://analytics.google.com',
    'https://vitals.vercel-insights.com',
    'https://va.vercel-scripts.com', // Vercel Analytics
    'https://firestore.googleapis.com', // Firebase Firestore
    'https://firebase.googleapis.com', // Firebase services
    'https://identitytoolkit.googleapis.com', // Firebase Auth
    'https://securetoken.googleapis.com', // Firebase Auth tokens
    'https://www.googleapis.com', // Google APIs
    'https://*.googleapis.com', // All Google APIs
    'https://pagead2.googlesyndication.com', // Google AdSense
    'https://googleads.g.doubleclick.net', // Google AdSense
    'https://tpc.googlesyndication.com', // Google AdSense
    'https://*.google.com', // All Google subdomains
    'https://ep1.adtrafficquality.google', // Google AdSense config
    'https://vercel.live', // Vercel Live feedback
    'https://*.vercel.live', // Vercel Live subdomains
    'wss://localhost:*', // For development
    'ws://localhost:*', // For development
  ],
  'media-src': ["'self'", 'data:', 'blob:'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'frame-src': [
    "'self'",
    'https://googleads.g.doubleclick.net',
    'https://tpc.googlesyndication.com',
    'https://pagead2.googlesyndication.com',
    'https://*.googlesyndication.com',
    'https://partner.googleadservices.com',
    'https://www.googleadservices.com',
    'https://*.google.com',
    'https://ep1.adtrafficquality.google',
    'https://ep2.adtrafficquality.google',
    'https://*.adtrafficquality.google',
    'https://fundingchoicesmessages.google.com',
    'https://*.fundingchoicesmessages.google.com',
    'https://vercel.live', // Vercel Live feedback
    'https://*.vercel.live', // Vercel Live subdomains
  ],
  'upgrade-insecure-requests': [],
} as const;

// Generate CSP header string
export function generateCSPHeader(): string {
  return Object.entries(CSP_POLICY)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Embedder-Policy': 'unsafe-none',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Cross-Origin-Resource-Policy': 'cross-origin',
} as const;

// Input sanitization utilities
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .slice(0, 10000); // Limit length
}

// Email validation with additional security checks
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const sanitizedEmail = sanitizeInput(email);
  
  // Additional checks
  if (sanitizedEmail.length > 254) return false;
  if (sanitizedEmail.includes('..')) return false;
  if (sanitizedEmail.startsWith('.') || sanitizedEmail.endsWith('.')) return false;
  
  return emailRegex.test(sanitizedEmail);
}

// Phone number validation and sanitization
export function validateAndSanitizePhone(phone: string): string | null {
  const sanitized = sanitizeInput(phone);
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  
  if (!phoneRegex.test(sanitized)) return null;
  return sanitized;
}

// URL validation for external links
export function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    const allowedDomains = [
      'github.com',
      'linkedin.com',
      'twitter.com',
      'x.com',
      'youtube.com',
      'instagram.com',
      'facebook.com',
      'discord.com',
      'telegram.org',
      'whatsapp.com',
    ];
    
    if (!allowedProtocols.includes(urlObj.protocol)) return false;
    
    // For http/https URLs, check domain
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      const domain = urlObj.hostname.toLowerCase();
      return allowedDomains.some(allowed => 
        domain === allowed || domain.endsWith('.' + allowed)
      );
    }
    
    return true;
  } catch {
    return false;
  }
}

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  contactForm: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
  },
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
  },
} as const;

// CSRF token generation and validation
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Environment variable security
export function validateEnvironmentVariables(): void {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Check for sensitive data in public variables
  const publicVars = Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'));
  const sensitivePatterns = [
    /secret/i,
    /private/i,
    /key/i,
    /password/i,
    /token/i,
  ];
  
  publicVars.forEach(varName => {
    const value = process.env[varName];
    if (value && sensitivePatterns.some(pattern => pattern.test(varName))) {
      console.warn(`Potentially sensitive data in public environment variable: ${varName}`);
    }
  });
}

// Security logging with circular dependency prevention
let isLogging = false;

export function logSecurityEvent(event: string, details: Record<string, any> = {}): void {
  // Prevent circular dependency
  if (isLogging) return;
  
  isLogging = true;
  
  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      details,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      ip: 'server-side', // Would be populated by middleware
    };
    
    // Use a different logging method to avoid console monitoring
    if (typeof window !== 'undefined') {
      // Client-side: use a custom event or direct logging
      const securityEvent = new CustomEvent('security-log', {
        detail: { timestamp, event, details }
      });
      window.dispatchEvent(securityEvent);
    } else {
      // Server-side: use console.error to avoid circular dependency (safer than process.stdout)
      console.error(`[SECURITY] ${timestamp}: ${event}`, logEntry);
    }
  } finally {
    isLogging = false;
  }
}

// XSS protection utilities
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Content Security Policy nonce generation
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array)));
}
