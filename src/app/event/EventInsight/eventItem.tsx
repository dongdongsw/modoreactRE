'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { eventType } from './eventType';
import { useRouter } from 'next/navigation';
import '../EventList.css';


interface BlogProps {
    event: eventType // event로 이름 변경
    type: string
}

const EventItem: React.FC<BlogProps> = ({ event, type }) => {
    const router = useRouter()

    const handleBlogClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // 이벤트 상세 페이지로 이동
        router.push(`/event/${event.id}`);
    };

    // 제목이 90자 이상일 경우 '...'으로 줄이기
const truncateTitle = (title: string, maxLength: number) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
};

    return (
        <>
            {type === "style-one" ? (
                <div
                className="blog-item style-one h-full cursor-pointer"
                onClick={handleBlogClick} // 함수 실행하도록 변경
            >
                    <div className="blog-main h-full block">
                        <div className="blog-thumb rounded-[20px] overflow-hidden">
                            <Image
                                src={event.imagePath || ' '}
                                width={2000}
                                height={1500}
                                alt='event-img'
                                className='w-full duration-500'
                            />
                        </div>
                        <div className="blog-infor mt-7 text-center">
                            <div className="blog-tag bg-green py-1 px-2.5 rounded-full text-button-uppercase inline-block">{truncateTitle(event.title, 29)}</div>
                            
                            
                        </div>
                    </div>
                </div>
            ) : null }
        </>
    )
}

export default EventItem
