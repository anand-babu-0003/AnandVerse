import type { Metadata } from 'next';
import type { BlogPost, PortfolioItem, AboutMeData, SiteSettings } from './types';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';
import { defaultSiteSettingsForClient } from './data';

// Default SEO configuration (fallback)
const defaultSEO = {
  title: 'AnandVerse - Professional Web Developer & Designer',
  description: 'Professional web developer specializing in modern web technologies. Creating beautiful, responsive, and user-friendly websites and applications.',
  keywords: ['web developer', 'frontend developer', 'react', 'nextjs', 'typescript', 'portfolio', 'web design'],
  author: 'Anand Verma',
  url: 'https://anandverse.com',
  image: '/og-image.jpg',
  twitter: '@anandverse',
};

// Get dynamic SEO configuration from site settings
async function getDynamicSEO(): Promise<typeof defaultSEO> {
  try {
    const siteSettings = await getSiteSettingsAction();
    return {
      title: siteSettings.siteName || defaultSEO.title,
      description: siteSettings.defaultMetaDescription || defaultSEO.description,
      keywords: siteSettings.defaultMetaKeywords ? 
        siteSettings.defaultMetaKeywords.split(',').map(k => k.trim()) : 
        defaultSEO.keywords,
      author: defaultSEO.author,
      url: defaultSEO.url,
      image: siteSettings.siteOgImageUrl || defaultSEO.image,
      twitter: defaultSEO.twitter,
    };
  } catch (error) {
    console.error('Error fetching dynamic SEO config:', error);
    return defaultSEO;
  }
}

// Generate metadata for pages (async version for dynamic SEO)
export async function generatePageMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}): Promise<Metadata> {
  const dynamicSEO = await getDynamicSEO();
  const fullTitle = title ? `${title} | ${dynamicSEO.title}` : dynamicSEO.title;
  const fullDescription = description || dynamicSEO.description;
  const fullKeywords = [...dynamicSEO.keywords, ...keywords];
  const fullImage = image || dynamicSEO.image;
  const fullUrl = url || dynamicSEO.url;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    authors: [{ name: dynamicSEO.author }],
    creator: dynamicSEO.author,
    publisher: dynamicSEO.author,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type,
      locale: 'en_US',
      url: fullUrl,
      title: fullTitle,
      description: fullDescription,
      siteName: dynamicSEO.title,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: dynamicSEO.twitter,
    },
    alternates: {
      canonical: fullUrl,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
  };
}

// Generate metadata for blog posts
export async function generateBlogPostMetadata(post: BlogPost): Promise<Metadata> {
  const dynamicSEO = await getDynamicSEO();
  return generatePageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords || post.tags,
    image: post.featuredImage,
    url: `${dynamicSEO.url}/blog/${post.slug}`,
    type: 'article',
  });
}

// Generate metadata for portfolio items
export async function generatePortfolioItemMetadata(item: PortfolioItem): Promise<Metadata> {
  const dynamicSEO = await getDynamicSEO();
  return generatePageMetadata({
    title: item.title,
    description: item.description,
    keywords: item.tags,
    image: item.images[0],
    url: `${dynamicSEO.url}/portfolio/${item.slug}`,
    type: 'website',
  });
}

// Generate structured data for blog posts
export async function generateBlogPostStructuredData(post: BlogPost) {
  const dynamicSEO = await getDynamicSEO();
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: dynamicSEO.title,
      logo: {
        '@type': 'ImageObject',
        url: `${dynamicSEO.url}/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${dynamicSEO.url}/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    wordCount: post.content.split(' ').length,
    timeRequired: `PT${post.readTime}M`,
  };
}

// Generate structured data for portfolio items
export async function generatePortfolioItemStructuredData(item: PortfolioItem) {
  const dynamicSEO = await getDynamicSEO();
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: item.title,
    description: item.description,
    image: item.images,
    creator: {
      '@type': 'Person',
      name: dynamicSEO.author,
    },
    dateCreated: item.createdAt,
    dateModified: item.updatedAt,
    url: `${dynamicSEO.url}/portfolio/${item.slug}`,
    keywords: item.tags.join(', '),
    ...(item.liveUrl && {
      mainEntity: {
        '@type': 'WebApplication',
        url: item.liveUrl,
        applicationCategory: 'WebApplication',
      },
    }),
  };
}

// Generate structured data for person (About page)
export async function generatePersonStructuredData(aboutMe: AboutMeData) {
  const dynamicSEO = await getDynamicSEO();
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: aboutMe.name,
    jobTitle: aboutMe.title,
    description: aboutMe.bio,
    image: aboutMe.profileImage,
    url: dynamicSEO.url,
    sameAs: [
      aboutMe.linkedinUrl,
      aboutMe.githubUrl,
      aboutMe.twitterUrl,
    ].filter(Boolean),
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    knowsAbout: aboutMe.experience.map(exp => exp.role),
    alumniOf: aboutMe.education.map(edu => ({
      '@type': 'EducationalOrganization',
      name: edu.institution,
    })),
  };
}

// Generate structured data for website
export async function generateWebsiteStructuredData(siteSettings: SiteSettings) {
  const dynamicSEO = await getDynamicSEO();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteSettings.siteName,
    description: siteSettings.defaultMetaDescription,
    url: dynamicSEO.url,
    author: {
      '@type': 'Person',
      name: dynamicSEO.author,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${dynamicSEO.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Generate sitemap data
export async function generateSitemapData({
  blogPosts,
  portfolioItems,
}: {
  blogPosts: BlogPost[];
  portfolioItems: PortfolioItem[];
}) {
  const dynamicSEO = await getDynamicSEO();
  const baseUrl = dynamicSEO.url;
  const currentDate = new Date().toISOString();

  const staticPages = [
    { url: '', priority: 1.0, changeFreq: 'weekly' },
    { url: '/about', priority: 0.8, changeFreq: 'monthly' },
    { url: '/portfolio', priority: 0.9, changeFreq: 'weekly' },
    { url: '/blog', priority: 0.9, changeFreq: 'weekly' },
    { url: '/skills', priority: 0.7, changeFreq: 'monthly' },
    { url: '/contact', priority: 0.8, changeFreq: 'monthly' },
  ];

  const blogPages = blogPosts.map(post => ({
    url: `/blog/${post.slug}`,
    priority: 0.8,
    changeFreq: 'monthly',
    lastMod: post.updatedAt,
  }));

  const portfolioPages = portfolioItems.map(item => ({
    url: `/portfolio/${item.slug}`,
    priority: 0.8,
    changeFreq: 'monthly',
    lastMod: item.updatedAt,
  }));

  return [...staticPages, ...blogPages, ...portfolioPages].map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified: page.lastMod || currentDate,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));
}

// SEO utility functions
export function generateMetaTags(metadata: Metadata): string {
  const tags: string[] = [];

  // Basic meta tags
  if (metadata.title) {
    tags.push(`<title>${metadata.title}</title>`);
  }
  if (metadata.description) {
    tags.push(`<meta name="description" content="${metadata.description}">`);
  }
  if (metadata.keywords) {
    tags.push(`<meta name="keywords" content="${Array.isArray(metadata.keywords) ? metadata.keywords.join(', ') : metadata.keywords}">`);
  }
  if (metadata.authors) {
    tags.push(`<meta name="author" content="${metadata.authors[0]?.name}">`);
  }

  // Open Graph tags
  if (metadata.openGraph) {
    tags.push(`<meta property="og:type" content="${metadata.openGraph.type}">`);
    tags.push(`<meta property="og:title" content="${metadata.openGraph.title}">`);
    tags.push(`<meta property="og:description" content="${metadata.openGraph.description}">`);
    tags.push(`<meta property="og:url" content="${metadata.openGraph.url}">`);
    tags.push(`<meta property="og:site_name" content="${metadata.openGraph.siteName}">`);
    if (metadata.openGraph.images?.[0]) {
      tags.push(`<meta property="og:image" content="${metadata.openGraph.images[0].url}">`);
      tags.push(`<meta property="og:image:width" content="${metadata.openGraph.images[0].width}">`);
      tags.push(`<meta property="og:image:height" content="${metadata.openGraph.images[0].height}">`);
      tags.push(`<meta property="og:image:alt" content="${metadata.openGraph.images[0].alt}">`);
    }
  }

  // Twitter Card tags
  if (metadata.twitter) {
    tags.push(`<meta name="twitter:card" content="${metadata.twitter.card}">`);
    tags.push(`<meta name="twitter:title" content="${metadata.twitter.title}">`);
    tags.push(`<meta name="twitter:description" content="${metadata.twitter.description}">`);
    if (metadata.twitter.images?.[0]) {
      tags.push(`<meta name="twitter:image" content="${metadata.twitter.images[0]}">`);
    }
    if (metadata.twitter.creator) {
      tags.push(`<meta name="twitter:creator" content="${metadata.twitter.creator}">`);
    }
  }

  // Canonical URL
  if (metadata.alternates?.canonical) {
    tags.push(`<link rel="canonical" href="${metadata.alternates.canonical}">`);
  }

  return tags.join('\n');
}

// Performance optimization helpers
export function preloadCriticalResources() {
  return `
    <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/images/hero-bg.jpg" as="image">
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
  `;
}

// Analytics and tracking
export function generateAnalyticsScript() {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID;
  
  if (!googleAnalyticsId) return '';

  return `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsId}', {
        page_title: document.title,
        page_location: window.location.href,
      });
    </script>
  `;
}
