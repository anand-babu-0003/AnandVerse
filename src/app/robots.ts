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
          '/private/',
          '/firebase-test/',
          '/*.json$',
          // ✅ Removed /cookies and /terms from disallow - Allow all search engines to index these pages
          // ✅ Removed /_next/ from disallow - Essential for Next.js functionality
          // ✅ Removed /privacy from disallow - Google likes to see Privacy Policy indexed for trust
          // ✅ Removed all AI bot restrictions - Allow all search engines and AI crawlers
        ],
        // ✅ Removed crawlDelay for faster crawling on strong hosting (Vercel/Netlify/Cloudflare)
      },
      // ✅ Removed all specific user agent blocks - Allow all search engines and AI bots
    ],
    sitemap: `${baseUrl}/sitemap.xml`, // ✅ Main sitemap (Next.js dynamic route with smart priorities)
    host: baseUrl,
  };
}
