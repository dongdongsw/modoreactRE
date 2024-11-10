'use client';

import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ReviewData {
    id: number;
    author: string;
    content: string;
    externalId: string;
    merchantUid: string;
    imageUrl: string | null;
    createdDateTime: string;
    updatedDateTime: string;
    companyId: string;
    name: string;
}

const RealReview: React.FC = () => {
    const [data, setData] = useState<ReviewData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const limit = 5; // Output number of reviews
    const router = useRouter(); // Initialize useRouter hook

    const fetchData = async () => {
        try {
            const response = await fetch('/api/review/latest');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const truncateText = (text: string, length: number) => {
        if (text.length <= length) {
            return text;
        }
        return `${text.slice(0, length)}...`;
    };

    const goToStore = async (companyId: string) => {
        try {
            const response = await fetch(`/api/stores/${companyId}/id`);
            if (!response.ok) {
                throw new Error('Store ID not found');
            }
            const storeId = await response.json();
            router.push(`/store/${storeId}`);
        } catch (error) {
            console.error('Error fetching store ID:', error);
        }
    };

    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        centerMode: true,
        centerPadding: '220px',
        speed: 300,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 3,
        slidesToScroll: 3,
        touchThreshold: 100,
        swipe: true,
        swipeToSlide: true,
        draggable: true,
        useTransform: false,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    centerPadding: '120px',
                }
            },
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    centerPadding: '160px',
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '160px',
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '16px',
                }
            },
        ]
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="testimonial-block yoga bg-surface md:pt-20 md:pb-32 pt-12 pb-24">
            <div className="container">
                <div className="heading">
                    <div className="heading4 text-center">생생 후기</div>
                    <div className="body1 text-center text-secondary mt-3">고객님들이 직접 전해주는 진짜 경험</div>
                </div>
            </div>
            <div className="list-testimonial yoga md:mt-10 dots-mt40 mt-6">
                <Slider {...settings}>
                    {data.slice(0, limit).map((review) => (
                        <div
                            className="item yoga h-full"
                            key={review.id}
                            onClick={() => goToStore(review.companyId)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="main bg-white py-7 px-8 rounded-[20px] h-full flex">
                                {review.imageUrl && (
                                    <div className="bg-img flex-none flex flex-col items-center mr-4">
                                        <Image
                                            src={review.imageUrl}
                                            width={112}
                                            height={112}
                                            alt="Review Image"
                                            className='w-[112px] h-[112px] object-cover rounded-xl'
                                        />
                                        <div className="author text-title mt-2" style={{ color: 'gray' }}>
                                            {review.author || "Unknown Author"}
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="content-text font-bold mb-2">
                                        {truncateText(review.name, 20)}
                                    </div>
                                    <div className="content-text">{truncateText(review.content, 30)}</div>
                                    {!review.imageUrl && (
                                        <div className="author text-title mt-2" style={{ color: 'gray' }}>
                                            {review.author || "Unknown Author"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.length < limit && Array.from({ length: limit - data.length }).map((_, index) => (
                        <div className="item yoga h-full" key={`placeholder-${index}`}>
                            <div className="main bg-gray-200 py-7 px-8 rounded-[20px] h-full flex">
                                <div className="flex-1">
                                    <div className="content-text">No review available.</div>
                                    <div className="author text-title mt-2">Anonymous</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default RealReview;
