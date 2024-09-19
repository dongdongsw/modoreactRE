'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuYoga from '@/components/Header/Menu/MenuYoga'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import BlogItem from '../NoticeLtstItem';
import Footer from '@/components/Footer/Footer'
import HandlePagination from '@/components/Other/HandlePagination'
import { useRouter } from 'next/navigation'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import axios from 'axios';
import Link from 'next/link';

interface NoticeData {
    id: string;
    title: string;
    content: string;
    createdDate: string;
}

const BlogList = () => {
    const [userRole, setUserRole] = useState('');
    const [notices, setNotices] = useState<NoticeData[]>([]); // 공지사항 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const currentPage = 0; // 페이지네이션 관련 설정
    const pageCount = 1; // 페이지 수

    useEffect(() => {
        // axios로 API 호출
        axios.get('/api/notice') // Node.js API 엔드포인트
            .then((response) => {
                setNotices(response.data); // 공지사항 데이터를 상태에 저장
                setLoading(false); // 로딩 완료
            })
            .catch((error) => {
                console.error('Error fetching notices:', error);
                setLoading(false); // 에러 시에도 로딩 상태 변경
            });

            axios.get('/login/user/role')
            .then(response => {
                const { role } = response.data;
                setUserRole(role);
            })
            .catch(error => {
                console.error('Error fetching user role:', error);
            });
    }, []);

    if (loading) return <div>Loading...</div>; // 로딩 중일 때 표시


    return (
        <>
             <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
        <div id="header" className='relative w-full'>
            <MenuYoga/>
            <Breadcrumb heading='Notice List' subHeading='Notice List' />
        </div>
        {userRole === 'ROLE_ADMIN' &&
        <div className="flex justify-center md:py-8">
        <Link href="/notice/NoticeForm" className='text-secondary duration-300'>
                <button className="button-main">새로운 공지사항 작성</button>
                </Link>
                </div>
                }
        <div className='blog list md:py-20 py-10'>
            <div className="container mx-auto">
                <div className="flex justify-center max-xl:flex-col gap-y-12"> {/* 가운데 정렬 */}
                    <div className="left w-full xl:w-3/4 xl:pr-2 mx-auto"> {/* 중앙 정렬 */}
                        <div className="list-blog flex flex-col xl:gap-10 gap-8">
                            {/* NoticeItem 컴포넌트를 여러 개 렌더링 */}
                            {notices.map((notice) => (
                                <BlogItem key={notice.id} notice={notice} type='style-one' />
                            ))}
                        </div>
                        {pageCount > 1 && (
                            <div className="list-pagination w-full flex items-center justify-center md:mt-10 mt-6">
                                <HandlePagination pageCount={pageCount} onPageChange={() => {}} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </>
    )
}

export default BlogList