'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Product from '../StoreMenuProduct/storemenuproduct';
import TestimonialItem from '../Review/page'; // 리뷰 컴포넌트 임포트
import 'rc-slider/assets/index.css';
import StoreInfo from '../Info/Information'; // StoreInfo 컴포넌트 임포트
import { useFavorites } from '@/app/shop/square/FavoritesContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface StoreType {
    name: string;
    address: string;
    phoneNumber: string;
    foodType: string;
    imageUrl: string;
    description: string;
    type: string;
    companyId: string;
}

interface Props {
    dataType: string | null;
    companyId: string;
    store: StoreType | null; // store prop 추가
}

const ShopBreadCrumbImg: React.FC<Props> = ({ dataType, companyId, store }) => {
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const isLiked = favorites.has(companyId);
    const [activeTab, setActiveTab] = useState<string>('menu'); // 탭 상태 관리
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };
    const handleLikeToggle = async () => {
        if (isLiked) {
            await removeFavorite(companyId);
        } else {
            await addFavorite(companyId);
        }
    };

    return (
        <>
            <div className="breadcrumb-block style-img">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container lg:pt-[134px] pt-24 pb-7 relative">
                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center">{dataType === null ? 'Shop' : dataType}</div>
                                <div className="heading3 text-center" style={{fontFamily : 'DalseoDarling'}}>
                                    {store?.name}
                                </div>
                                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                    <Link href={'/'}>Homepage</Link>
                                    <Icon.CaretRight size={14} className='text-secondary2' />
                                    <div className='text-secondary2 capitalize'>{store?.name}</div>
                                </div>
                            </div>
                            {/* 좋아요 버튼 */}
                            <div className="like-button mt-4 flex justify-center">
                                <button onClick={handleLikeToggle} className="flex items-center gap-2">
                                    <div className="bg-white rounded-full p-2 flex justify-center items-center">
                                        {isLiked ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
                                    </div>
                                    <span className="text-secondary2 capitalize">
            {isLiked ? '즐겨찾기 취소' : '즐겨찾기에 추가'}
        </span>
                                </button>
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
                        <div className="bg-img absolute top-0 -right-6 max-lg:bottom-0 max-lg:top-auto w-1/4 max-lg:w-[26%] z-[0] max-sm:w-[45%]">
                            <Image
                                src={store?.imageUrl || '이미지 준비 중입니다'}
                                width={1000}
                                height={1000}
                                alt={store ? store.name : 'default image'} // alt 속성도 동적으로 설정
                                className=""
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
                            <div className="list-product sm:gap-[30px] gap-[20px] mt-7">
                                <Product type='grid' />
                            </div>
                        )}
                        {/* '리뷰' 탭 */}
                        {activeTab === '리뷰' && (
                            <div className="review-section mt-7">
                                <TestimonialItem companyId={companyId} />
                            </div>
                        )}
                        {activeTab === '가게 정보' && (
                            <div className="store-info-section" style={{ display: 'flex', justifyContent: 'center' }}>
                                {store ? (
                                    <StoreInfo store={store} />
                                ) : (
                                    <p>가게 정보를 불러오는 중입니다...</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopBreadCrumbImg;
