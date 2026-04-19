'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';

/**
 * Mounts Vercel Analytics only after the user has granted analytics consent
 * via the cookie banner. Reads the `mdf_consent` cookie on mount and on
 * `mdf:consent-change` custom events (fired by the banner).
 */
export function GatedAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
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
  }, []);

  if (!allowed) return null;
  return <Analytics />;
}
