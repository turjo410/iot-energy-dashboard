/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // basePath and assetPrefix are no longer needed for a custom domain
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
