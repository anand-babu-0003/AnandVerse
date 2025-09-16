import './globals.css';
import type { Metadata } from 'next';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';
import { defaultSiteSettingsForClient } from '@/lib/data';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ConditionalLayout } from '@/components/layout/conditional-layout';
import { LazyAnalyticsTracker, LazyGoogleAdSense, LazyPerformanceMonitor } from '@/components/lazy/lazy-analytics';
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
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="format-detection" content="telephone=no" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/icon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/icon.svg" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#3b82f6" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="AnandVerse" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
                <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
                <link rel="preconnect" href="https://www.googletagmanager.com" />
                {/* Google Analytics - Direct implementation for better detection */}
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-QLZPZ39EFS"></script>
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', 'G-QLZPZ39EFS');
                    `,
                  }}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      // Ensure standards mode and proper AdSense initialization
                      (function() {
                        // Ensure document is in standards mode
                        if (document.compatMode !== 'CSS1Compat') {
                          console.warn('Document not in standards mode');
                        }
                        
                        // Initialize adsbygoogle array early
                        window.adsbygoogle = window.adsbygoogle || [];
                        
                        // Monitor for AdSense iframes and apply basic fixes
                        var observer = new MutationObserver(function(mutations) {
                          mutations.forEach(function(mutation) {
                            if (mutation.type === 'childList') {
                              mutation.addedNodes.forEach(function(node) {
                                if (node.tagName === 'IFRAME' && node.src && node.src.includes('doubleclick.net')) {
                                  // Apply basic iframe fixes
                                  node.style.border = 'none';
                                  node.style.display = 'block';
                                  node.style.width = '100%';
                                  node.style.maxWidth = '100%';
                                  node.style.overflow = 'hidden';
                                }
                              });
                            }
                          });
                        });
                        
                        // Start observing when DOM is ready
                        if (document.readyState === 'loading') {
                          document.addEventListener('DOMContentLoaded', function() {
                            observer.observe(document.body, {
                              childList: true,
                              subtree: true
                            });
                          });
                        } else {
                          observer.observe(document.body, {
                            childList: true,
                            subtree: true
                          });
                        }
                      })();
                    `,
                  }}
                />
              </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
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
            <SpeedInsights debug={false} />
            <Analytics debug={false} />
            
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