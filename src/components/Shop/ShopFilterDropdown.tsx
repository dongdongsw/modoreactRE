'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import axios, { AxiosError } from "axios";
import { useFavorites } from "@/app/shop/square/FavoritesContext";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface Store {
    companyId: string;
    name: string;
    foodType: string;
    imageUrl: string;
    isFavorited?: boolean;
    id:string;
}

const ShopFilterDropdown: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedFilter, setSelectedFilter] = useState<string>('All');
    const [layoutCol, setLayoutCol] = useState<number>(5);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);

    const { favorites, addFavorite, removeFavorite } = useFavorites();

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = layoutCol * 2; // Calculate items per page

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axios.get<Store[]>('/api/stores');
                setStores(response.data);
            } catch (error) {
                const axiosError = error as AxiosError;
                console.error('There was an error fetching the stores!', axiosError);
            }
        };

        const fetchFavorites = async () => {
            if (!isLoggedIn) return;

            try {
                const response = await axios.get<{ companyId: string }[]>('/favorites/favoriteStores');
                const favoriteIds = new Set(response.data.map(store => store.companyId));

                const storesResponse = await axios.get<Store[]>('/api/stores');
                setStores(storesResponse.data.map(store => ({
                    ...store,
                    isFavorited: favoriteIds.has(store.companyId)
                })));
            } catch (error) {
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 401) {
                    console.warn('Unauthorized access. Clearing favorites.');
                    setIsLoggedIn(false);
                }
                console.error('There was an error fetching the favorites!', axiosError);
            }
        };

        fetchFavorites();
    }, [isLoggedIn]);

    const handleSearch = () => {
        setSearchQuery(searchTerm);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleFilterChange = (filter: string) => {
        setSelectedFilter(filter);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleLayoutCol = (col: number) => {
        setLayoutCol(col);
        setCurrentPage(1); // Reset to first page on layout change
    };

    const toggleFavorite = (companyId: string) => {
        if (favorites.has(companyId)) {
            removeFavorite(companyId);
            setStores(prevStores => prevStores.map(store =>
                store.companyId === companyId ? { ...store, isFavorited: false } : store
            ));
        } else {
            addFavorite(companyId);
            setStores(prevStores => prevStores.map(store =>
                store.companyId === companyId ? { ...store, isFavorited: true } : store
            ));
        }
    };

    const filteredStores = stores.filter(store => {
        const matchesName = store.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedFilter === 'All' || store.foodType === selectedFilter;
        return matchesName && matchesType;
    });

    // Pagination logic
    const indexOfLastStore = currentPage * itemsPerPage;
    const indexOfFirstStore = indexOfLastStore - itemsPerPage;
    const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);
    const totalPages = Math.ceil(filteredStores.length / itemsPerPage);

    return (
        <>
            <div className="breadcrumb-block style-img">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container lg:pt-[134px] pt-24 pb-10 relative">
                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center">Shop</div>
                                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                    <Link href={'/'}>Homepage</Link>
                                    <Icon.CaretRight size={14} className='text-secondary2' />
                                    <div className='text-secondary2 capitalize'>Shop</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="flex flex-col items-center mb-5">
                        <div className="input-block lg:w-1/2 sm:w-3/5 w-full flex items-center">
                            <div className='relative w-full'>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="caption1 w-full h-[44px] pl-4 pr-14 rounded-xl border border-line"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button
                                    className="store-button-register button-main absolute top-1 bottom-1 right-1 flex items-center justify-center"
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                            <button
                                className="button-main h-[44px] inline-flex items-center justify-center ml-2 whitespace-nowrap"
                                style={{
                                    padding: '0 8px',
                                    backgroundColor: 'transparent',
                                    color: 'inherit',
                                    border: 'none',
                                }}
                                onClick={() => {
                                    setSearchTerm('');
                                    setSearchQuery('');
                                    setCurrentPage(1);
                                }}
                            >
                                초기화
                            </button>


                        </div>

                        <div className="filter-heading flex items-center justify-between mt-4 w-full">
                            <div className="filter-buttons flex flex-wrap gap-3 justify-center flex-grow">
                                {['All', '한식', '중식', '일식', '양식'].map((filter) => (
                                    <span
                                        key={filter}
                                        className={`tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold ${
                                            filter === '한식' ? 'bg-yellow text-yellow' :
                                                filter === '중식' ? 'bg-purple text-purple' :
                                                    filter === '양식' ? 'bg-success text-success' :
                                                        filter === '일식' ? 'bg-red text-red' : 'bg-gray-200 text-gray-600'
                                        } ${selectedFilter === filter ? 'bg-opacity-30' : ''}`}
                                        onClick={() => handleFilterChange(filter)}
                                        style={{ cursor: 'pointer' }}
                                    >
                            {filter}
                        </span>
                                ))}
                            </div>
                            {/* Layout Selection on the Right */}
                            <div className="choose-layout flex items-center gap-2">
                                {[3, 4, 5].map(col => (
                                    <div
                                        key={col}
                                        className={`item ${col}-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === col ? 'active' : ''}`}
                                        onClick={() => handleLayoutCol(col)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className='flex items-center gap-0.5'>
                                            {[...Array(col)].map((_, i) => (
                                                <span key={i} className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Store List */}
                    <div className="list-product-block relative">
                        <div className={`list-product hide-product-sold grid lg:grid-cols-${layoutCol} sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-7`}>
                            {currentStores.length ? (
                                currentStores.map(store => (
                                    <Link href={`/store/${store.id}`} key={store.id} className="product-main cursor-pointer block">
                                        <div className="relative overflow-hidden rounded-2xl bg-white">
                                            <div
                                                className="product-img w-full overflow-hidden relative group"
                                                onMouseEnter={() => setHoveredImage(store.companyId)}
                                                onMouseLeave={() => setHoveredImage(null)}
                                            >
                                                <div className="image-wrapper" style={{
                                                    borderRadius: '16px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <img
                                                        alt={store.name}
                                                        className="w-full object-cover"
                                                        src={store.imageUrl}
                                                        style={{
                                                            width: '100%',
                                                            aspectRatio: '1',
                                                            maxWidth: '500px',
                                                            height: 'auto',
                                                            transform: hoveredImage === store.companyId ? 'scale(1.05)' : 'scale(1)',
                                                            transition: 'transform 0.2s ease'
                                                        }}
                                                    />
                                                </div>
                                                <div className="list-action-right absolute top-2 right-2 z-[2] invisible group-hover:visible">
                                                    <div className="add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-200">
                                                        <div
                                                            className="w-[16px] h-[16px] flex items-center justify-center cursor-pointer"
                                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(store.companyId); }} // Prevent click from propagating to the Link
                                                        >
                                                            {store.isFavorited ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="product-info py-4 px-5">
                                                <div className="product-title text-body4 font-semibold text-main">
                                                    {store.name} {/* Remove Link from here */}
                                                </div>
                                                <div className="product-category mt-1 text-body5 text-secondary2">
                                                    {store.foodType}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className='text-center col-span-full mt-4'>No stores found.</div>
                            )}
                        </div>
                    </div>



                    {/* Pagination Controls */}
                    {filteredStores.length > itemsPerPage && (
                        <div className="pagination flex items-center justify-center mt-4">
                            {/* Previous Page Button */}
                            {currentPage > 1 && (
                                <a
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Previous page"
                                    className="mx-1 px-4 py-2 rounded border border-gray-300 text-gray-600 bg-transparent hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    {'<'}
                                </a>
                            )}

                            {/* Page Number Buttons */}
                            {Array.from({ length: totalPages }, (_, i) => (
                                <a
                                    key={i + 1}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Page ${i + 1} ${currentPage === i + 1 ? 'is your current page' : ''}`}
                                    aria-current={currentPage === i + 1 ? 'page' : undefined}
                                    className={`mx-1 px-4 py-2 rounded border ${currentPage === i + 1 ? 'bg-black text-white border-black' : 'bg-transparent text-black border-gray-300'} transition-colors duration-300 cursor-pointer`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </a>
                            ))}

                            {/* Next Page Button */}
                            {currentPage < totalPages && (
                                <a
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Next page"
                                    className="mx-1 px-4 py-2 rounded border border-gray-300 text-gray-600 bg-transparent hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    {'>'}
                                </a>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default ShopFilterDropdown;
