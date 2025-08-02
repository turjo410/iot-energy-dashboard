/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add webpack configuration if needed
  webpack: (config, { isServer }) => {
    // Don't try to manually add mini-css-extract-plugin
    // Next.js handles CSS extraction automatically
    return config;
  },
}

module.exports = nextConfig
