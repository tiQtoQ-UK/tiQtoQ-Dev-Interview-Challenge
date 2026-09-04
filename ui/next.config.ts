import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(import.meta.dirname, "..")
  },
  transpilePackages: ["@dev-interview-challenge/shared"]
};

export default nextConfig;
