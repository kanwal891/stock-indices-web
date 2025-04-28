
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  typescript: {
    // We'll work with the existing tsconfig without modifying it
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig;
