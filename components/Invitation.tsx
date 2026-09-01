import CdPlayer from '@/components/CdPlayer';
import Countdown from '@/components/Countdown';
import Flecks from '@/components/Flecks';
import Orbs from '@/components/Orbs';
import PhotoDeck from '@/components/PhotoDeck';
import { couple, mapsUrl, type WeddingEvent } from '@/lib/invitation';

const c = couple;

/**
 * One card, printed twice. Everything that differs between the ceremony and
 * the reception arrives in `event`; there is no second copy of this markup.
 */
export default function Invitation({ event: v }: { event: WeddingEvent }) {
  return (
    <>
      {/* ══ I · the invitation, on paper, garlanded ══════════════ */}
      <section className="act paper" id="door">
        <img className="garland top" src="/assets/garland-2000.webp" alt="" aria-hidden="true" fetchPriority="high" />
        <img className="garland bottom" src="/assets/garland-2000.webp" alt="" aria-hidden="true" />
        <img className="sprig left" src="/assets/sprig-760.webp" alt="" aria-hidden="true" loading="lazy" />
        <img className="sprig right" src="/assets/sprig-760.webp" alt="" aria-hidden="true" loading="lazy" />

        <div className="inner">
          <img className="mark" data-r style={{ ['--i' as string]: 0 }}
            src={v.mark.src} alt={v.mark.alt} width={v.mark.w} height={v.mark.h} />

          <p className="eyebrow" data-r style={{ ['--i' as string]: 1 }}>{v.eyebrow}</p>

          <div className="names">
            <h1 className="name" data-r style={{ ['--i' as string]: 2 }}>{c.first}</h1>
            <span className="amp" data-r style={{ ['--i' as string]: 3 }}>{c.conjunction}</span>
            <p className="name" data-r style={{ ['--i' as string]: 4 }}>{c.second}</p>
          </div>

          <p className="verse" data-r style={{ ['--i' as string]: 5 }}>{c.verse}</p>

          {/* the date lives on the deep panel and the venue has its own
              section — repeating them here only crowds the names */}

          <div className="cue" data-r style={{ ['--i' as string]: 6 }} aria-hidden="true">
            <i className="rule" />
          </div>
        </div>
      </section>

      {/* ══ II · photographs and the record, on the deep panel ═══ */}
      <section className="act deep" id="procession" aria-label="Photographs and music">
        {/* the spray, banked into the two corners the artwork leaves free —
            the deck and the record sit in the diagonal between them */}
        <picture aria-hidden="true">
          <source media="(min-width:900px)" srcSet="/assets/spray-tl-1200.webp" />
          <img className="spray tl" data-r src="/assets/spray-tl-760.webp" alt=""
            width={1200} height={1071} loading="lazy" decoding="async" />
        </picture>
        <picture aria-hidden="true">
          <source media="(min-width:900px)" srcSet="/assets/spray-br-1300.webp" />
          <img className="spray br" data-r src="/assets/spray-br-820.webp" alt=""
            width={1300} height={1040} loading="lazy" decoding="async" />
        </picture>

        <div className="inner">
          <div data-r><PhotoDeck /></div>
          <div data-r style={{ ['--i' as string]: 1 }}><CdPlayer /></div>
        </div>
      </section>

      {/* ══ III · counting, with the artwork showing through ═════ */}
      <section className="act art" id="altar" aria-label="Countdown">
        <div className="inner" data-r><Countdown startsAt={v.startsAt} /></div>
      </section>

      {/* ══ IV · the date, on the deep panel ════════════════════ */}
      <section className="act deep" id="light">
        <Orbs />
        <Flecks />
        <div className="inner">
          <p className="verse" data-r>{c.verse}</p>
          <p className="big-date" data-r style={{ ['--i' as string]: 1 }}>{v.date}</p>
          <p className="at" data-r style={{ ['--i' as string]: 2 }}>
            <i aria-hidden="true" /><span>{v.time}</span><i aria-hidden="true" />
          </p>
        </div>
      </section>

      {/* ══ V · where — standing at the door ════════════════════
          The opening is set off the page's centre axis and the name is
          lifted out of it. An upright shape centred on an empty field
          with an inscription in it is a headstone; the same opening put
          off-axis, given no base, and read *alongside* its name is a
          door. That is the whole composition. */}
      <section className="act paper" id="threshold" aria-label="Venue">
        <div className="thresh">
          <p className="eyebrow" data-r>Venue</p>

          <div className="portal" data-r style={{ ['--i' as string]: 1 }} aria-hidden="true">
            {/* the ink fades at its left and right extremes so the drawing
                sits on the paper instead of ending on a pasted square edge */}
            <div className="ink">
              <picture>
                <source type="image/avif" media="(min-width:900px)" srcSet="/assets/door-1300.avif" />
                <source type="image/webp" media="(min-width:900px)" srcSet="/assets/door-1300.webp" />
                <source type="image/avif" srcSet="/assets/door-900.avif" />
                <source type="image/webp" srcSet="/assets/door-900.webp" />
                <img className="door" src="/assets/door-900.webp" alt=""
                  width={1300} height={1300} loading="lazy" decoding="async" />
              </picture>
            </div>

            {/* the two lanterns in the drawing, lit. They breathe on periods
                that never divide into one another, so the pair never pulses
                together the way a single shared animation would. */}
            <i className="lamp l" />
            <i className="lamp r" />
            {/* and the light those lanterns throw down onto the step */}
            <i className="spill" />
          </div>

          <div className="details">
            <h2 className="place" data-r style={{ ['--i' as string]: 2 }}>{v.venue.name}</h2>
            <i className="hair" data-r style={{ ['--i' as string]: 3 }} aria-hidden="true" />
            <p className="addr" data-r style={{ ['--i' as string]: 4 }}>
              {v.venue.lines[0]}<br />{v.venue.lines[1]}
            </p>
            <a className="maps" data-r style={{ ['--i' as string]: 5 }}
              href={mapsUrl(v.venue)} target="_blank" rel="noopener">
              <span>Open in Maps</span>
              <svg viewBox="0 0 26 12" aria-hidden="true" focusable="false">
                <path d="M0 6h22M17 1l5 5-5 5" fill="none" stroke="currentColor"
                  strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* the couple's own monogram, signing off the page */}
        <div className="sign" data-r style={{ ['--i' as string]: 5 }}>
          <i className="rule" aria-hidden="true" />
          <img src="/assets/monogram.svg" alt="Rachel and Praduan monogram"
            width={692} height={763} loading="lazy" />
        </div>
      </section>
    </>
  );
}
