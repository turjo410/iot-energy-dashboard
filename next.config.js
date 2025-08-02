/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ** ADD THIS FOR GITHUB PAGES DEPLOYMENT **
  basePath: '/iot-energy-dashboard', // Replace 'iot-energy-dashboard' with your repository name
  assetPrefix: '/iot-energy-dashboard/', // Replace 'iot-energy-dashboard' with your repository name
  output: 'export', // Required for static export to GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;
