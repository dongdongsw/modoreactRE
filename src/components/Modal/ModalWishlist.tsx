'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { useWishlist } from '@/context/WishlistContext';
import axios from 'axios';

interface FavoriteStore {
    companyId: string;
    name: string;
    id: string; // store의 id 값을 저장할 필드 추가

    imageUrl?: string;
    foodType: string;
}

const ModalWishlist = () => {
    const { isModalOpen, closeModalWishlist } = useModalWishlistContext();
    const { wishlistState, removeFromWishlist } = useWishlist();

    const [favoriteStores, setFavoriteStores] = useState<FavoriteStore[]>([]);
    const [favoritesError, setFavoritesError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const [nickname, setNickname] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null); // 마우스가 올라간 항목의 ID 저장


    // Store ID를 조회하는 함수
    const fetchStoreIdByCompanyId = async (companyId: string) => {
    try {
        const response = await axios.get(`/api/stores/${companyId}/id`);
        return response.data; // store의 id 값 반환
    } catch (error) {
        console.error(`Error fetching store ID for companyId ${companyId}:`, error);
        return null;
    }
};

    const fetchImageUrl = async (companyId: string) => {
        try {
            const response = await axios.get(`/favorites/imageUrl/${companyId}`);
            return response.data; // 이미지 URL 반환
        } catch (error) {
            console.error('Error fetching image URL:', error);
            return null;
        }
    };

    const fetchUserData = async () => {
        try {
            const externalIdResponse = await axios.get('/login/user/externalId');

            if (externalIdResponse.status === 200 && externalIdResponse.data) {
                setNickname(externalIdResponse.data);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        fetchUserData();

        const fetchFavoriteStores = async () => {
            try {
                const response = await axios.get('/favorites/favoriteStores');
                const stores = response.data;

                const storesWithImages = await Promise.all(stores.map(async (store: FavoriteStore) => {
                    const imageUrl = await fetchImageUrl(store.companyId);
                    return { ...store, imageUrl };
                }));
                setFavoriteStores(storesWithImages);
            } catch (error) {
                if (error instanceof Error) {
                    setFavoritesError('즐겨찾기 항목을 불러오는 데 실패했습니다.');
                } else {
                    setFavoritesError('알 수 없는 오류가 발생했습니다.');
                }
                console.error('즐겨찾기 항목 불러오기 오류:', error);
            }
        };

        fetchFavoriteStores();
    }, []);

    const handleRemoveFavorite = async (companyId: string) => {
        try {
            const response = await fetch(`/favorites?companyId=${companyId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedStoresResponse = await fetch('/favorites/favoriteStores');
                if (updatedStoresResponse.ok) {
                    const updatedStores = await updatedStoresResponse.json();

                    const storesWithImages = await Promise.all(updatedStores.map(async (store: FavoriteStore) => {
                        const imageUrl = await fetchImageUrl(store.companyId);
                        return { ...store, imageUrl };
                    }));

                    console.log('Updated favorite stores after removal:', storesWithImages);
                    setFavoriteStores(storesWithImages);

                    const updatedFavorites = new Set(updatedStores.map((store: FavoriteStore) => store.companyId));
                    localStorage.setItem('favorites', JSON.stringify(Array.from(updatedFavorites)));

                    alert('좋아요가 성공적으로 삭제되었습니다.');
                } else {
                    alert('좋아요 삭제 후 목록 갱신 중 오류가 발생했습니다.');
                    console.error('Error fetching updated favorite stores:', await updatedStoresResponse.json());
                }
            } else {
                const errorData = await response.json();
                alert('좋아요 삭제 중 오류가 발생했습니다.');
                console.error('Error removing favorite:', errorData);
            }
        } catch (error) {
            alert('좋아요 삭제 중 오류가 발생했습니다.');
            console.error('Error removing favorite:', error);
        }
    };

    return (
        <>
            <div className={`modal-wishlist-block`} onClick={closeModalWishlist}>
                <div
                    className={`modal-wishlist-main py-6 ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation(); }}
                >
                    <div className="heading px-6 pb-3 flex items-center justify-between relative">
                        <div className="heading5">가게 즐겨찾기</div>
                        <div
                            className="close-btn absolute right-6 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                            onClick={closeModalWishlist}
                        >
                            <Icon.X size={14} />
                        </div>
                    </div>
                    <div className="list-product px-6">
                        {favoritesError && <p>Error: {favoritesError}</p>}
                        {!isAuthenticated ? (
                            <p>로그인 후 진행해주세요.</p>
                        ) : favoriteStores.length > 0 ? (
                            favoriteStores.map((store) => (
                                <Link href={`/store/${store.id}`} key={store.companyId}> {/* storeId를 사용하여 동적 경로 설정 */}

                                <div key={store.companyId} className='item py-5 mb-3 flex items-center justify-between gap-3 border-b border-line cursor-pointer' 
                                style={{
                                    border:'1px solid #ccc', 
                                    boxShadow:'2px 2px 2px 2px #ccc', 
                                    borderRadius:'15px',
                                    backgroundColor: hoveredItem === store.companyId ? '#f0f0f0' : 'white', // 상태에 따라 색상 변경
                                    }}
                                    onMouseEnter={() => setHoveredItem(store.companyId)} // 마우스가 올라간 경우
                                        onMouseLeave={() => setHoveredItem(null)} // 마우스가 떠난 경우
                                        >
                                    <div className="infor flex items-center gap-5" >
                                        <img src={store.imageUrl} alt={store.name} className="w-16 h-16 object-cover rounded-md ml-3"  />
                                        <div >
                                            <div className="name text-button">{store.name}</div>
                                            <div className="text-sm text-gray-500 mt-1">{store.foodType}</div>
                                        </div>
                                    </div>
                                    {/* <div className="remove-wishlist-btn caption1 font-semibold text-red underline cursor-pointer mr-3" onClick={() => handleRemoveFavorite(store.companyId)}>
                                        Remove
                                    </div> */}
                                    <div
                                        className="text-xl bg-white w-10 h-10 rounded-xl flex mr-5 items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                        onClick={(e) => {
                                            handleRemoveFavorite(store.companyId)
                                        }}
                                    >
                                        <Icon.Trash />
                                    </div>
                                </div>
                                </Link>
                            ))
                        ) : (
                            <p>즐겨찾기한 가게가 없습니다.</p>
                        )}
                    </div>
                    <div className="footer-modal p-6 border-t bg-white border-line absolute bottom-0 left-0 w-full text-center">
                        <Link href={'/shop'} onClick={closeModalWishlist} className='button-main w-full text-center uppercase'>스토어 리스트로 이동</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalWishlist;
