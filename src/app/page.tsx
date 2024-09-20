'use client' // 클라이언트 컴포넌트로 지정

import React, {useEffect, useState} from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuYoga from '@/components/Header/Menu/MenuYoga'
import SliderYoga from '@/components/Slider/SliderYoga'
import productData from '@/data/Product.json'
import BestSeller from '@/components/Yoga/BestSeller'
import Banner from '@/components/Yoga/Banner'
import TabFeatures from '@/components/Yoga/TabFeatures'
import WhyChooseUs from '@/components/Yoga/WhyChooseUs'
import FlashSale from '@/components/Yoga/FlashSale'
import dataTestimonial from '@/data/Testimonial.json'
import Testimonial from '@/components/Yoga/Testimonial'
import Instagram from '@/components/Yoga/Instagram'
import Brand from '@/components/Home1/Brand'
import Footer from '@/components/Footer/Footer'
import ModalNewsletter from '@/components/Modal/ModalNewsletter'
import LookBook from '@/components/Cosmetic1/LookBook'
import BannerTop from '@/components/Cosmetic3/BannerTop'
import EventInsightnews from './event/EventInsight/EventInsightnews'
import blogData from '@/data/Blog.json'

export default function HomeYoga() {
    const [eventData, setEventData] = useState([]); // 데이터를 담을 상태
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [error, setError] = useState(null); // 에러 상태 추가

    useEffect(() => {
        // 실제 데이터 fetch 로직 (API 호출 예시)
        fetch('/api/event')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setEventData(data);
                setLoading(false); // 로딩 완료
            })
            .catch(error => {
                setError(error.message);
                setLoading(false); // 에러 발생 시에도 로딩 완료로 처리
                console.error('Error fetching event data:', error);
            });
    }, []);

    // 로딩 중일 때 표시할 내용
    if (loading) {
        return <div>Loading...</div>;
    }

    // 에러 발생 시 표시할 내용
    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <>
            <TopNavOne props="style-one bg-black" slogan='New customers save 10% with the code GET10' />
            <div id="header" className='relative w-full'>
                <MenuYoga />
                <SliderYoga />
                <BannerTop props="bg-[#F4C6A5] md:py-8 py-4" textColor='text-black' bgLine='bg-black' />

            </div>
           <LookBook data={productData} start={8} limit={12} />
           <EventInsightnews data={eventData} start={0} limit={3} />
            <WhyChooseUs />
            <Testimonial data={dataTestimonial} start={0} limit={6} />
            <Brand />
            <Footer />
            <ModalNewsletter />
        </>
    )
}
