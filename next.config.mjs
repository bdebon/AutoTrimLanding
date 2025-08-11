/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Disable optimization by Next when not on Vercel; keeps things simple to start
    unoptimized: true,
  },
};

export default nextConfig;
