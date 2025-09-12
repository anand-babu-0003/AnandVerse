import './globals.css';
import type { Metadata } from 'next';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';
import { defaultSiteSettingsForClient } from '@/lib/data';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ConditionalLayout } from '@/components/layout/conditional-layout';
import { AnalyticsTracker } from '@/components/analytics/analytics-tracker';
import { SecurityProvider, SecurityIndicator } from '@/components/security/security-provider';
import '@/lib/firebase-logger-config';

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettingsAction();
  const settings = siteSettings || defaultSiteSettingsForClient;

  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.defaultMetaDescription,
    keywords: settings.defaultMetaKeywords ? settings.defaultMetaKeywords.split(',').map(k => k.trim()) : [],
    openGraph: {
      title: settings.siteName,
      description: settings.defaultMetaDescription,
      images: settings.siteOgImageUrl ? [{ url: settings.siteOgImageUrl }] : [],
      type: 'website',
    },
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
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SecurityProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* <AnalyticsTracker /> */}
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