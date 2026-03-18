/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed standalone output for Vercel deployment
  // Vercel handles static files automatically from public directory
  images: {
    // Images are now served locally from public/images/
  },
};

export default nextConfig;
