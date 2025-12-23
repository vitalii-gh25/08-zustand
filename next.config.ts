// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**', // разрешаем любые пути
      },
      {
        protocol: 'https',
        hostname: 'ac.goit.global',
        pathname: '/fullstack/react/**', // разрешаем все пути в этой папке
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/notes/filter/:slug', // маршрут сторінки
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
