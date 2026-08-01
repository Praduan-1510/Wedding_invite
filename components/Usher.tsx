'use client';
import { useEffect } from 'react';

/**
 * The tour of the page, once the card is open — it walks a guest from act to
 * act and rests on each one, the way someone would be shown around a room.
 *
 * It is a guest, not the host. Anything the visitor does — a wheel, a finger,
 * a key, a drag of the scrollbar — takes the page away from it mid-glide. It
 * lets go, waits for them to be still, and picks up from wherever they now
 * are rather than from where it had got to. Do that to it three times and it
 * stops offering: someone who keeps taking the wheel wants to drive.
 */

/** the acts in order, and how long to rest once each has arrived. The reveals
 *  are staggered `--i * 95ms` on top of a 1s transition, so the longest act
 *  finishes assembling ~1.6s after it comes into view — every dwell here is
 *  that plus enough stillness to actually read the thing. */
const STOPS = [
  { id: 'door', dwell: 4200 },        // already revealed behind the cover
  { id: 'procession', dwell: 6200 },  // photographs are worth lingering on
  { id: 'altar', dwell: 4600 },
  { id: 'light', dwell: 4600 },
  { id: 'threshold', dwell: 5200 },
];

const IDLE = 8000;   // stillness before the tour offers to carry on
const GIVE_UP = 3;   // takeovers after which it stops offering for good

/** cubic-out — the page's own `--ease` settles the same way */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Usher() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let step = 0;             // which stop we are resting on
    let raf = 0;
    let dwellT: ReturnType<typeof setTimeout>;
    let idleT: ReturnType<typeof setTimeout>;
    let gliding = false;      // a tween is writing to scrollY right now
    let yielded = false;      // the visitor has the page
    let stopped = false;
    let taken = 0;
    /* the last position we wrote ourselves. Everything downstream needs to
       tell our own scrolling from theirs, and this is the only honest way. */
    let expected = 0;

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    /** where an act should come to rest: one taller than the screen is walked
     *  from its top edge, a short one is centred so its heading never ends up
     *  jammed under the notch */
    const restFor = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const vh = window.innerHeight;
      const y = r.height > vh ? top : top + (r.height - vh) / 2;
      return Math.max(0, Math.min(y, maxScroll()));
    };

    const glide = (to: number, then: () => void) => {
      const from = window.scrollY;
      const dist = to - from;
      if (Math.abs(dist) < 4) return then();

      /* `html` carries scroll-behavior:smooth, which would re-interpolate
         every frame we write and turn the tween to soup — the same swap
         Overture's toTop() makes */
      const html = document.documentElement;
      const was = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';

      // longer for a longer drop, but never so long it reads as stuck
      const ms = Math.min(2400, Math.max(750, Math.abs(dist) * 0.9));
      let t0 = 0;
      gliding = true;

      const frame = (now: number) => {
        if (!t0) t0 = now;
        // the page moved and it was not us: they have taken over
        if (Math.abs(window.scrollY - expected) > 2) {
          html.style.scrollBehavior = was;
          return handOver();
        }
        const p = Math.min(1, (now - t0) / ms);
        window.scrollTo(0, Math.round(from + dist * ease(p)));
        // read back rather than trust the write — at the end of the document
        // the browser clamps, and our own write would then look like theirs
        expected = window.scrollY;
        if (p < 1) { raf = requestAnimationFrame(frame); return; }
        html.style.scrollBehavior = was;
        gliding = false;
        then();
      };
      raf = requestAnimationFrame(frame);
    };

    const advance = () => {
      if (stopped) return;
      step += 1;
      if (step > STOPS.length) return finish();
      // the coda — settle on the signature, so the tour ends on the monogram
      if (step === STOPS.length) return glide(maxScroll(), finish);

      const el = document.getElementById(STOPS[step].id);
      if (!el) return advance();
      glide(restFor(el), () => {
        dwellT = setTimeout(advance, STOPS[step].dwell);
      });
    };

    /* the visitor has the page. Let go of it completely — no half-finished
       tween fighting their thumb — and wait to be sure they are done. */
    function handOver() {
      cancelAnimationFrame(raf);
      clearTimeout(dwellT);
      clearTimeout(idleT);
      gliding = false;
      if (stopped) return;
      const wasTouring = !yielded;
      yielded = true;
      if (wasTouring && ++taken >= GIVE_UP) return finish();
      idleT = setTimeout(resume, IDLE);
    }

    function resume() {
      if (stopped) return;
      // a background tab must not scroll itself; wait for them to come back
      if (document.visibilityState !== 'visible') {
        idleT = setTimeout(resume, IDLE);
        return;
      }
      /* pick up from where *they* are, not where the tour got to — being
         yanked back up to an act you deliberately scrolled past is the
         rudest thing this could do */
      const y = window.scrollY;
      let next = STOPS.findIndex((s) => {
        const el = document.getElementById(s.id);
        return !!el && restFor(el) > y + 8;
      });
      if (next === -1) next = maxScroll() > y + 8 ? STOPS.length : -1;
      if (next === -1) return finish();   // they are already at the end
      yielded = false;
      expected = y;
      step = next - 1;
      advance();
    }

    function finish() {
      stopped = true;
      cancelAnimationFrame(raf);
      clearTimeout(dwellT);
      clearTimeout(idleT);
      unbind();
    }

    /* During a glide the frame check above owns takeover detection, so our own
       scroll events are ignored. During a dwell nothing of ours is moving, so
       any scroll at all is theirs — which is what catches a scrollbar drag,
       the one gesture that fires no wheel or touch event. */
    const onScroll = () => {
      if (gliding || yielded) return;
      if (Math.abs(window.scrollY - expected) <= 2) return;  // tail of our last write
      handOver();
    };
    const onIntent = () => handOver();

    const INTENT = ['wheel', 'touchstart', 'touchmove', 'pointerdown', 'keydown'] as const;

    function unbind() {
      INTENT.forEach((e) => window.removeEventListener(e, onIntent));
      window.removeEventListener('scroll', onScroll);
    }

    const begin = () => {
      expected = window.scrollY;
      // passive throughout: none of these ever calls preventDefault, and a
      // non-passive touchmove listener would cost the page its scroll latency
      INTENT.forEach((e) => window.addEventListener(e, onIntent, { passive: true }));
      window.addEventListener('scroll', onScroll, { passive: true });
      dwellT = setTimeout(advance, STOPS[0].dwell);
    };

    window.addEventListener('invite:opened', begin, { once: true });
    return () => {
      window.removeEventListener('invite:opened', begin);
      finish();
    };
  }, []);

  return null;
}
