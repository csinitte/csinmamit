/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "github.com",
    ],
  },
};

export default config;

// TODO  Change it Later
// images: {
//   remotePatterns: [
//     {
//       protocol: 'https',
//       hostname: 'lh3.googleusercontent.com',
//       port: '',
//       pathname: '/**',
//     },
//   ],
