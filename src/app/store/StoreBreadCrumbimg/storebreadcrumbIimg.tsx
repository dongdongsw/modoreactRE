'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType } from '@/type/ProductType';
import Product from '../StoreMenuProduct/storemenuproduct';
import HandlePagination from './HandlePagination';
import TestimonialItem from '../Review/page'; // 리뷰 컴포넌트 임포트
import 'rc-slider/assets/index.css';

interface Props {
    data: Array<ProductType>;
    productPerPage: number;
    dataType: string | null;
    companyId: string;
}

const ShopBreadCrumbImg: React.FC<Props> = ({ data, productPerPage, dataType, companyId }) => {
    const [layoutCol, setLayoutCol] = useState<number | null>(4);
    const [currentPage, setCurrentPage] = useState(0);
    const [activeTab, setActiveTab] = useState<string>('menu'); // 탭 상태 관리
    const productsPerPage = productPerPage;
    const offset = currentPage * productsPerPage;

    const handlePageChange = (selected: number) => {
        setCurrentPage(selected);
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setCurrentPage(0); // 탭이 변경될 때 페이지 초기화
    };

    // 메뉴 필터링 로직
    let filteredData = data.filter(product => product.category === 'fashion');

    // 페이지 수 계산
    const pageCount = Math.ceil(filteredData.length / productsPerPage);

    // 현재 페이지의 제품 데이터
    let currentProducts: ProductType[] = filteredData.slice(offset, offset + productsPerPage);

    return (
        <>
            <div className="breadcrumb-block style-img">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container lg:pt-[134px] pt-24 pb-10 relative">
                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center">{dataType === null ? 'Shop' : dataType}</div>
                                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                    <Link href={'/'}>Homepage</Link>
                                    <Icon.CaretRight size={14} className='text-secondary2' />
                                    <div className='text-secondary2 capitalize'>{dataType === null ? 'Shop' : dataType}</div>
                                </div>
                            </div>
                            {/* 탭 메뉴 */}
                            <div className="list-tab flex flex-wrap items-center justify-center gap-y-5 gap-8 lg:mt-[70px] mt-12 overflow-hidden">
                                {['menu', '리뷰', '가게 정보'].map((item, index) => (
                                    <div
                                        key={index}
                                        className={`tab-item text-button-uppercase cursor-pointer has-line-before line-2px ${activeTab === item ? 'active' : ''}`}
                                        onClick={() => handleTabChange(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-img absolute top-2 -right-6 max-lg:bottom-0 max-lg:top-auto w-1/3 max-lg:w-[26%] z-[0] max-sm:w-[45%]">
                            <Image
                                src={'/images/slider/bg1-1.png'}
                                width={1000}
                                height={1000}
                                alt=''
                                className=''
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 탭에 따라 다른 콘텐츠를 표시 */}
            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="list-product-block relative">
                        {/* '메뉴' 탭 */}
                        {activeTab === 'menu' && (
                            <>
                                {/* 메뉴 리스트 */}
                                <div className="list-product sm:gap-[30px] gap-[20px] mt-7">
                                    {currentProducts.length > 0 ? (
                                        <Product data={currentProducts} type='grid' />
                                    ) : (
                                        <p>메뉴가 없습니다.</p>
                                    )}
                                </div>

                                {/* 페이징 기능 */}
                                {pageCount > 1 && (
                                    <div className="list-pagination flex items-center justify-center md:mt-10 mt-7">
                                        <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                                    </div>
                                )}
                            </>
                        )}

                        {/* '리뷰' 탭 */}
                        {activeTab === '리뷰' && (
                            <div className="review-section mt-7">
                                <TestimonialItem companyId={companyId} />
                            </div>
                        )}

                        {/* '가게 정보' 탭 (가게 정보를 나중에 추가할 수 있음) */}
                        {activeTab === '가게 정보' && (
                            <div className="store-info-section mt-7">
                                <p>가게 정보가 여기에 표시됩니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopBreadCrumbImg;
