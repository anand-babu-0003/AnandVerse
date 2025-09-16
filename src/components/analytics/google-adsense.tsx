"use client";

import Script from 'next/script';

const ADSENSE_CLIENT_ID = 'ca-pub-8910859726727829';

export function GoogleAdSense() {
  return (
    <Script
      id="google-adsense"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            // Check if AdSense script is already loaded
            if (document.querySelector('script[src*="adsbygoogle.js"]')) {
              return;
            }
            
            // Create and load AdSense script without data-nscript attribute
            var script = document.createElement('script');
            script.async = true;
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}';
            script.crossOrigin = 'anonymous';
            
            script.onload = function() {
              console.log('AdSense script loaded successfully');
            };
            
            script.onerror = function() {
              console.warn('Failed to load AdSense script');
            };
            
            document.head.appendChild(script);
          })();
        `,
      }}
    />
  );
}

// Component for displaying AdSense ads in specific locations
export function AdSenseAd({ 
  adSlot, 
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = ''
}: {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}) {
  return (
    <div className={`adsense-ad ${className}`} style={{ 
      display: 'block',
      width: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <ins 
        className="adsbygoogle"
        style={{ 
          display: 'block',
          minHeight: '90px',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden'
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
      <Script
        id={`adsense-${adSlot}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
              console.warn('AdSense error for slot ${adSlot}:', e);
            }
          `,
        }}
      />
    </div>
  );
}

// Declare adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
