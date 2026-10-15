'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Carrusel horizontal que avanza solo, una tarjeta cada `interval` ms, como un
 * swipe. Se para mientras el lector lo toca, pasa el ratón o enfoca una tarjeta,
 * y vuelve a empezar al llegar al final. Con «reducir movimiento» no se mueve.
 */
export function AutoSwipe({ children, className, interval = 3500 }: { children: ReactNode; className?: string; interval?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let paused = false;
    let resume: ReturnType<typeof setTimeout> | undefined;
    const pause = () => { paused = true; clearTimeout(resume); };
    const later = () => { clearTimeout(resume); resume = setTimeout(() => { paused = false; }, 6000); };

    const tick = setInterval(() => {
      if (paused || document.hidden) return;
      const first = el.firstElementChild as HTMLElement | null;
      if (!first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: 'smooth' });
    }, interval);

    const opts = { passive: true } as const;
    el.addEventListener('pointerenter', pause, opts);
    el.addEventListener('pointerleave', later, opts);
    el.addEventListener('touchstart', pause, opts);
    el.addEventListener('touchend', later, opts);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', later);
    return () => {
      clearInterval(tick);
      clearTimeout(resume);
      el.removeEventListener('pointerenter', pause);
      el.removeEventListener('pointerleave', later);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', later);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', later);
    };
  }, [interval]);

  return <div ref={ref} className={className}>{children}</div>;
}
