const withNextra = require('nextra')({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config',
  // optional: add `unstable_staticImage: true` to enable Nextra's auto image import
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.hashnode.com'],
  },
};

module.exports = withNextra(nextConfig);
