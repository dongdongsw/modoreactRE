'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './EventList.css';

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

    const handleBlogClick = (eventId: string) => {
        router.push(`/event/${eventId}`);
        
    };

    // 날짜 형식을 YYYY-MM-DD로 변환
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // 'T'로 나눈 후 첫 번째 부분만 사용
    };

    return (
        <>
            {type === "style-one" ? (
                <div className="blog-item style-one h-full cursor-pointer" onClick={() => handleBlogClick(event.id)}>
                    <div className="blog-main h-full block">
                        <div className="blog-thumb rounded-[20px] overflow-hidden">
                            <Image
                                src={event.imagePath || '/images/default.jpg'}
                                alt={event.title}
                                width={2000}
                                height={1500}
                                layout="responsive"
                                objectFit="cover"  // 컨테이너에 맞게 자르기
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
