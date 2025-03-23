/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'typischich.ch',
      },
      {
        protocol: 'https',
        hostname: 'strapi.prod-strapi-fra-01.surmatik.ch',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
