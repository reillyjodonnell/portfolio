// @ts-check

/** @type {import('next').NextConfig} */

import withNextra from 'nextra';

const nextraConfig = {
  // optional: add `staticImage: true` to enable Nextra's auto image import
};

const nextra = withNextra(nextraConfig);

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

export default nextra(nextConfig);
