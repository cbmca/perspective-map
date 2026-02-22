import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/perspective-map",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
