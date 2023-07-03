/** @type {import('next').NextConfig} */
require('dotenv').config();
const nextConfig = {
    images: {
        domains: ["framer.com"],
        formats: ["image/webp"],
    },
    reactStrictMode: true,
  env: {
    PRIVATE_KEY: process.env.NEXT_PUBLIC_PRIVATE_KEY,
    ACCOUNT_ID: process.env.NEXT_PUBLIC_ACCOUNT_ID,
    NFT_TOKEN_ID: process.env.NEXT_PUBLIC_NFT_TOKEN_ID,
    BLACK_PASS_ID: process.env.NEXT_PUBLIC_BLACK_PASS_ID
  },
}

const nodeExternals = require('webpack-node-externals');

module.exports = {
  ...nextConfig,
  webpack: (config, { isServer }) => {
    if (!isServer) {
        config.externals.push({ bufferutil: "bufferutil", "utf-8-validate": "utf-8-validate", "supports-color": "supports-color" }); 
    }

    return config;
  },
};

module.exports = nextConfig
