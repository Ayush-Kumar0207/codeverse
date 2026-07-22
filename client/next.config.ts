import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname, ".."),
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
