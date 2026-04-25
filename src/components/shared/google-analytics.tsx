'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4 (GA4) gated by user consent.
 *
 * Requires `NEXT_PUBLIC_GA_MEASUREMENT_ID` (e.g. "G-XXXXXXXX").
 * No-op when the env var is missing or the user has not granted analytics
 * consent via the cookie banner.
 *
 * Reads the `mdf_consent` cookie on mount and listens for
 * `mdf:consent-change` custom events fired by the banner.
 */
export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!measurementId) return;

    const readConsent = () => {
      if (typeof document === 'undefined') return false;
      const m = document.cookie.match(/(^|; )mdf_consent=([^;]+)/);
      if (!m) return false;
      try {
        const parsed = JSON.parse(decodeURIComponent(m[2]));
        return !!parsed?.analytics;
      } catch {
        return false;
      }
    };

    setAllowed(readConsent());

    const handler = () => setAllowed(readConsent());
    window.addEventListener('mdf:consent-change', handler);
    return () => window.removeEventListener('mdf:consent-change', handler);
  }, [measurementId]);

  if (!measurementId || !allowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          // Consent Mode v2 — analytics-only consent (no ads).
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted',
          });
          gtag('config', '${measurementId}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
    </>
  );
}
