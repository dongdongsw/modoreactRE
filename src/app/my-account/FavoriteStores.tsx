import React, { useEffect, useState } from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import axios from 'axios';

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
}

interface FavoriteStore {
    companyId: string;
    name: string;
    imageUrl: string;
    foodType: string;
}

const FavoriteStores: React.FC<TabButtonProps> = ({ isActive, onClick }) => {
    return (
        <div
            className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <Icon.Tag size={20} />
            <strong className="heading6">즐겨찾기</strong>
        </div>
    );
};

const FavoriteStoresContent: React.FC = () => {
    const [favoriteStores, setFavoriteStores] = useState<FavoriteStore[]>([]);
    const [favoritesError, setFavoritesError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavoriteStores = async () => {
            try {
                const response = await axios.get('/favorites/favoriteStores');
                setFavoriteStores(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    setFavoritesError('즐겨찾기 항목을 불러오는 데 실패했습니다.');
                } else {
                    setFavoritesError('알 수 없는 오류가 발생했습니다.');
                }
                console.error('즐겨찾기 항목 불러오기 오류:', error);
            }
            console.log('Fetching complete');
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
                    setFavoriteStores(updatedStores);

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
        <div className="favorites-content p-7 border border-line rounded-xl">
            <h5 className="heading5 mb-4">가게 즐겨찾기</h5>
            {favoritesError && <p className="error-text">Error: {favoritesError}</p>}
            {favoriteStores.length > 0 ? (
                <ul className="favorites-list">
                    {favoriteStores.map((store: FavoriteStore) => (
                        <li key={store.companyId} className="favorite-item py-5 flex items-center gap-4 border-b border-line">
                            <img src={store.imageUrl || '이미지 준비 중 입니다.'} 
                            alt={store.name} 
                            className="store-image w-16 h-16 object-cover rounded-lg" 
                            />
                            <div className="flex-1">
                                <div className="store-name text-button">{store.name}</div>
                                <div className="food-type text-sm text-gray-500 mt-1">{store.foodType}</div>
                            </div>
                            <div
                                className="remove-button text-xl bg-white w-10 h-10 rounded-xl border border-black flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleRemoveFavorite(store.companyId);
                                }}
                            >
                                <Icon.Trash />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-favorites-text">즐겨찾기 항목이 없습니다.</p>
            )}
        </div>
    );
};

export default FavoriteStores;
export { FavoriteStoresContent };
