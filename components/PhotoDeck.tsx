'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { invitation, photos } from '@/lib/invitation';
import s from './PhotoDeck.module.css';

const P = '/gallery/';
const SIZES = '(max-width:640px) 84vw, 26rem';

export default function PhotoDeck() {
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false); // keyboard focus pauses; hover does not
  const deckRef = useRef<HTMLDivElement>(null);
  const down = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback((n: number) => setAt((n + photos.length) % photos.length), []);

  /** loops forever — the modulo in `go` is what makes it endless */
  useEffect(() => {
    if (held) return;
    const t = setInterval(() => setAt((i) => (i + 1) % photos.length), invitation.slideInterval);
    return () => clearInterval(t);
  }, [held]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(at - 1);
    if (e.key === 'ArrowRight') go(at + 1);
  };

  return (
    <>
      <div className={s.stage}>
        <i className={s.pool} aria-hidden="true" />
        <div
        className={s.deck}
        ref={deckRef}
        onKeyDown={onKey}
        onPointerDown={(e) => { down.current = { x: e.clientX, y: e.clientY }; }}
        onPointerUp={(e) => {
          if (!down.current) return;
          const dx = e.clientX - down.current.x;
          const dy = e.clientY - down.current.y;
          if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) go(at + (dx < 0 ? 1 : -1));
          down.current = null;
        }}
      >
        {photos.map((p, i) => {
          // shortest way round the loop, so the fan never flips the long way
          const n = photos.length;
          let d = i - at;
          if (d > n / 2) d -= n;
          if (d < -n / 2) d += n;
          const on = d === 0;
          // keep the neighbours decoded so a 3s cadence never waits on the network
          const near = Math.abs(d) <= 1;
          return (
            <figure
              key={p.id}
              className={[
                s.slide,
                on ? s.on : '',
                d === -1 ? s.prev : d === 1 ? s.next : '',
                d === -2 ? s.prev2 : d === 2 ? s.next2 : '',
              ].filter(Boolean).join(' ')}
              style={{ ['--r' as string]: p.tilt }}
              aria-hidden={!on}
            >
              <div className={s.shot} style={{ backgroundImage: `url("${p.lqip}")` }}>
                <picture>
                  <source type="image/avif" sizes={SIZES}
                    srcSet={`${P}${p.id}-sm.avif ${p.sm}w, ${P}${p.id}.avif ${p.w}w`} />
                  <source type="image/webp" sizes={SIZES}
                    srcSet={`${P}${p.id}-sm.webp ${p.sm}w, ${P}${p.id}.webp ${p.w}w`} />
                  <img
                    src={`${P}${p.id}.jpg`} alt={p.alt}
                    width={p.w} height={Math.round(p.w * 1.25)}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : near ? 'auto' : 'low'}
                    decoding="async"
                  />
                </picture>
              </div>
            </figure>
          );
        })}
        </div>
      </div>

      <div className={s.nav}>
        <button type="button" className={s.arrow} onClick={() => go(at - 1)} aria-label="Previous photograph">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M10.5 1.5 3.5 8l7 6.5" /></svg>
        </button>
        <div className={s.dots} role="tablist" aria-label="Choose photograph">
          {photos.map((p, i) => (
            <button
              key={p.id} type="button" role="tab"
              className={`${s.dot} ${i === at ? s.current : ''}`}
              aria-current={i === at}
              aria-label={`Photograph ${i + 1} of ${photos.length}`}
              onFocus={() => setHeld(true)}
              onBlur={() => setHeld(false)}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button type="button" className={s.arrow} onClick={() => go(at + 1)} aria-label="Next photograph">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M5.5 1.5 12.5 8l-7 6.5" /></svg>
        </button>
      </div>
    </>
  );
}
