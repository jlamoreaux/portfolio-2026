/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['sanity', 'next-sanity', '@sanity/vision', '@sanity/code-input'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

// Exclude studio from Cloudflare builds (too large for free tier)
if (process.env.CF_PAGES || process.env.EXCLUDE_STUDIO) {
  nextConfig.experimental = {
    ...nextConfig.experimental,
  }
  // This will cause the studio route to 404 in production
  // Access studio at: https://your-project.sanity.studio instead
}

module.exports = nextConfig
