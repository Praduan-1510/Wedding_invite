import type { Metadata, Viewport } from 'next';
import { Cormorant, EB_Garamond, Pinyon_Script } from 'next/font/google';
import Overture from '@/components/Overture';
import RevealRoot from '@/components/RevealRoot';
import Usher from '@/components/Usher';
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

export const metadata: Metadata = {
  title: 'Rachel & Praduan — 16.11.2026',
  description:
    'Welcome to our Wedding Ceremony. Rachel and Praduan, 16 November 2026, Circular Road Baptist Chapel, Kolkata.',
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
    title: 'Rachel & Praduan — 16.11.2026',
    description: 'Welcome to our Wedding Ceremony. Circular Road Baptist Chapel, Kolkata.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FDFCF9',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${book.variable} ${script.variable}`}>
      <body>
        {/* marks that scripting is live, so the reveal styles may hide things */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />

        {/* the one artwork, fixed behind everything */}
        <div className="backdrop" aria-hidden="true">
          <picture>
            <source media="(min-width:900px)" srcSet="/assets/floral-2400.webp" />
            <img src="/assets/floral-1400.webp" alt="" fetchPriority="high" decoding="async" />
          </picture>
        </div>
        <div className="grain" aria-hidden="true" />

        {/* before <main> so the seal is the first thing a keyboard reaches */}
        <Overture />
        <main>{children}</main>
        <RevealRoot />
        <Usher />
      </body>
    </html>
  );
}
