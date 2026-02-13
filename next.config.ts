import { siteConfig } from "@/shared/config/site";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: siteConfig.proxy.defaultUrl.replace(/^https?:\/\//, ""),
        port: "",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "cataas.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: ["*.suicaodex.com"],
  rewrites: () => [
    {
      source: "/manga-sitemap.xml",
      destination: "/manga-sitemap",
    },
    {
      source: "/manga-sitemap-:page.xml",
      destination: "/manga-sitemap/:page",
    },
  ],
};

export default nextConfig;
