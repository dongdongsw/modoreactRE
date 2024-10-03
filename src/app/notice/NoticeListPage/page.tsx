'use client'
import React, { useState, useEffect } from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuYoga from '@/components/Header/Menu/MenuYoga'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import BlogItem from '../NoticeLtstItem';
import Footer from '@/components/Footer/Footer'
import axios from 'axios';
import Link from 'next/link';

interface NoticeData {
    id: string;
    title: string;
    content: string;
    createdDate: string;
    imagePath: string;
}

const BlogList = () => {
    const [userRole, setUserRole] = useState('');
    const [notices, setNotices] = useState<NoticeData[]>([]); // 공지사항 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const itemsPerPage = 5; // 페이지당 표시할 공지사항 수

    useEffect(() => {
        // axios로 API 호출
        axios.get('/api/notice') // Node.js API 엔드포인트
            .then((response) => {
                setNotices(response.data); // 공지사항 데이터를 상태에 저장
                setLoading(false); // 로딩 완료
            })
            .catch((error) => {
                alert('공지사항 목록을 불러 오는 것에 실패 했습니다.');
                setLoading(false); // 에러 시에도 로딩 상태 변경
            });

        axios.get('/login/user/role')
            .then(response => {
                const { role } = response.data;
                setUserRole(role);
            })
            .catch(error => {
                alert('사용자 정보를 불러오는데 실패했습니다.');
            });
    }, []);

    // 페이지네이션에 사용할 데이터 추출
    const indexOfLastNotice = currentPage * itemsPerPage;
    const indexOfFirstNotice = indexOfLastNotice - itemsPerPage;
    const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);

    // 페이지네이션 버튼 생성
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(notices.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

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
                                {currentNotices.map((notice) => (
                                    <BlogItem key={notice.id} notice={notice} type='style-one' />
                                ))}
                            </div>
                            {/* 페이지네이션 버튼 추가 */}
                            <div className="pagination flex justify-center mt-10">
                                <ul className="flex space-x-4">
                                    {pageNumbers.map((number) => (
                                        <li key={number}>
                                            <button
                                                onClick={() => handlePageChange(number)}
                                                className={`px-4 py-2 ${currentPage === number ? 'bg-secondary text-white' : 'bg-gray-200'} rounded`}
                                            >
                                                {number}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default BlogList;
