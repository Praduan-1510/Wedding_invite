import type { Metadata, Viewport } from 'next';
import Shell from '@/components/Shell';
import { events } from '@/lib/invitation';

const v = events.ceremony;

export const metadata: Metadata = {
  title: v.meta.title,
  description: v.meta.description,
  openGraph: { title: v.meta.title, description: v.meta.description, type: 'website' },
};

export const viewport: Viewport = { themeColor: '#FDFCF9' };

/** The Kolkata ceremony. `/` redirects here, so every link already in a
 *  guest's hands still lands on this card — see next.config.mjs. */
export default function Wedding() {
  return <Shell event={v} />;
}
