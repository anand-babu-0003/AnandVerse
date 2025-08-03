
import './globals.css';
import type { Metadata } from 'next';
import { getSiteSettingsAction } from '@/actions/admin/settingsActions';
import { defaultSiteSettingsForClient } from '@/lib/data';
import { ClientLayoutWrapper } from '@/components/layout/client-layout-wrapper';
import Footer from '@/components/layout/footer';

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
    icons: {
      icon: settings.faviconUrl || '/favicon.ico',
      apple: settings.appleTouchIconUrl || '/apple-touch-icon.png',
    }
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
        {/* Favicon links are now generated via Metadata API */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Arvo&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ClientLayoutWrapper footer={<Footer />}>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
