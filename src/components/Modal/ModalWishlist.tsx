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
    imageUrl?: string;
    foodType: string;
}

const ModalWishlist = () => {
    const { isModalOpen, closeModalWishlist } = useModalWishlistContext();
    const { wishlistState, removeFromWishlist } = useWishlist();

    const [favoriteStores, setFavoriteStores] = useState<FavoriteStore[]>([]);
    const [favoritesError, setFavoritesError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

    const fetchImageUrl = async (companyId: string) => {
        try {
            const response = await axios.get(`/favorites/imageUrl/${companyId}`);
            return response.data; // 이미지 URL 반환
        } catch (error) {
            console.error('Error fetching image URL:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchFavoriteStores = async () => {
            try {
                const response = await axios.get('/favorites/favoriteStores');
                const stores = response.data;

                if (!stores || stores.length === 0) {
                    setIsAuthenticated(false);
                    return;
                }

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
                                <div key={store.companyId} className='item py-5 flex items-center justify-between gap-3 border-b border-line'>
                                    <div className="infor flex items-center gap-5">
                                        <img src={store.imageUrl} alt={store.name} className="w-16 h-16 object-cover rounded-md" />
                                        <div>
                                            <div className="name text-button">{store.name}</div>
                                            <div className="text-sm text-gray-500 mt-1">{store.foodType}</div>
                                        </div>
                                    </div>
                                    <div className="remove-wishlist-btn caption1 font-semibold text-red underline cursor-pointer" onClick={() => handleRemoveFavorite(store.companyId)}>
                                        Remove
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>즐겨찾기 항목이 없습니다.</p>
                        )}
                    </div>
                    <div className="footer-modal p-6 border-t bg-white border-line absolute bottom-0 left-0 w-full text-center">
                        <Link href={'/wishlist'} onClick={closeModalWishlist} className='button-main w-full text-center uppercase'>View All Wish List</Link>
                        <div onClick={closeModalWishlist} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Or continue shopping</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalWishlist;
