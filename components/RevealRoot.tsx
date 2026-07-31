'use client';
import { useEffect } from 'react';

/**
 * One observer for every [data-r] on the page, so the sections themselves can
 * stay server components and just mark what should arrive.
 */
export default function RevealRoot() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-r]');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    targets.forEach((t) => io.observe(t));

    // the hero arrives immediately — never gated on a scroll
    document.querySelectorAll('#door [data-r]').forEach((el) => el.classList.add('in'));

    return () => io.disconnect();
  }, []);

  return null;
}
