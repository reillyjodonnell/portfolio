// @ts-check

/** @type {import('next').NextConfig} */

import withNextra from 'nextra';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.hashnode.com',
      },
    ],
  },
};

export default withNextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config',

  nextConfig,
  // optional: add `unstable_staticImage: true` to enable Nextra's auto image import
});
