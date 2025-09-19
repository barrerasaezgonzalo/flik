/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    legacyBrowsers: false, // ⚡ Desactiva soporte a navegadores viejos
  },
  optimizeCss: true,
  async headers() {
    return [
      {
        // Cachea archivos estáticos
        source: "/(.*)\\.(js|css|svg|png|jpg|jpeg|webp|ico|woff2|ttf)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // No cachea HTML
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