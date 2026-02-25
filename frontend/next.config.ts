/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbo and next-intl removed to fix startup crash

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
