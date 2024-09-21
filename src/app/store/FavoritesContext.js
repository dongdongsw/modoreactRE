import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(new Set());

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get('/favorites/favoriteStores');
                const favoriteIds = new Set(response.data.map(store => store.companyId));
                setFavorites(favoriteIds);
                localStorage.setItem('favorites', JSON.stringify(Array.from(favoriteIds)));
            } catch (error) {
                console.error('즐겨찾기 목록을 가져오는 데 실패했습니다.', error);
            }
        };

        fetchFavorites();
    }, []);

    const addFavorite = async (companyId) => {
        try {
            await axios.post('/favorites', [companyId]);
            setFavorites(prevFavorites => {
                const newFavorites = new Set(prevFavorites);
                newFavorites.add(companyId);
                localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
                return newFavorites;
            });
        } catch (error) {
            console.error('Error adding favorite:', error);
        }
    };


    const removeFavorite = async (companyId) => {
        try {
            await axios.delete('/favorites', { params: { companyId } });

            setFavorites(prevFavorites => {
                const newFavorites = new Set(prevFavorites);
                newFavorites.delete(companyId);
                localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
                return newFavorites;
            });
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
