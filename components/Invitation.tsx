import CdPlayer from '@/components/CdPlayer';
import Countdown from '@/components/Countdown';
import Flecks from '@/components/Flecks';
import Orbs from '@/components/Orbs';
import PhotoDeck from '@/components/PhotoDeck';
import { couple, mapsUrl, type WeddingEvent } from '@/lib/invitation';

const c = couple;
const i = (n: number) => ({ ['--i' as string]: n });

/* ── I · the chapel card ──────────────────────────────────────────────
   Garlanded, centred, one column: the ceremony's hero, unchanged. */
function HeroCentred({ v }: { v: WeddingEvent }) {
  return (
    <section className="act paper" id="door">
      <img className="garland top" src="/assets/garland-2000.webp" alt="" aria-hidden="true" fetchPriority="high" />
      <img className="garland bottom" src="/assets/garland-2000.webp" alt="" aria-hidden="true" />
      <img className="sprig left" src="/assets/sprig-760.webp" alt="" aria-hidden="true" loading="lazy" />
      <img className="sprig right" src="/assets/sprig-760.webp" alt="" aria-hidden="true" loading="lazy" />

      <div className="inner">
        {v.mark && (
          <img className="mark" data-r style={i(0)}
            src={v.mark.src} alt={v.mark.alt} width={v.mark.w} height={v.mark.h} />
        )}
        <p className="eyebrow" data-r style={i(1)}>{v.eyebrow}</p>
        <div className="names">
          <h1 className="name" data-r style={i(2)}>{c.first}</h1>
          <span className="amp" data-r style={i(3)}>{c.conjunction}</span>
          <p className="name" data-r style={i(4)}>{c.second}</p>
        </div>
        <p className="verse" data-r style={i(5)}>{c.verse}</p>
        <div className="cue" data-r style={i(6)} aria-hidden="true"><i className="rule" /></div>
      </div>
    </section>
  );
}

/* ── I · the Bengali card ─────────────────────────────────────────────
   Two halves that face each other: the couple on the left, turned in
   toward the type, and the names on the right, ranged left against them.
   The whole rest of the page is centred, so the card opens off-axis on
   purpose — and the gold mandala turning behind the drawing is the only
   thing on either invitation that never stops moving.

   It stacks under 880px, where two columns would leave the names in a
   gutter too narrow to set them in. */
function HeroSplit({ v }: { v: WeddingEvent }) {
  return (
    <section className="act paper split-hero" id="door">
      <div className="split">
        {/* No mandala behind the drawing. A circle centred behind a centred
            subject only reads as a halo, and it put a second round thing in
            a composition that already had one. It is on the page twice
            still — turning behind the count, and rising out of the foot of
            the date — where in both cases it is doing something a plain
            backing never did. */}
        <div className="plate">
          <img className="couple" data-r src="/assets/couple-680.webp"
            srcSet="/assets/couple-460.webp 460w, /assets/couple-680.webp 680w"
            sizes="(max-width:880px) 68vw, 34vw"
            width={680} height={961} fetchPriority="high" decoding="async"
            alt="Illustration of a Bengali bride and groom in wedding garlands, hand in hand" />
        </div>

        <div className="say">
          <p className="eyebrow" data-r style={i(1)}>{v.eyebrow}</p>
          <div className="names">
            <h1 className="name" data-r style={i(2)}>{c.first}</h1>
            <span className="amp" data-r style={i(3)}>{c.conjunction}</span>
            <p className="name" data-r style={i(4)}>{c.second}</p>
          </div>
          <i className="hair" data-r style={i(5)} aria-hidden="true" />
          <p className="verse" data-r style={i(6)}>{c.verse}</p>
          <div className="cue" data-r style={i(7)} aria-hidden="true"><i className="rule" /></div>
        </div>
      </div>
    </section>
  );
}

/**
 * One card, printed twice. Everything that differs between the ceremony and
 * the reception arrives in `event` — including which artwork it wears, since
 * the two are not the same wedding twice but a chapel in the afternoon and a
 * Bengali hall after dark.
 */
export default function Invitation({ event: v }: { event: WeddingEvent }) {
  const bengali = v.tone === 'evening';

  return (
    <>
      {bengali ? <HeroSplit v={v} /> : <HeroCentred v={v} />}

      {/* ══ II · photographs and the record, on the deep panel ═══ */}
      <section className="act deep" id="procession" aria-label="Photographs and music">
        {bengali ? (
          /* eucalyptus hung from the lintel. Cut on black and screened, so
             the panel shows through untouched wherever the source is black
             and only the leaves catch the light — the spray's recipe, on
             foliage that actually hangs. */
          <picture aria-hidden="true">
            <source media="(min-width:760px)" srcSet="/assets/euca-1200.webp" />
            <img className="euca" data-r src="/assets/euca-760.webp" alt=""
              width={1200} height={783} loading="lazy" decoding="async" />
          </picture>
        ) : (
          <>
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
          </>
        )}

        <div className="inner">
          <div data-r><PhotoDeck /></div>
          <div data-r style={i(1)}><CdPlayer music={v.music} /></div>
        </div>
      </section>

      {/* ══ III · counting, with the artwork showing through ═════ */}
      <section className="act art" id="altar" aria-label="Countdown">
        {/* The red mandala, turning behind the figures — a wheel is the one
            honest shape for a countdown, and the only place on this card
            where the alta red gets to be large. It is painted as a CSS mask
            over a block of colour, not as a picture: line art on a white
            field needs `multiply` to vanish into the paper, and any ancestor
            that forms a stacking context silently traps that blend and puts
            the white square back. A mask has no square to put back. */}
        {bengali && <i className="wheel" aria-hidden="true" />}
        <div className="inner" data-r><Countdown startsAt={v.startsAt} /></div>
      </section>

      {/* ══ IV · the date, on the deep panel ════════════════════ */}
      <section className="act deep" id="light">
        <Orbs />
        <Flecks />
        {/* and the gold one, rising out of the bottom edge — half a wheel,
            cropped by the page rather than centred on it */}
        {bengali && <i className="rising" aria-hidden="true" />}
        <div className="inner">
          <p className="verse" data-r>{c.verse}</p>
          <p className="big-date" data-r style={i(1)}>{v.date}</p>
          <p className="at" data-r style={i(2)}>
            <i aria-hidden="true" /><span>{v.time}</span><i aria-hidden="true" />
          </p>
        </div>
      </section>

      {/* ══ V · where — standing at the door ════════════════════ */}
      <section className="act paper" id="threshold" aria-label="Venue">
        <div className="thresh">
          <p className="eyebrow" data-r>Venue</p>

          <div className="portal" data-r style={i(1)} aria-hidden="true">
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
            <i className="lamp l" />
            <i className="lamp r" />
            <i className="spill" />
          </div>

          <div className="details">
            <h2 className="place" data-r style={i(2)}>{v.venue.name}</h2>
            <i className="hair" data-r style={i(3)} aria-hidden="true" />
            <p className="addr" data-r style={i(4)}>
              {v.venue.lines[0]}<br />{v.venue.lines[1]}
            </p>
            <a className="maps" data-r style={i(5)} href={mapsUrl(v.venue)} target="_blank" rel="noopener">
              <span>Open in Maps</span>
              <svg viewBox="0 0 26 12" aria-hidden="true" focusable="false">
                <path d="M0 6h22M17 1l5 5-5 5" fill="none" stroke="currentColor"
                  strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* the couple's own monogram, signing off the page */}
        <div className="sign" data-r style={i(5)}>
          <i className="rule" aria-hidden="true" />
          <img src="/assets/monogram.svg" alt="Rachel and Praduan monogram"
            width={692} height={763} loading="lazy" />
        </div>
      </section>
    </>
  );
}
