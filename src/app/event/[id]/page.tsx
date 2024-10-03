'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuYoga from '@/components/Header/Menu/MenuYoga'
import Footer from '@/components/Footer/Footer'
import { usePathname, useRouter  } from 'next/navigation'; // useRouter로 변경
import axios from 'axios';


interface EventData {
    id: string;
    title: string;
    content: string;
    createdDate: string;
    imagePath: string;
    author: string;
    date: string;
    
}

const EventDetail = () => {
    const pathname  = usePathname(); // useRouter로 라우팅 정보 가져오기
    const router = useRouter(); // Initialize useRouter for navigation
    const [userRole, setUserRole] = useState('');

    const id = pathname?.split('/').pop(); // Extract id from the path
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            axios.get(`/api/event/${id}`)
                .then(response => {
                    setEvent(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching event:', error);
                    setLoading(false);
                });
        }
        axios.get('/login/user/role')
            .then(response => {
                const { role } = response.data;
                setUserRole(role);
            })
            .catch(error => {
                console.error('Error fetching user role:', error);
            });
    }, [id]);

    const handleDelete = () => {
        axios.delete(`/api/event/${id}`)
            .then(() => {
                router.push('/event/EventListPage'); // 페이지 이동
            })
            .catch(error => {
                console.error('Error deleting event:', error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!event) {
        return <div>No event found.</div>;
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuYoga/>
            </div>
            <div className="blog-content flex items-center justify-center">
                
            </div>
            <div className='blog detail1 '>
                <div className="heading3 flex justify-center">{event.title}</div>
                    <div className="heading3 flex justify-between  md:pt-8">
                    <div> </div>
                    {userRole === 'ROLE_ADMIN' &&
                            <button onClick={handleDelete} className='button-main'>삭제</button>
                        }
                    </div>
                 {/* 이미지가 있을 때만 이미지 컨테이너를 렌더링 */}
                 {event.imagePath && (
                    <div className="bg-img flex justify-center items-center md:mt-[74px] mt-14">
                        <Image
                            src={event.imagePath}
                            width={5000}
                            height={4000}
                            alt="Event Image"
                            className='w-full min-[1600px]:h-[800px] xl:h-[1200px] lg:h-[1500px] sm:w-[1000px] sm:h-[1500px] h-[260px] object-cover'
                        />
                    </div>
                )}

                <div className="container md:pt-20 pt-10">
                    <div className="blog-content flex items-center justify-center">
                        <div className="main md:w-5/6 w-full">
                            
                            <div className="author flex items-center gap-4 mt-4">
                                
                                <div className='flex items-center gap-2'>
                                    <div className="caption1 text-secondary">by {event.author}</div>
                                    <div className="line w-5 h-px bg-secondary"></div>
                                    <div className="caption1 text-secondary">{event.date}</div>
                                </div>
                            </div>
                            <div className="content md:mt-8 mt-5">
                                <div className="body1">{event.content}</div>
                                
                            </div>
                            <div className="action flex items-center justify-between flex-wrap gap-5 md:mt-8 mt-5">
                                <div className="right flex items-center gap-3 flex-wrap">
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
                                {/* Previous and Next Event Links */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default EventDetail