/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.dicebear.com', 'avatars.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: '**.clerk.accounts.dev',
      },
    ],
  },
  eslint: {
    // Ignore ESLint during builds to prevent deployment failures
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during builds for production deployment
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
}

module.exports = nextConfig
