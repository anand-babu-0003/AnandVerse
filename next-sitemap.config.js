/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://anandverse.com',
  generateRobotsTxt: false, // We already have a custom robots.ts
  generateIndexSitemap: false, // Use Next.js dynamic routes instead
  
  // Additional paths to include
  additionalPaths: async (config) => {
    const result = [];
    
    // Add any additional static paths here
    // Example: result.push('/custom-page');
    
    return result;
  },

  // Generate multiple sitemaps by content type
  additionalSitemaps: [
    {
      path: '/sitemap-pages.xml',
      priority: 0.9,
      changefreq: 'weekly',
    },
    {
      path: '/sitemap-blog.xml',
      priority: 0.8,
      changefreq: 'weekly',
    },
    {
      path: '/sitemap-portfolio.xml',
      priority: 0.9,
      changefreq: 'monthly',
    },
  ],
  
  // Transform function for each page with smart priority strategy
  transform: async (config, path) => {
    // Smart priority and change frequency based on content importance
    let priority = 0.7; // Default priority
    let changeFrequency = 'monthly'; // Default change frequency
    
    // Priority Strategy:
    // 1.0 → Homepage
    // 0.9 → Portfolio, Blog listing page  
    // 0.8 → Individual Project pages
    // 0.7 → Blog posts
    // 0.5 → Contact, About, Privacy
    
    if (path === '/') {
      // Homepage - highest priority
      priority = 1.0;
      changeFrequency = 'weekly';
    } else if (path === '/portfolio') {
      // Portfolio listing page - high priority
      priority = 0.9;
      changeFrequency = 'weekly';
    } else if (path === '/blog') {
      // Blog listing page - high priority
      priority = 0.9;
      changeFrequency = 'weekly';
    } else if (path.includes('/portfolio/')) {
      // Individual portfolio projects - high priority
      priority = 0.8;
      changeFrequency = 'monthly';
    } else if (path.includes('/blog/')) {
      // Individual blog posts - medium-high priority
      priority = 0.7;
      changeFrequency = 'weekly';
    } else if (path === '/about') {
      // About page - medium priority
      priority = 0.5;
      changeFrequency = 'monthly';
    } else if (path === '/contact') {
      // Contact page - medium priority
      priority = 0.5;
      changeFrequency = 'monthly';
    } else if (path === '/skills') {
      // Skills page - medium priority
      priority = 0.6;
      changeFrequency = 'monthly';
    } else if (path === '/privacy' || path === '/terms' || path === '/cookies') {
      // Legal pages - low priority
      priority = 0.3;
      changeFrequency = 'yearly';
    }
    
    return {
      loc: path,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      changefreq: changeFrequency,
      priority: priority,
    };
  },
  
  // Exclude certain paths
  exclude: [
    '/admin',
    '/admin/*',
    '/admin-debug',
    '/admin-debug/*',
    '/api/*',
    '/_next/*',
    '/private/*',
    '/firebase-test',
    '/cookies',
  ],
  
  // Additional robots.txt rules
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin-debug/',
          '/api/',
          '/_next/',
          '/private/',
          '/firebase-test/',
          '/*.json$',
          '/cookies',
          '/terms',
          // Privacy policy is allowed for trust signals
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        disallow: '/',
      },
      {
        userAgent: 'YouBot',
        disallow: '/',
      },
    ],
    additionalSitemaps: [],
  },
};
