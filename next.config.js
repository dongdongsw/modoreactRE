/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  
    images: {
      unoptimized: true,  // 이미지 최적화 비활성화
    },
  
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8080/api/:path*',
            },
            {
                source: '/:path*',
                destination: 'http://localhost:8080/:path*',
            },
        ];
    },
  };
  
  module.exports = nextConfig;
  