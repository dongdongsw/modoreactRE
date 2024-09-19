'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useRouter } from 'next/navigation';
import { BlogType } from '@/type/BlogType'; // 공지사항 타입 정의 필요

interface BlogProps {
    type: string;
    notice: {
        id: string;
        title: string;
        content: string;
        createdDate: string;
    };
}

const BlogItem: React.FC<BlogProps> = ({ type, notice }) => {
    const router = useRouter();

    const handleNoticeClick = (noticeId: string) => {
        router.push(`/notice/${noticeId}`);
    };

    // 날짜 형식을 YYYY-MM-DD로 변환
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };


    return (
        <>
            {type === "style-one" ? (
                 <>
                <div className="notice-item style-one h-full cursor-pointer" onClick={() => handleNoticeClick(notice.id)}>
                    <div className="notice-main h-full block">
                        <div className="notice-infor mt-7">
                            <div className="heading6 notice-title mt-3 duration-300">{notice.title}</div>
                            <div className="body1 text-secondary mt-4">{notice.content}</div>
                            <div className="notice-date caption1 text-secondary">{formatDate(notice.createdDate)}</div>
                        </div>
                    </div>
                </div>
                <hr className="my-4 border-t border-gray-200 opacity-50" />

                </>
            ) : null}
        </>
            )
            }
 

export default BlogItem