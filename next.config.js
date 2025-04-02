// @ts-check

/** @type {import('next').NextConfig} */

import withNextra from 'nextra';

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config',
  nextConfig,
  // optional: add `unstable_staticImage: true` to enable Nextra's auto image import
});
