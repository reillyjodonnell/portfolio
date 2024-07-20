// @ts-check

/** @type {import('next').NextConfig} */

import withNextra from 'nextra';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.hashnode.com', 'unsplash.com'],
  },
};

export default withNextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config',
  nextConfig,
  // optional: add `unstable_staticImage: true` to enable Nextra's auto image import
});
