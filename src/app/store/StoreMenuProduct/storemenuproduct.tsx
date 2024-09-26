'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductType } from '@/type/ProductType';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import axios from 'axios';
import { Item } from '../storeItemtype';
import { ShoppingBag } from "@phosphor-icons/react"; // 쇼핑백 아이콘 가져오기

interface Store {
    id: string;
    name: string;
    price: number;
    companyId: string;
    imageUrl: string;
}

interface ProductProps {
    data: ProductType;
    type: string;
}

declare global {
    interface Window {
        IMP?: any;
    }
}
const Product: React.FC<ProductProps> = ({ data, type }) => {
    const [quantity, setQuantity] = useState<{ [key: string]: number }>({});
    const [store, setStore] = useState<Store | null>(null);
    const [menu, setMenu] = useState<Item[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [iamportLoaded, setIamportLoaded] = useState(false);

    //const { addToCart, openModalCart } = useCart();
    const { addToWishlist, wishlistState } = useWishlist();

    const fetchStoreData = async (id: string) => {
        try {
            const storeResponse = await axios.get(`/api/stores/${id}`);
            setStore(storeResponse.data);
            const companyId = storeResponse.data.companyId;

            const menuResponse = await axios.get(`/api/stores/${companyId}/menu`);
            setMenu(menuResponse.data);
        } catch (error) {
            console.error('데이터를 불러오는 데 실패했습니다.', error);
            setError('데이터를 불러오는 데 실패했습니다.');
        }
    };

    useEffect(() => {
        const id = window.location.pathname.split('/').pop();
        if (id) fetchStoreData(id);
    }, []);

    const handleQuantityChange = (itemId: string, value: number) => {
        setQuantity(prev => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) + value, 0),
        }));
    };

    useEffect(() => {
        const id = window.location.pathname.split('/').pop();
        if (id) fetchStoreData(id);

        // Load Iamport script only when in the client
        const script = document.createElement('script');
        script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
        script.async = true;

        script.onload = () => {
            if (window.IMP) {
                setIamportLoaded(true);
            } else {
                console.error('IMP 객체를 로드하는 데 실패했습니다.');
                setError('결제 모듈을 로드하는 데 실패했습니다.');
            }
        };

        script.onerror = () => {
            console.error('IAMPORT 스크립트를 로드하는 데 실패했습니다.');
            setError('결제 모듈을 로드하는 데 실패했습니다.');
        };

        document.body.appendChild(script);

        // Cleanup script on unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);  // Empty dependency array so it runs only once after the component mounts

    /*
    const handleAddToCart = (item: Item) => {
        const currentQuantity = quantity[item.id] || 0;
        if (currentQuantity > 0) {
            addToCart({ ...item, quantity: currentQuantity });
            openModalCart();
        }
    };
    */

    const handleMenuClick = (item: Item) => {
        console.log(item); // 메뉴 클릭 시 아이템 정보 콘솔에 출력
    };

    return (
        <>
            {type === "grid" ? (
                <div className="product-item grid-type" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {menu.length > 0 ? (
                        menu.map(item => (
                            <div
                                key={item.id}
                                className="product-main cursor-pointer block"
                                style={{ flex: '0 1 calc(20% - 20px)', display: 'flex', flexDirection: 'column' }}
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                                onClick={() => handleMenuClick(item)} // 클릭 이벤트 추가
                            >
                                <div className="product-thumb bg-white relative overflow-hidden rounded-2xl flex-grow">
                                    <div className="list-action-right absolute top-3 right-3 max-lg:hidden">
                                        {hoveredItem === item.id && (
                                            <div className="add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative"
                                                 onClick={(e) => {
                                                     e.stopPropagation();
                                                     //handleAddToCart(item);
                                                 }}
                                            >
                                                <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">Add To Cart</div>
                                                <ShoppingBag size={18} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-img w-full h-full flex items-center justify-center">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-cover duration-700"
                                            fetchPriority="high"
                                        />
                                    </div>
                                </div>
                                <div className="product-infor mt-4 lg:mb-7">
                                    <div className="product-name text-title duration-300">{item.name}</div>
                                    <div className="product-price text-title duration-300">{item.price}원</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>메뉴가 없습니다.</p>
                    )}
                </div>
            ) : (
                type === "list" && (
                    <div className="product-item list-type" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {menu.length > 0 ? (
                            menu.map(item => (
                                <div
                                    key={item.id}
                                    className="product-main cursor-pointer block"
                                    style={{ flex: '0 1 calc(20% - 20px)', display: 'flex', flexDirection: 'column' }}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    onClick={() => handleMenuClick(item)} // 클릭 이벤트 추가
                                >
                                    <div className="product-thumb bg-white relative overflow-hidden rounded-2xl flex-grow">
                                        <div className="list-action-right absolute top-3 right-3 max-lg:hidden">
                                            {hoveredItem === item.id && (
                                                <div className="add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative"
                                                     onClick={(e) => {
                                                         e.stopPropagation();
                                                         //handleAddToCart(item);
                                                     }}
                                                >
                                                    <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">Add To Cart</div>
                                                    <ShoppingBag size={18} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="product-img w-full h-full flex items-center justify-center">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                width={500}
                                                height={500}
                                                className="w-full h-full object-cover duration-700"
                                                fetchPriority="high"
                                            />
                                        </div>
                                    </div>
                                    <div className="product-infor mt-4 lg:mb-7">
                                        <div className="product-name text-title duration-300">{item.name}</div>
                                        <div className="product-price text-title duration-300">{item.price}원</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>메뉴가 없습니다.</p>
                        )}
                    </div>
                )
            )}
        </>
    );
};

export default Product;
