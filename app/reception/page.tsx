import type { Metadata, Viewport } from 'next';
import Shell from '@/components/Shell';
import { events } from '@/lib/invitation';

const v = events.reception;

/* merged over the root layout's, so a shared reception link previews the
   reception — its own date, its own venue — and never the ceremony */
export const metadata: Metadata = {
  title: v.meta.title,
  description: v.meta.description,
  openGraph: { title: v.meta.title, description: v.meta.description, type: 'website' },
};

/* the browser chrome takes the warmer paper with the rest of the card */
export const viewport: Viewport = { themeColor: '#FBF8F1' };

export default function Reception() {
  return <Shell event={v} />;
}
