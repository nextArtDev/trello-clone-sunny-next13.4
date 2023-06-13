/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://cloud.appwrite.io/v1/:path*',
      },
    ]
  },
  images: {
    domains: ['cloud.appwrite.io'],
  },
}

module.exports = nextConfig
