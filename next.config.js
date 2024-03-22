/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "dist",
  trailingSlash: true,
  assetPrefix: "/",
  output: "export",
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      {
        source: "/sign-in",
        destination: "/api/auth/login",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "/api/auth/register",
        permanent: true,
      },
    ];
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "github.com",
    ],
  },
};

module.exports = nextConfig;
