import type { Metadata, Viewport } from 'next';
import { Cormorant, EB_Garamond, Pinyon_Script } from 'next/font/google';
import { events } from '@/lib/invitation';
import './globals.css';

const serif = Cormorant({
  subsets: ['latin'], weight: ['300', '400', '500'],
  variable: '--f-serif', display: 'swap',
});
const book = EB_Garamond({
  subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'],
  variable: '--f-book', display: 'swap',
});
const script = Pinyon_Script({
  subsets: ['latin'], weight: '400',
  variable: '--f-script', display: 'swap',
});

/* the ceremony's, as the site's default — /reception overrides title,
   description and openGraph with its own */
export const metadata: Metadata = {
  title: events.ceremony.meta.title,
  description: events.ceremony.meta.description,
  icons: {
    // the SVG carries its own prefers-color-scheme rule, so the mark repaints
    // itself for a dark tab strip; the PNGs sit on their own paper bed instead,
    // since a raster icon cannot adapt
    icon: [
      { url: '/assets/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/assets/icon-180.png',
  },
  openGraph: {
    title: events.ceremony.meta.title,
    description: events.ceremony.meta.description,
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FDFCF9',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/* The card itself is `components/Shell`, rendered by each route — a layout is
   shared by both invitations and so cannot know whose date to print. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${book.variable} ${script.variable}`}>
      <body>
        {/* marks that scripting is live, so the reveal styles may hide things */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
      </body>
    </html>
  );
}
