/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    forceSwcTransforms: false,
  },
};

process.env.NEXT_PRIVATE_STANDALONE_DISABLE_NATIVE = '1';

export default nextConfig;
