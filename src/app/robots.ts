import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anandverse.com';

  return {
    rules: [
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
          // ✅ Removed /privacy from disallow - Google likes to see Privacy Policy indexed for trust
        ],
        // ✅ Removed crawlDelay for faster crawling on strong hosting (Vercel/Netlify/Cloudflare)
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
    sitemap: `${baseUrl}/sitemap.xml`, // ✅ Main sitemap (Next.js dynamic route with smart priorities)
    host: baseUrl,
  };
}
