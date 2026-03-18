/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enable standalone output for server deployment
  images: {
    // Images are now served locally from public/images/
  },
};

export default nextConfig;
