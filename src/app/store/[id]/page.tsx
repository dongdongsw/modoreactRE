'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
//상단 임포트 import StoreBreadcrumbImg from '@/app/store/StoreBreadCrumbImg/storebreadcrumbImg'; 이걸로 하면 더미데이터 출력
import productData from '@/data/Product.json'
import Footer from '@/components/Footer/Footer'
import ShopBreadCrumbImg from "@/app/store/StoreBreadCrumbImg/storebreadcrumbIimg";

export default function Default() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            <ShopBreadCrumbImg data={productData} productPerPage={12} dataType={type} />
            <Footer />
        </>
    )
}
