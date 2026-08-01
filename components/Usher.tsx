'use client';
import { useEffect } from 'react';

/**
 * The page reads itself, once the card is open — one unbroken drift from the
 * names down to the signature, slow enough to read along with.
 *
 * It is a guest, not the host. Anything the visitor does — a wheel, a finger,
 * a key, a drag of the scrollbar — stops it where it stands. It waits for them
 * to be still, then takes up again from wherever they have left it.
 */

/** One screen every 36 seconds. Expressed in viewports rather than pixels so
 *  the pace *looks* the same everywhere: a fixed px/sec that reads as a slow
 *  drift on a phone is a crawl on a desktop, where the screen it has to cross
 *  is half again as tall. */
const PER_SCREEN = 36;
const LEAD_IN = 2200;   // let the hero land before anything moves
const IDLE = 8000;      // stillness after a press before the drift takes up again
const SLACK = 2;        // px of movement we will not read as the visitor's

export default function Usher() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const html = document.documentElement;
    let raf = 0;
    let leadT: ReturnType<typeof setTimeout>;
    let idleT: ReturnType<typeof setTimeout>;
    let drifting = false;
    let stopped = false;
    let bound = false;

    /* our own position, kept as a float. At this speed one frame is worth about
       four tenths of a pixel, so rounding per frame would hold still for three
       frames and then jump — the exact stepping this is meant to avoid. */
    let pos = 0;
    let expected = 0;   // what the browser reported after our last write
    let prev = 0;       // timestamp of the previous frame

    const maxScroll = () => Math.max(0, html.scrollHeight - window.innerHeight);

    const frame = (now: number) => {
      if (stopped) return;
      if (!prev) prev = now;
      /* a backgrounded tab parks rAF; without the clamp the first frame back
         would be worth however many seconds it was away, all in one jump */
      const dt = Math.min(50, now - prev);
      prev = now;

      // the page moved and it was not us
      if (Math.abs(window.scrollY - expected) > SLACK) return hold();

      /* distance comes from elapsed time, never from a per-frame constant —
         otherwise the invitation scrolls twice as fast on a 120Hz screen */
      pos += (window.innerHeight / PER_SCREEN) * (dt / 1000);

      const end = maxScroll();
      if (pos >= end) {
        window.scrollTo(0, end);
        return finish();          // the signature; there is nowhere further
      }
      window.scrollTo(0, pos);
      expected = window.scrollY;
      raf = requestAnimationFrame(frame);
    };

    const drift = () => {
      if (stopped) return;
      if (window.scrollY >= maxScroll() - 1) return finish();
      pos = expected = window.scrollY;
      prev = 0;
      drifting = true;
      /* `html` carries scroll-behavior:smooth, which would re-interpolate every
         frame we write — the same swap Overture's toTop() makes */
      html.style.scrollBehavior = 'auto';
      raf = requestAnimationFrame(frame);
    };

    /* the visitor has the page. Let go of it completely — no drift creeping on
       under their thumb — and wait to be sure they are done. Every further
       press lands here too, so the eight seconds are counted from the last
       thing they did rather than the first. */
    function hold() {
      cancelAnimationFrame(raf);
      clearTimeout(leadT);
      clearTimeout(idleT);
      drifting = false;
      prev = 0;
      html.style.scrollBehavior = '';
      if (stopped) return;
      idleT = setTimeout(resume, IDLE);
    }

    function resume() {
      if (stopped) return;
      // a page in a background tab must not scroll itself; wait for them back
      if (document.visibilityState !== 'visible') {
        idleT = setTimeout(resume, IDLE);
        return;
      }
      drift();
    }

    function finish() {
      stopped = true;
      cancelAnimationFrame(raf);
      clearTimeout(leadT);
      clearTimeout(idleT);
      drifting = false;
      html.style.scrollBehavior = '';
      unbind();
    }

    /* While drifting, the frame check above owns takeover detection, so our own
       scroll events are ignored. While held, nothing of ours is moving, so any
       scroll at all is theirs — which is what catches a scrollbar drag, the one
       gesture that fires no wheel and no touch. */
    const onScroll = () => {
      if (drifting) return;
      if (Math.abs(window.scrollY - expected) <= SLACK) return;
      hold();
    };
    const onIntent = () => hold();

    const INTENT = ['wheel', 'touchstart', 'touchmove', 'pointerdown', 'keydown'] as const;

    function unbind() {
      if (!bound) return;
      bound = false;
      INTENT.forEach((e) => window.removeEventListener(e, onIntent));
      window.removeEventListener('scroll', onScroll);
    }

    const begin = () => {
      bound = true;
      expected = window.scrollY;
      // passive throughout: none of these ever calls preventDefault, and a
      // non-passive touchmove listener would cost the page its scroll latency
      INTENT.forEach((e) => window.addEventListener(e, onIntent, { passive: true }));
      window.addEventListener('scroll', onScroll, { passive: true });
      leadT = setTimeout(drift, LEAD_IN);
    };

    window.addEventListener('invite:opened', begin, { once: true });
    return () => {
      window.removeEventListener('invite:opened', begin);
      finish();
    };
  }, []);

  return null;
}
