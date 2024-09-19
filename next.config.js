/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            // API 요청을 백엔드 서버로 리디렉션
            {
                source: '/api/:path*',
                destination: 'http://localhost:8080/api/:path*',
            },
            // 동적 경로는 Next.js에서 처리
            {
                source: '/event/:id', 
                destination: '/event/[id]', // Next.js가 처리하도록 설정
            },
            // 나머지 모든 경로는 백엔드로 리디렉션
            {
                source: '/:path*',
                destination: 'http://localhost:8080/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
