'use client';
import { useEffect, useState } from 'react';
import { couple, type WeddingEvent } from '@/lib/invitation';
import s from './Overture.module.css';

const c = couple;

/** jumps rather than glides — `html` carries scroll-behavior:smooth */
function toTop() {
  const html = document.documentElement;
  const was = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  html.style.scrollBehavior = was;
}

/**
 * The outside of the card. It carries what a card front carries — the names
 * and the date — and it is closed with a seal, because the one thing this
 * page needs from a visitor is a press: no browser will let a page make a
 * sound before it gets one, muted playback of an <audio> element included.
 * So the arrival is the gesture, and the music comes up on it.
 *
 * Server-rendered but hidden unless `.js` is set: a cover that cannot be
 * lifted must never appear.
 */
export default function Overture({ event: v }: { event: WeddingEvent }) {
  const [lifted, setLifted] = useState(false);
  const [done, setDone] = useState(false);

  /* the page behind is still in the tab order otherwise: the first Tab landed
     on the photo deck's arrow, underneath the cover, and Enter there started
     the music without ever opening the invitation */
  useEffect(() => {
    const main = document.querySelector('main');
    main?.setAttribute('inert', '');
    // a reload restores the last scroll position even behind a locked body,
    // so the cover would lift onto the middle of the page
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    toTop();
    return () => main?.removeAttribute('inert');
  }, []);

  const open = () => {
    if (lifted) return;
    setLifted(true);
    toTop();                                          // always open on the first page
    document.documentElement.classList.add('opened'); // frees scrolling, releases the hero
    document.querySelector('main')?.removeAttribute('inert');
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      setDone(true);
      // the cover is out of the way — Usher may start showing them around
      window.dispatchEvent(new Event('invite:opened'));
    }, still ? 60 : 1600);
  };

  return (
    <div
      className={`${s.cover} ${lifted ? s.lifted : ''} ${done ? s.done : ''}`}
      onClick={open}
    >
      {/* two leaves of one sheet: together they carry the whole painting */}
      <div className={`${s.leaf} ${s.l}`} aria-hidden="true">
        <img src="/assets/floral-1400.webp" alt="" fetchPriority="high" decoding="async" />
      </div>
      <div className={`${s.leaf} ${s.r}`} aria-hidden="true">
        <img src="/assets/floral-1400.webp" alt="" fetchPriority="high" decoding="async" />
      </div>

      <div className={s.inner}>
        <p className={s.eyebrow}>{v.eyebrow}</p>

        <p className={s.names}>
          <span className={s.name}>{c.first}</span>
          <span className={s.amp}>{c.conjunction}</span>
          <span className={s.name}>{c.second}</span>
        </p>

        <i className={s.rule} aria-hidden="true" />
        <p className={s.date}>{v.date}</p>

        <button type="button" className={s.seal} onClick={open} aria-label="Open the invitation">
          <img src="/assets/monogram.svg" alt="" width={692} height={763} aria-hidden="true" />
        </button>
        <span className={s.go} aria-hidden="true">Open</span>
      </div>
    </div>
  );
}
