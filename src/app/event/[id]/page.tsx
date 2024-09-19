'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
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
    subImg: string[];
}

const EventDetail = () => {
    const pathname  = usePathname(); // useRouter로 라우팅 정보 가져오기
    const router = useRouter(); // Initialize useRouter for navigation

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
    }, [id]);

    const handleDelete = () => {
        axios.delete(`/api/event/${id}`)
            .then(() => {
                router.push('/Main/Event'); // 페이지 이동
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
                <MenuOne props="bg-white" />
            </div>
            <div className='blog detail1'>
                <div className="bg-img md:mt-[74px] mt-14">
                    <Image
                        src={event.imagePath}
                        width={5000}
                        height={4000}
                        alt={event.imagePath}
                        className='w-full min-[1600px]:h-[800px] xl:h-[640px] lg:h-[520px] sm:h-[380px] h-[260px] object-cover'
                    />
                </div>
                <div className="container md:pt-20 pt-10">
                    <div className="blog-content flex items-center justify-center">
                        <div className="main md:w-5/6 w-full">
                            <div className="heading3 mt-3">{event.title}</div>
                            <div className="author flex items-center gap-4 mt-4">
                                <div className="avatar w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                    <Image
                                        src={event.imagePath}
                                        width={200}
                                        height={200}
                                        alt='avatar'
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className="caption1 text-secondary">by {event.author}</div>
                                    <div className="line w-5 h-px bg-secondary"></div>
                                    <div className="caption1 text-secondary">{event.date}</div>
                                </div>
                            </div>
                            <div className="content md:mt-8 mt-5">
                                <div className="body1">{event.content}</div>
                                <div className="body1 mt-3">
                                    I’ve always been passionate about underwear and shapewear and have a huge collection from over the years! When it came to shapewear, I could never find exactly what I was looking for and I would cut up pieces and sew them together to create the style and compression I needed.
                                </div>
                                <div className="grid sm:grid-cols-2 gap-[30px] md:mt-8 mt-5">
                                        {event.subImg && event.subImg.length > 0 ? (
                                            event.subImg.map((item, index) => (
                                                <Image
                                                    key={index}
                                                    src={item}
                                                    width={3000}
                                                    height={2000}
                                                    alt={item}
                                                    className='w-full rounded-3xl'
                                                />
                                            ))
                                        ) : (
                                            <div>No images available.</div> // Fallback if no images are available
                                        )}
                                    </div>

                                <div className="heading4 md:mt-8 mt-5">How did SKIMS start?</div>
                                <div className="body1 mt-4">
                                    This is such a hard question! Honestly, every time we drop a new collection I get obsessed with it.
                                </div>
                                <div className="body1 mt-4">
                                    For bras, I love our Cotton Jersey Scoop Bralette – it’s lined with this amazing power mesh so you get great support and is so comfy I can sleep in it.
                                </div>
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