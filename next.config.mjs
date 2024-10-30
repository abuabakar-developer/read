/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['books.google.com', 'books.googleusercontent.com'], // Allow Google Books image domains
  },
  webpack: (config, { isServer }) => {
    // Add fallbacks for Node modules that are only available on the server-side
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      fs: false,
      'fs/promises': false,
      child_process: false,
      dns: false,
      'timers/promises': false,
      '@mongodb-js/zstd': false, // Exclude zstd module
      '@napi-rs/snappy': false, // Exclude snappy module
    };

    return config;
  },
};

export default nextConfig;


