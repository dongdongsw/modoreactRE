'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // useSearchParams와 usePathname 사용
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuYoga from '@/components/Header/Menu/MenuYoga'
import Footer from '@/components/Footer/Footer'
import axios from 'axios';

interface NoticeData {
    id: string;
    title: string;
    content: string;
    createdDate: string;
    imagePath: string;
    author: string;
    date: string;
}

const NoticeDetail = () => {
    const pathname = usePathname();
    const router = useRouter();
    const id = pathname.split('/').pop();
    const [notice, setNotice] = useState<NoticeData | null>(null);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true); // 로딩 상태 관리 추가

    useEffect(() => {
        setLoading(true);

        // 공지사항 데이터 가져오기
        axios.get(`/api/notice/${id}`)
            .then(response => {
                if (response.data) {
                    setNotice(response.data);
                } else {
                    
                    alert('해당 공지사항을 찾을 수 없습니다.'); 
                }
            })
            .catch(error => {
                alert('공지사항을 가져오는 도중 오류가 발생했습니다.'); 

            })
            .finally(() => {
                setLoading(false); // 로딩 완료
            });

        // 사용자 권한 정보 가져오기
        axios.get('/login/user/role')
            .then(response => {
                const { role } = response.data;
                setUserRole(role);
            })
            .catch(error => {
                alert('사용자 권한 정보를 가져오는 도중 오류가 발생했습니다.'); 
            });
    }, [id]);

    const handleDelete = () => {
        axios.delete(`/api/notice/${id}`)
            .then(() => {
                router.push('/notice/NoticeListPage');  // 페이지 이동
            })
            .catch(error => {
                alert('공지사항 삭제 도중 오류가 발생했습니다.'); 
                
            });
    };

    if (loading) {
        return <div>Loading...</div>; // 로딩 중일 때 표시
    }

    

    if (!notice) {
        return <div>공지사항을 찾을 수 없습니다.</div>; // 공지사항이 null인 경우 표시
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuYoga/>
            </div>
            <div className='blog detail2 md:mt-[74px] mt-[56px] border-t border-line'>
                <div className="container lg:pt-20 md:pt-14 pt-10">
                    <div className="blog-content flex justify-center max-lg:flex-col gap-y-10">
                        <div className="main xl:w-3/4 lg:w-2/3 lg:pr-[15px]">
                            <div className="heading3 mt-3">{notice.title}</div>
                            <div className="heading3 flex justify-between  md:pt-8">
                            <div> </div>
                            {userRole === 'ROLE_ADMIN' &&
                                    <button onClick={handleDelete} className='button-main'>삭제</button>
                                }
                            </div>
                            <div className="author flex items-center gap-4 mt-4">
                                <div className='flex items-center gap-2'>
                                    <div className="caption1 text-secondary">by {notice.author}</div>
                                    <div className="line w-5 h-px bg-secondary"></div>
                                    <div className="caption1 text-secondary">{notice.date}</div>
                                </div>
                            </div>
                             {/* 이미지가 있는 경우에만 렌더링 */}
                            {notice.imagePath && (
                                <div className="bg-img md:py-10 py-6">
                                    <Image
                                        src={notice.imagePath}
                                        width={5000}
                                        height={4000}
                                        alt={notice.title}
                                        className='w-full object-cover rounded-3xl'
                                    />
                                </div>
                            )}
                            <div className="content">
                                <div className="body1">{notice.content}</div>
                            </div>
                            <div className="action flex items-center justify-between flex-wrap gap-5 md:mt-8 mt-5">
                                <div className="right list-social flex items-center gap-3 flex-wrap">
                                    <p>Share:</p>
                                    <div className="list flex items-center gap-3 flex-wrap">
                                        <Link href={'https://www.facebook.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-facebook duration-100"></div>
                                        </Link>
                                        <Link href={'https://www.instagram.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-instagram duration-100"></div>
                                        </Link>
                                        <Link href={'https://www.twitter.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-twitter duration-100"></div>
                                        </Link>
                                        <Link href={'https://www.youtube.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-youtube duration-100"></div>
                                        </Link>
                                        <Link href={'https://www.pinterest.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-pinterest duration-100"></div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="next-pre flex items-center justify-between md:mt-8 mt-5 py-6 border-y border-line">
                                {/* Next/Previous navigation 로직 수정 필요 시 추가 */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default NoticeDetail;
