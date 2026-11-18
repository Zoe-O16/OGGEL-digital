/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Room for contact form attachments (Vercel caps request bodies at 4.5 MB).
  experimental: { serverActions: { bodySizeLimit: '4.5mb' } }
};

export default nextConfig;
