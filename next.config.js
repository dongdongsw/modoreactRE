/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  
    images: {
      unoptimized: true,  // 이미지 최적화 비활성화
    },
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

            {
                source: '/Pay/:p', 
                destination: '/Pay/p', // Next.js가 처리하도록 설정
            },

            {
                source: '/store/:id',
                destination: '/store/[id]', // Next.js가 처리하도록 설정
            },

            {
                source: '/notice/:id', 
                destination: '/notice/[id]', // Next.js가 처리하도록 설정
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
