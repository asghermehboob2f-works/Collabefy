/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "stitch.googleapis.com", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;

