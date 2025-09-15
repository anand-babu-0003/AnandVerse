import './globals.css';
import type { Metadata } from 'next';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';
import { defaultSiteSettingsForClient } from '@/lib/data';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ConditionalLayout } from '@/components/layout/conditional-layout';
import { LazyAnalyticsTracker, LazyGoogleAnalytics, LazyGoogleAdSense, LazyPerformanceMonitor } from '@/components/lazy/lazy-analytics';
import { SecurityProvider, SecurityIndicator } from '@/components/security/security-provider';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { WebsiteStructuredData, OrganizationStructuredData } from '@/components/seo/structured-data';
import '@/lib/firebase-logger-config';

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettingsAction();
  const settings = siteSettings || defaultSiteSettingsForClient;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anandverse.com';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.defaultMetaDescription,
    keywords: settings.defaultMetaKeywords ? settings.defaultMetaKeywords.split(',').map(k => k.trim()) : [],
    authors: [{ name: settings.siteName }],
    creator: settings.siteName,
    publisher: settings.siteName,
    
    // Enhanced Open Graph
    openGraph: {
      title: settings.siteName,
      description: settings.defaultMetaDescription,
      url: baseUrl,
      siteName: settings.siteName,
      images: [
        {
          url: settings.siteOgImageUrl || `${baseUrl}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: settings.siteName,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    // Enhanced Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: settings.siteName,
      description: settings.defaultMetaDescription,
      images: [settings.siteOgImageUrl || `${baseUrl}/og-default.jpg`],
      creator: settings.twitterHandle || '@yourhandle',
      site: settings.twitterHandle || '@yourhandle',
    },

    // Enhanced robots
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Enhanced verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
      other: {
        'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
      },
    },

    // Enhanced other meta tags
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
    },

    // Canonical URL
    alternates: {
      canonical: baseUrl,
    },

    // Language
    languages: {
      'en-US': '/en',
    },

    // Category
    category: 'technology',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettingsAction();
  const settings = siteSettings || defaultSiteSettingsForClient;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anandverse.com';

  return (
    <html lang="en" suppressHydrationWarning>
              <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/icon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#3b82f6" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="AnandVerse" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
              </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <LazyGoogleAnalytics />
        <LazyGoogleAdSense />
        <SecurityProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LazyAnalyticsTracker />
            <LazyPerformanceMonitor />
            <SpeedInsights />
            <Analytics />
            
            {/* SEO Structured Data */}
            <WebsiteStructuredData
              name={settings.siteName}
              description={settings.defaultMetaDescription}
              url={baseUrl}
              logo={settings.siteOgImageUrl}
              sameAs={settings.socialLinks ? Object.values(settings.socialLinks).filter(Boolean) : []}
            />
            
            <OrganizationStructuredData
              name={settings.siteName}
              description={settings.defaultMetaDescription}
              url={baseUrl}
              logo={settings.siteOgImageUrl}
              sameAs={settings.socialLinks ? Object.values(settings.socialLinks).filter(Boolean) : []}
            />
            
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster />
            <SecurityIndicator />
          </ThemeProvider>
        </SecurityProvider>
      </body>
    </html>
  );
}