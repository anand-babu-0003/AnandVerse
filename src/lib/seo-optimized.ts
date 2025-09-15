import type { Metadata } from 'next';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';
import { defaultSiteSettingsForClient } from '@/lib/data';

// SEO-optimized metadata generator
export async function generateSEOMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}): Promise<Metadata> {
  const siteSettings = await getSiteSettingsAction();
  const settings = siteSettings || defaultSiteSettingsForClient;

  const fullTitle = title.includes(settings.siteName) ? title : `${title} | ${settings.siteName}`;
  const fullDescription = description || settings.defaultMetaDescription;
  const fullKeywords = keywords?.join(', ') || settings.defaultMetaKeywords || '';
  const fullImage = image || settings.siteOgImageUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/og-default.jpg`;
  const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}${url}`;

  const metadata: Metadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords || (settings.defaultMetaKeywords ? settings.defaultMetaKeywords.split(',').map(k => k.trim()) : []),
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: settings.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
      ...(section && { section }),
      ...(tags && { tags }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: settings.twitterHandle || '@yourhandle',
      site: settings.twitterHandle || '@yourhandle',
    },

    // Additional meta tags
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

    // Verification tags
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
      other: {
        'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
      },
    },

    // Additional SEO meta tags
    other: {
      'google-adsense-account': 'ca-pub-8910859726727829',
      'theme-color': '#000000',
      'msapplication-TileColor': '#000000',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': settings.siteName,
      'application-name': settings.siteName,
      'msapplication-tooltip': settings.defaultMetaDescription,
      'msapplication-starturl': '/',
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'msapplication-navbutton-color': '#000000',
      'msapplication-config': '/browserconfig.xml',
    },

    // Canonical URL
    alternates: {
      canonical: fullUrl,
    },

    // Language
    languages: {
      'en-US': '/en',
    },
  };

  return metadata;
}

// Generate JSON-LD structured data
export function generateStructuredData({
  type,
  data,
}: {
  type: 'website' | 'organization' | 'person' | 'article' | 'portfolio' | 'breadcrumb';
  data: any;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'portfolio' ? 'CreativeWork' : type === 'breadcrumb' ? 'BreadcrumbList' : type,
    ...data,
  };

  // Add common properties
  if (type !== 'breadcrumb') {
    structuredData.url = data.url || baseUrl;
    structuredData.name = data.name || data.title;
  }

  return structuredData;
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

// SEO-friendly URL generation
export function generateSEOFriendlySlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Generate meta tags for social sharing
export function generateSocialMetaTags({
  title,
  description,
  image,
  url,
  type = 'website',
}: {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: string;
}) {
  return [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:url', content: url },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: 'Your Site Name' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ];
}
