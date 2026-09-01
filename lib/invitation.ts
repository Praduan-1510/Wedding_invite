/**
 * Every word on this page comes from the V4 design files in `source/ref/` —
 * `V4 - Kolkata.png` for the ceremony, `V4 - Asansol.png` for the reception.
 * Nothing here is invented.
 *
 * The two events are **separate invitations for separate guest lists**, not one
 * page with two dates on it: `/` is the ceremony, `/reception` is Asansol, and
 * neither links to the other. Everything they share — the couple, the verse,
 * the photographs, the music — lives above; everything that differs is in
 * `events`, and there is only ever one copy of the markup.
 */
export type Photo = {
  id: string;
  /** widths of the two generated cuts, in px */
  w: number;
  sm: number;
  /** keepsake tilt, so the deck reads as snapshots on a table */
  tilt: string;
  alt: string;
  /** 20px blurred placeholder, inlined so a slide is never blank */
  lqip: string;
};

export type Venue = {
  name: string;
  lines: readonly [string, string];
  /** the one-line form handed to Google Maps */
  full: string;
};

export type WeddingEvent = {
  /** the route it is served at, and the key it is looked up by */
  path: string;
  eyebrow: string;
  date: string;
  time: string;
  /** IST. What the countdown counts to — must move with `time`. */
  startsAt: string;
  venue: Venue;
  /**
   * Which of the two treatments the page wears. `day` is the ceremony as it
   * has always looked; `evening` warms the paper, deepens the panel and turns
   * the lanterns up, because the reception begins after dark in November.
   */
  tone: 'day' | 'evening';
  /** the small drawing over the names */
  mark: { src: string; alt: string; w: number; h: number };
  /** what a shared link says it is */
  meta: { title: string; description: string };
};

/** the half of the card that is the same on both */
export const couple = {
  first: 'Rachel',
  conjunction: 'and',
  second: 'Praduan',
  verse:
    'I have found the one whom my soul loves. Together, we begin our forever under God\u2019s grace.',
} as const;

export const music = {
  title: 'We Cry Holy',
  artist: 'Bethel Music',
  /** 96k AAC, faststart, so playback begins on the first buffered seconds */
  src: '/assets/song.m4a',
  /** the original, kept only for anything that cannot decode AAC */
  fallback: '/assets/song.mp3',
  /** playback level once faded in — background, never overpowering */
  volume: 0.42,
} as const;

/** ms per slide */
export const slideInterval = 3000;

export const events = {
  /* ── I · the ceremony — source/ref/V4 - Kolkata.png ─────────────── */
  ceremony: {
    path: '/',
    eyebrow: 'Welcome to our Wedding Ceremony',
    date: '16.11.2026',
    time: '4:00 PM',
    startsAt: '2026-11-16T16:00:00+05:30',
    venue: {
      name: 'Circular Road Baptist Chapel',
      lines: ['Diamond Prestige, 42/43,', 'AJC Bose Rd Kolkata, West Bengal 700016'],
      full: 'Circular Road Baptist Chapel, Diamond Prestige, 42/43, AJC Bose Rd Kolkata, West Bengal 700016',
    },
    tone: 'day',
    /* the chapel is drawn because the ceremony is in one */
    mark: { src: '/assets/chapel.svg', alt: 'Line drawing of a chapel', w: 600, h: 645 },
    meta: {
      title: 'Rachel & Praduan — 16.11.2026',
      description:
        'Welcome to our Wedding Ceremony. Rachel and Praduan, 16 November 2026, Circular Road Baptist Chapel, Kolkata.',
    },
  },

  /* ── II · the reception — source/ref/V4 - Asansol.png ───────────── */
  reception: {
    path: '/reception',
    eyebrow: 'Welcome to our Wedding Reception',
    date: '21.11.2026',
    time: '6:00 PM',
    startsAt: '2026-11-21T18:00:00+05:30',
    venue: {
      name: 'Mahal Banquet',
      lines: ['MXJ9+F43, Hutton Rd, Pathak Bari,', 'Asansol, West Bengal 713301'],
      full: 'Mahal Banquet, MXJ9+F43, Hutton Rd, Pathak Bari, Asansol, West Bengal 713301',
    },
    tone: 'evening',
    /* a chapel over a banquet hall would be a lie. The couple\u2019s own
       monogram is the mark that belongs on their reception \u2014 it is already
       the seal on the cover and the signature at the foot. */
    mark: { src: '/assets/monogram.svg', alt: 'Rachel and Praduan monogram', w: 692, h: 763 },
    meta: {
      title: 'Rachel & Praduan — Reception, 21.11.2026',
      description:
        'Welcome to our Wedding Reception. Rachel and Praduan, 21 November 2026, Mahal Banquet, Asansol.',
    },
  },
} as const satisfies Record<string, WeddingEvent>;

export const mapsUrl = (venue: Venue) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.full)}`;

export const photos: Photo[] = [
  {
    id: '01', w: 1095, sm: 842, tilt: '-2deg',
    alt: 'Rachel and Praduan on a plant-filled terrace beneath string lights',
    lqip: 'data:image/webp;base64,UklGRtgAAABXRUJQVlA4IMwAAABQBQCdASoUABkAPxGAt1WsJ6UjKAgBgCIJaQDN/A/i28bPLdB3fyZazQCT6Nj6XvO/4QAA/uX1KJqWHavbPmGTL2b8gn33zcGZX8ZJXm3QlYdJvzdeedVRwQWvONrxwOEAXRFOjXFrw8Io07e8u0ISJBMdP7yRoQPmfcM2zb4IKxAHivf2L8bMPB9UxsZt6W34bexgxQd0JIj1acDfew73WhY6SD3ul/tTj3TC6n+WwFrpnAD82Unroo6wjFTa/VmhbswCo5GKrPAAAAA=',
  },
  {
    id: '08', w: 1000, sm: 720, tilt: '-1.6deg',
    alt: 'Rachel and Praduan on the street, smiling into the camera',
    lqip: 'data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAADQBACdASoUABkAPulkqk4pJaOiKA1RIB0JaQDJTBC8MeixUwVLnkOEMoOgKI/dsAD+5EDRL+rFSbXuie4JlHey3AHgWhNWzjtwgPZ7nJ/TdmUALl2ARG9x1pQmTPlbf5MPBPP3nFxq6Q5oieszjXp7VAA=',
  },
  {
    id: '02', w: 1373, sm: 900, tilt: '1.5deg',
    alt: 'Rachel and Praduan close together, both in round glasses',
    lqip: 'data:image/webp;base64,UklGRtAAAABXRUJQVlA4IMQAAABwBQCdASoUABkAPxF+tlWsJ6SjKAgBgCIJZwDQWazSAoYJE/n8UIUjDOJXvPic0NsWfqKAAPzjH3vNATffsnGdmDlD1OnPl7zIXAfs1peigye2nyoIebJXHLyy3kDOt9r+3siYYJfpUCiS7vWsHMIxB4ntXdP9nLfk6jkB92vd5u/khhNO0Tso893QWt1e17ceOqfkSU58DnGdU4vKGpZT8cyLaR0EbioQdXAY8L7hLXRC/js+yClHhQByJbCMKEFgAAAA',
  },
  {
    id: '09', w: 900, sm: 648, tilt: '2deg',
    alt: 'Rachel and Praduan holding hands as they walk',
    lqip: 'data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAACQBACdASoUABkAPuVapk0pJSOiN/VYASAciWkAzUgLvmgrDUq4KrOHJX0qQAAA/vQyAIIjqdzKxCSljmAR4SAJTYO9D5BA5fJ+HuhyarCGsWdJJ9dJ8+nWrQCcw+zZ+y8aMuyAAAA=',
  },
  {
    id: '04', w: 1123, sm: 864, tilt: '2deg',
    alt: 'Rachel and Praduan standing together outdoors in daylight',
    lqip: 'data:image/webp;base64,UklGRsgAAABXRUJQVlA4ILwAAABQBQCdASoUABkAPxF+tlWsJ6SjKAgBgCIJZwDQkywAu1jmubH9ct0mFgXuOLSRffnjuAAA98P/qgrpqigSXsT8RXUNvRHYvV3Tlso6bt9p9P0m4BxgKylE9G8gCGHaqUeGf+cfVAHc3lKFPI37bDjIGmlzhfWaoWvnZ9MswPRINO3N+D9PoZhLfiIYFyNjkm6Kj2pbE9JrrhEbXBtPUwk5KwbTVGrkwSiwdjChUB3wM3qCNRZ79DXLBrgAAA==',
  },
  {
    id: '07', w: 880, sm: 634, tilt: '1.8deg',
    alt: 'Rachel and Praduan cheek to cheek, sunlit',
    lqip: 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQBQCdASoUABkAPt1cpk0opSOiMAwBEBuJaQDMWCPVShC68x5KIaNgucVtAVMqvH4AAP7Ly1tHPE2mNgt6dpss5m7KwYuSioExzjQIfbgNN8TAAAA=',
  },
  {
    id: '05', w: 1400, sm: 900, tilt: '-1.5deg',
    alt: 'Rachel and Praduan pulling faces at the camera',
    lqip: 'data:image/webp;base64,UklGRsoAAABXRUJQVlA4IL4AAADQBQCdASoUABkAPxF+tlWsJ6SjKAgBgCIJaQDM1AgXQDrzkRWcK+DYoeHdg+s4sg6kETarug+AAM4yygFchi//P2qCwd9z+t5eK8KVl40Dd8x2AbXiTwZybFutEUqA4yevKWOplADEZjJRP9Wm+5rjRZVmbREjA8ve//6uOWOFz+ap+xJSe2ZBWvFPxWB7aTLfHG3PPatw5CMt96L6+a6ZMywThBiJFf5ostsqdw4xWkbitTt7/8hyzCGVQAAA',
  },
  {
    id: '10', w: 880, sm: 634, tilt: '-1.2deg',
    alt: 'Rachel and Praduan’s hands clasped together',
    lqip: 'data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAADwBACdASoUABkAPulop1ApJaMiqA1RIB0JZwAAJ/8+KHXii0zPMrwB372J4VvNhkAA/uv8tjaMr04Pem4rbWcVbv+T7A0f7uo9ZrPTCuBhlkzyCEDoGYpMnqlw32FLTkapt7lP7eLr7YoSAAA=',
  },
  {
    id: '06', w: 1400, sm: 900, tilt: '1deg',
    alt: 'Rachel and Praduan on a Kolkata street at night',
    lqip: 'data:image/webp;base64,UklGRr4AAABXRUJQVlA4ILIAAAAQBQCdASoUABkAPxF4sFKsJyQiqA1RgCIJaQDQHXsSQAEgSCL5qSjsUgV/ubExvA+8AP2Bl87hQG8V8Rx0N9+JMTNLaUEsPeoFlKMFYwqHJSO89Auh6etGG4CnDof++XCgKpYxeJtynWDWDrnCvrKs7eA+KUY63KjPtzAcUOonv4iQzwsiBxd8WXuX4cjlPAcbSBai+NCLJ+FyLylUQHKeLrC3fNI9y7+Rf22QhtwTKSgA',
  },
];
