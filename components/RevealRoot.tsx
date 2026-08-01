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

    /**
     * Decorative loops — orbs, flecks, garlands, sprays — are infinite, so
     * without this they keep the compositor busy for the whole visit even
     * while their section is nowhere near the viewport. This marks which
     * sections are actually on screen; the CSS pauses the rest. Unlike the
     * reveal above, these are never unobserved: a section has to be able to
     * go back to sleep once it scrolls away again.
     */
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle('vis', e.isIntersecting);
      },
      { rootMargin: '20% 0px' },   // wake just before it comes into view
    );
    document.querySelectorAll('.act').forEach((s) => seen.observe(s));

    return () => { io.disconnect(); seen.disconnect(); };
  }, []);

  return null;
}
