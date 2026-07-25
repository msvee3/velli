import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google account profile photos (NextAuth session.user.image)
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      // Azure Blob Storage — any *.blob.core.windows.net account
      { protocol: 'https', hostname: '*.blob.core.windows.net' },
    ],
  },
}

export default nextConfig
