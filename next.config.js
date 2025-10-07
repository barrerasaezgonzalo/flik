/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/(.*)",
        has: [{ type: "host", value: "flik.cl" }],
        destination: "https://www.flik.cl/:1",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)\\.(js|css|svg|png|jpg|jpeg|webp|ico|woff2|ttf)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
