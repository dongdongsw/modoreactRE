'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // usePathname 훅 사용
import axios from 'axios';
import TopNavOne from '@/components/Header/TopNav/TopNavOne';
import MenuYoga from '@/components/Header/Menu/MenuYoga';
// import productData from '@/data/Product.json';
import Footer from '@/components/Footer/Footer';
import ShopBreadCrumbImg from "@/app/store/StoreBreadCrumbimg/storebreadcrumbIimg";

export default function Default() {
    const pathname = usePathname(); // 현재 URL 경로 가져오기
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [store, setStore] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 현재 경로에서 store ID 추출
        const fetchStoreData = async () => {
            try {
                const id = pathname.split('/').pop(); // 경로의 마지막 부분이 store ID임
                console.log('Extracted store ID:', id);

                if (id) {
                    // store ID로 데이터 가져오기
                    const storeResponse = await axios.get(`/api/stores/${id}`);
                    setStore(storeResponse.data);
                    setCompanyId(storeResponse.data.companyId); // companyId 상태 설정
                } else {
                    setError('Store ID not found in URL.');
                }
            } catch (error) {
                console.error('Failed to fetch store data:', error);
                setError('Failed to load store data.');
            }
        };

        fetchStoreData();
    }, [pathname]); // pathname이 변경될 때마다 실행

    return (
        <>
            {/* 상단 네비게이션 및 메뉴 구성 */}
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuYoga/>
            </div>

            {/* ShopBreadCrumbImg에 companyId 전달 */}
            {companyId ? (
                <ShopBreadCrumbImg 
                    dataType={store?.type || ''} 
                    companyId={companyId} 
                />
            ) : (
                <p>Loading company data...</p>
            )}

            {/* 에러가 있을 때 표시 */}
            {error && <p>Error: {error}</p>}

            {/* 하단 푸터 */}
            <Footer />
        </>
    );
}
