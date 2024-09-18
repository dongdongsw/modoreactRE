import React from 'react'
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
import NewsInsight from '@/components/Home3/NewsInsight'
import blogData from '@/data/Blog.json'

export default function HomeYoga() {
    return (
        <>
            <TopNavOne props="style-one bg-black" slogan='New customers save 10% with the code GET10' />
            <div id="header" className='relative w-full'>
                <MenuYoga />
                <SliderYoga />
                <BannerTop props="bg-[#F4C6A5] md:py-8 py-4" textColor='text-black' bgLine='bg-black' />

            </div>
           <LookBook data={productData} start={8} limit={12} />
           <NewsInsight data={blogData} start={0} limit={3} />
            <WhyChooseUs />
            <Testimonial data={dataTestimonial} start={0} limit={6} />
            <Brand />
            <Footer />
            <ModalNewsletter />
        </>
    )
}
