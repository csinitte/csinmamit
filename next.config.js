/** @type {import('next').NextConfig} */
const nextConfig = {

    async redirects() {
      return [
        {
          source: '/sign-in',
          destination: '/api/auth/login',
          permanent: true,
        },
        {
          source: '/sign-up',
          destination: '/api/auth/register',
          permanent: true,
        },

      ]
    },

  
    webpack: (
      config,
      { buildId, dev, isServer, defaultLoaders, webpack }
    ) => {
      config.resolve.alias.canvas = false
      config.resolve.alias.encoding = false
      return config
    },
    images: {
      domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com', 'github.com'],
    
      },
  }
  
  module.exports = nextConfig