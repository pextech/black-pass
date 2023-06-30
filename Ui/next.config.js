/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["framer.com"],
        formats: ["image/webp"],
    },
    reactStrictMode: true,
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
