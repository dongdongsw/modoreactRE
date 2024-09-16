/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    async rewrites() {
        return [
            {
                source: '/api/:path*',  // 클라이언트가 요청하는 /api/ 경로
                destination: 'http://localhost:8080/api/:path*',  // 프록시할 서버의 /api/ 경로
            },
            {
                source: '/:path*',
                destination: 'http://localhost:8080/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
