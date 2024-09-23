'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './EventList.css';
import Link from 'next/link';


interface BlogProps {
    type: string;
    event: {
        id: string;
        title: string;
        content: string;
        createdDate: string;
        imagePath: string;
    };
}

const BlogItem: React.FC<BlogProps> = ({ type, event }) => {

    const router = useRouter();

     // 이벤트 클릭 시 페이지 이동을 처리하는 함수
    const handleBlogClick = (e: React.MouseEvent<HTMLDivElement>) => { // 이벤트 타입 명시
        // 동적 페이지로 이동 (event.id 사용)
        router.push(`/event/${event.id}`);
    };

    // 날짜 형식을 YYYY-MM-DD로 변환
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // 'T'로 나눈 후 첫 번째 부분만 사용
    };

    return (
        <>
            {type === "style-one" ? (
                <div
                    className="blog-item style-one h-full cursor-pointer"
                    onClick={handleBlogClick} // 클릭 시 handleBlogClick 함수 호출
                >                    
                    <div className="blog-main h-full block">
                        <div className="blog-thumb rounded-[20px] overflow-hidden">
                            <Image
                                src={event.imagePath || '/images/default.jpg'}
                                alt={event.title}
                                width={2000}
                                height={1500}
                                layout="responsive"
                                style={{ objectFit: 'cover' }}
                                className="w-full duration-500"
                            />
                        </div>
                        <div className="blog-infor mt-7">
                            <div className="heading6 blog-title mt-3 duration-300">{event.title}</div>
                            <div className="body1 text-secondary mt-4">{event.content}</div>
                            <div className="blog-date caption1 text-secondary">{formatDate(event.createdDate)}</div>
                            
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default BlogItem;
