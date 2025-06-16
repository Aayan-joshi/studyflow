import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["pino", "pino-pretty"],
  transpilePackages: ['next-mdx-remote'],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "png.pngtree.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      }
    ],
  },
};

export default nextConfig;
