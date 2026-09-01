/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  // every image is pre-encoded by hand (AVIF/WebP/JPEG), so the built-in
  // optimiser has nothing to add and would only re-encode on the server
  images: { unoptimized: true },

  // The ceremony lives at /wedding. `/` was its address first and that link is
  // already in guests' hands, so the bare domain still has to reach the card —
  // it redirects rather than 404s. Temporary (307) rather than permanent (308)
  // on purpose: a 308 is cached by the browser more or less forever, and this
  // card has been moved once already.
  async redirects() {
    return [{ source: '/', destination: '/wedding', permanent: false }];
  },
};
