/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /symbol-crypto-wasm-node/,
        '../../../symbol-crypto-wasm-web/symbol_crypto_wasm.js'
      )
    );

    config.experiments = { asyncWebAssembly: true, topLevelAwait: true, layers: true };

    return config;
  },
};

module.exports = nextConfig;
