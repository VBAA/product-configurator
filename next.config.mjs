/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enable standalone output for server deployment
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tablechairetc.auinno.site',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
