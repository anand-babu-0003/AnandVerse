import { NextRequest, NextResponse } from 'next/server';
import { generateCSPHeader, SECURITY_HEADERS, RATE_LIMIT_CONFIG, logSecurityEvent } from '@/lib/security';

// Simple in-memory rate limiting store
// In production, use Redis or a proper database
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= limit) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

// Security headers middleware
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Add Content Security Policy
  const csp = generateCSPHeader();
  response.headers.set('Content-Security-Policy', csp);
  
  // Add other security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Remaining', '99');
  response.headers.set('X-RateLimit-Reset', Math.floor(Date.now() / 1000).toString());
  
  return response;
}

// Bot detection
function isBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /php/i,
    /go-http/i,
    /okhttp/i,
    /postman/i,
    /insomnia/i,
  ];
  
  return botPatterns.some(pattern => pattern.test(userAgent));
}

// Suspicious request detection
function isSuspiciousRequest(request: NextRequest): boolean {
  const url = request.url;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check for common attack patterns
  const suspiciousPatterns = [
    /\.\.\//, // Directory traversal
    /<script/i, // XSS attempts
    /javascript:/i, // JavaScript protocol
    /on\w+\s*=/i, // Event handlers
    /union\s+select/i, // SQL injection
    /drop\s+table/i, // SQL injection
    /exec\s*\(/i, // Command injection
    /eval\s*\(/i, // Code injection
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(url));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const clientIP = getClientIP(request);
  
  // Log security events
  if (isSuspiciousRequest(request)) {
    logSecurityEvent('SUSPICIOUS_REQUEST', {
      path: pathname,
      userAgent,
      ip: clientIP,
      url: request.url,
    });
  }
  
  // Bot detection and handling
  if (isBot(userAgent)) {
    // Allow legitimate bots (Google, Bing, etc.) but log them
    const legitimateBots = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i, // Yahoo
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
    ];
    
    if (!legitimateBots.some(pattern => pattern.test(userAgent))) {
      logSecurityEvent('BOT_DETECTED', {
        path: pathname,
        userAgent,
        ip: clientIP,
      });
    }
  }
  
  // Rate limiting for contact form
  if (pathname === '/contact' && request.method === 'POST') {
    const rateLimitResult = checkRateLimit(
      clientIP,
      RATE_LIMIT_CONFIG.contactForm.max,
      RATE_LIMIT_CONFIG.contactForm.windowMs
    );
    
    if (!rateLimitResult.allowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        path: pathname,
        ip: clientIP,
        userAgent,
        limit: RATE_LIMIT_CONFIG.contactForm.max,
        windowMs: RATE_LIMIT_CONFIG.contactForm.windowMs,
      });
      
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_CONFIG.contactForm.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.floor(rateLimitResult.resetTime / 1000).toString(),
          },
        }
      );
    }
  }
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = checkRateLimit(
      clientIP,
      RATE_LIMIT_CONFIG.api.max,
      RATE_LIMIT_CONFIG.api.windowMs
    );
    
    if (!rateLimitResult.allowed) {
      logSecurityEvent('API_RATE_LIMIT_EXCEEDED', {
        path: pathname,
        ip: clientIP,
        userAgent,
        limit: RATE_LIMIT_CONFIG.api.max,
        windowMs: RATE_LIMIT_CONFIG.api.windowMs,
      });
      
      return new NextResponse(
        JSON.stringify({
          error: 'API rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_CONFIG.api.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.floor(rateLimitResult.resetTime / 1000).toString(),
          },
        }
      );
    }
  }
  
  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Add additional security headers for admin routes
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return addSecurityHeaders(response);
  }
  
  // Continue with the request
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
