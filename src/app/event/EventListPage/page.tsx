'use client'

import React, { useEffect, useState } from 'react';
import TopNavOne from '@/components/Header/TopNav/TopNavOne';
import MenuYoga from '@/components/Header/Menu/MenuYoga';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import BlogItem from '../EventListItem'; // BlogItem을 가져와 렌더링
import Footer from '@/components/Footer/Footer';
import HandlePagination from '@/components/Other/HandlePagination';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

interface EventData {
    id: string;
    title: string;
    content: string;
    createdDate: string;
    imagePath: string;
}

const BlogGrid = () => {
    const pathname = usePathname()
    const [userRole, setUserRole] = useState('');
    const [events, setEvents] = useState<EventData[]>([]); // 여러 데이터를 받을 상태로 변경
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const currentPage = 0; // 페이지네이션 관련 설정
    const pageCount = 1; // 예시로 설정 (추후 필요에 따라 수정 가능)

    useEffect(() => {
        // 서버에서 여러 개의 데이터 가져오기
        fetch('/api/event') // API 엔드포인트 수정
            .then((response) => response.json())
            .then((data) => {
                setEvents(data); // 데이터를 상태로 설정
                setLoading(false); // 로딩 완료
            })
            .catch((error) => console.error('Error fetching event data:', error));

            axios.get('/login/user/role')
            .then(response => {
                const { role } = response.data;
                setUserRole(role);
            })
            .catch(error => {
                console.error('Error fetching user role:', error);
            });   
    }, []);

    if (loading) return <div>Loading...</div>; // 데이터 로드 전 처리

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuYoga/>
                <Breadcrumb heading='Event' subHeading='Event' />
            </div>
            
            {userRole === 'ROLE_ADMIN' &&
            <div className="flex justify-center md:py-8">
                <Link href="/event/EventForm" className='text-secondary duration-300'>
                    <button className="button-main">새로운 이벤트 작성</button>
                </Link>
            </div>
            }

            <div className='blog grid md:py-20 py-10'>
                <div className="container">
                    <div className="list-blog grid lg:grid-cols-3 sm:grid-cols-2 md:gap-[42px] gap-8">
                        {/* 여러 BlogItem 컴포넌트를 렌더링 */}
                        {events.map((event) => (
                            <BlogItem key={event.id} event={event} type='style-one' />
                        ))}
                    </div>
                    {pageCount > 1 && (
                        <div className="list-pagination w-full flex items-center justify-center md:mt-10 mt-6">
                            <HandlePagination pageCount={pageCount} onPageChange={() => {}} />
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BlogGrid;
