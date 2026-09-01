import Invitation from '@/components/Invitation';
import Overture from '@/components/Overture';
import RevealRoot from '@/components/RevealRoot';
import Usher from '@/components/Usher';
import type { WeddingEvent } from '@/lib/invitation';

/**
 * Everything a single invitation is made of, in the order the DOM needs it —
 * the cover before <main>, so the seal is the first thing a keyboard reaches.
 *
 * This used to be the root layout, which is exactly why it moved: a layout
 * cannot know which route it is rendering, and the reception has to be able to
 * wear a different treatment and print a different date on its cover.
 *
 * The wrapper is `display:contents` (`.tone`), so it carries the tone class
 * down the tree without putting a box — or a stacking context — between the
 * fixed backdrop and the viewport.
 */
export default function Shell({ event }: { event: WeddingEvent }) {
  return (
    <div className={`tone ${event.tone}`}>
      {/* the one artwork, fixed behind everything */}
      <div className="backdrop" aria-hidden="true">
        <picture>
          <source media="(min-width:900px)" srcSet="/assets/floral-2400.webp" />
          <img src="/assets/floral-1400.webp" alt="" fetchPriority="high" decoding="async" />
        </picture>
      </div>
      <div className="grain" aria-hidden="true" />

      <Overture event={event} />
      <main><Invitation event={event} /></main>
      <RevealRoot />
      <Usher />
    </div>
  );
}
