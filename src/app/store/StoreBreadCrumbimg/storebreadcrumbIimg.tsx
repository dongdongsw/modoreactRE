'use client';

import React, {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Product from '../StoreMenuProduct/storemenuproduct';
import TestimonialItem from '../Review/page'; // 리뷰 컴포넌트 임포트
import 'rc-slider/assets/index.css';
import StoreInfo from '../Info/Information'; // StoreInfo 컴포넌트 임포트
import { useFavorites } from '@/app/shop/square/FavoritesContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from "axios";

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
interface CommentType {
    id: string;
    author: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
}

interface ReviewType {
    companyId: string;
    storeId: number;
    id: string;
    star: number;
    title: string;
    content: string;
    author: string;
    createdDateTime: string;
    updatedDateTime?: string;
    comments: CommentType[];
    imageUrl: string;
    name: string;
}
interface Props {
    dataType: string | null;
    companyId: string;
    store: StoreType | null; // store prop 추가
}
type ReviewSummary = {
    [key: string]: string; // storeId를 키로 하고 요약을 값으로 가지는 객체
};
const ShopBreadCrumbImg: React.FC<Props> = ({ dataType, companyId, store }) => {
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const isLiked = favorites.has(companyId);
    const [activeTab, setActiveTab] = useState<string>('menu'); // 탭 상태 관리
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<ReviewSummary>({}); // 초기값을 빈 객체로 설정
    const prevCompanyIdRef = useRef<string | null>(null);

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
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                if (!companyId) {
                    setError('유효하지 않은 companyId입니다.');
                    return;
                }

                const reviewsResponse = await axios.get(`/api/review/listByCompany/${companyId}`);
                if (reviewsResponse.data && reviewsResponse.data.length > 0) {
                    const sortedReviews = reviewsResponse.data.sort(
                        (a: any, b: any) => new Date(b.createdDateTime).getTime() - new Date(a.createdDateTime).getTime()
                    );

                    const reviewsWithComments = await Promise.all(
                        sortedReviews.map(async (review: ReviewType) => {
                            const commentsResponse = await axios.get(`/api/review/${review.id}/comments`);
                            return { ...review, comments: commentsResponse.data };
                        })
                    );

                    setReviews(reviewsWithComments);
                } else {
                    setReviews([]);
                }
            } catch (error) {
                console.error('리뷰 데이터를 불러오는 데 실패했습니다.', error);
                setError('리뷰를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (companyId && companyId !== prevCompanyIdRef.current) {
            fetchReviews();
            prevCompanyIdRef.current = companyId;
        }
    }, [companyId]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                if (!companyId) {
                    setError('유효하지 않은 companyId입니다.');
                    return;
                }

                const reviewsResponse = await axios.get(`/api/review/listByCompany/${companyId}`);
                if (reviewsResponse.data && reviewsResponse.data.length > 0) {
                    const sortedReviews = reviewsResponse.data.sort(
                        (a: any, b: any) => new Date(b.createdDateTime).getTime() - new Date(a.createdDateTime).getTime()
                    );

                    const reviewsWithComments = await Promise.all(
                        sortedReviews.map(async (review: ReviewType) => {
                            const commentsResponse = await axios.get(`/api/review/${review.id}/comments`);
                            return { ...review, comments: commentsResponse.data };
                        })
                    );

                    setReviews(reviewsWithComments);
                } else {
                    setReviews([]);
                }
            } catch (error) {
                console.error('리뷰 데이터를 불러오는 데 실패했습니다.', error);
                setError('리뷰를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (companyId && companyId !== prevCompanyIdRef.current) {
            fetchReviews();
            prevCompanyIdRef.current = companyId;
        }
    }, [companyId]);

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true); // 요약을 가져오는 동안 로딩 중으로 설정
            const storeReviews: { [key: string]: string[] } = {};

            // 리뷰를 가게별로 그룹화
            reviews.forEach((review) => {
                const storeId = review.companyId;
                if (!storeReviews[storeId]) {
                    storeReviews[storeId] = [];
                }
                storeReviews[storeId].push(review.content);
            });

            // 각 가게에 대해 요약 요청
            for (const [storeId, reviewList] of Object.entries(storeReviews)) {
                if (reviewList.length >= 10) {
                    try {
                        console.log(`가게 ${storeId}의 ${reviewList.length}개의 리뷰를 전송합니다.`);
                        const summaryResponse = await axios.post('/api/v1/chat-gpt/summarize', {
                            reviews: reviewList,
                            storeId: storeId,
                        });
                        console.log(`가게 ${storeId}의 서버 응답:`, summaryResponse);

                        setSummary((prevSummary) => ({
                            ...(prevSummary || {}),
                            [storeId]: summaryResponse.data.answer,
                        }));
                    } catch (error) {
                        console.error(`가게 ${storeId}의 요약을 가져오는 데 실패했습니다.`, error);
                    }
                }
            }

            setLoading(false);
        };

        const intervalId = setInterval(() => {
            fetchSummary();
        }, 60000); // 1분마다 호출

        fetchSummary();

        return () => clearInterval(intervalId);
    }, [reviews]);


    if (error) {
        return <p className="error-message text-red-500">{error}</p>;
    }
    return (
        <>
            <div className="breadcrumb-block style-img">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container lg:pt-[134px] pt-24 pb-7 relative">
                        {/* 요약 리뷰 출력 */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '1rem' }}>
                            {loading ? (
                                <p>요약을 생성 중입니다...</p>
                            ) : (
                                <div>
                                    {Object.keys(summary).length === 0 ? (
                                        <p>요약을 진행할만큼 충분한 리뷰가 작성되지 않았습니다.</p>
                                    ) : (
                                        Object.entries(summary).map(([storeId, summaryText]) => (
                                            <div key={storeId}>
                                                <h3>AI가 분석한 키워드</h3>
                                                <div>
                                                    {(typeof summaryText === 'string' ? summaryText.split(',') : []).map((text, index) => (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                backgroundColor: 'white',
                                                                borderRadius: '15px',
                                                                padding: '8px 12px',
                                                                margin: '5px 0', // 위아래 간격만 추가
                                                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                            }}
                                                        >
                                                            {text.trim()}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                            )}
                        </div>

                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center">{dataType === null ? 'Shop' : dataType}</div>
                                <div className="heading3 text-center" style={{ fontFamily: 'DalseoDarling' }}>
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
                                alt={store ? store.name : 'default image'}
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
