'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';

interface FavoritesContextType {
    favorites: Set<string>;
    addFavorite: (companyId: string) => Promise<void>;
    removeFavorite: (companyId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
    children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get<{ companyId: string }[]>('/favorites/favoriteStores');
                const favoriteIds = new Set(response.data.map(store => store.companyId));
                setFavorites(favoriteIds);
                localStorage.setItem('favorites', JSON.stringify(Array.from(favoriteIds)));
            } catch (error) {
                const axiosError = error as AxiosError;
                console.error('Failed to fetch favorites:', axiosError);
            }
        };

        fetchFavorites();
    }, []);

    const addFavorite = async (companyId: string) => {
        try {
            await axios.post('/favorites', [companyId]);
            setFavorites(prevFavorites => {
                const newFavorites = new Set(prevFavorites);
                newFavorites.add(companyId);
                localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
                return newFavorites;
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error adding favorite:', axiosError);
        }
    };

    const removeFavorite = async (companyId: string) => {
        try {
            await axios.delete('/favorites', { params: { companyId } });
            setFavorites(prevFavorites => {
                const newFavorites = new Set(prevFavorites);
                newFavorites.delete(companyId);
                localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
                return newFavorites;
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error removing favorite:', axiosError);
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = (): FavoritesContextType => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
