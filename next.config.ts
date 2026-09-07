import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        // /collection rendered the identical page to /shop at a second URL:
        // same component, same defaults, same H1, all 27 products. Two URLs for
        // one page splits ranking signals and gives Google a duplicate to pick
        // between. /shop is the survivor because every breadcrumb, the header
        // search, the footer, the basket and the offers link already point at
        // it; /collection had one inbound link on the home page hero.
        source: "/collection",
        destination: "/shop",
        permanent: true
      }
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "www.yorkshire.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "www.yell.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "www.loopnet.com",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
