/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  // every image is pre-encoded by hand (AVIF/WebP/JPEG), so the built-in
  // optimiser has nothing to add and would only re-encode on the server
  images: { unoptimized: true },
};
