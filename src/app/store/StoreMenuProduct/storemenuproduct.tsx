'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import { ProductType } from '@/type/ProductType';
// import { useCart } from '@/context/CartContext';
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
    
    type: string;
}

declare global {
    interface Window {
        IMP?: any;
    }
}
const Product: React.FC<ProductProps> = ({  type }) => {
    const [quantity, setQuantity] = useState<{ [key: string]: number }>({});
    const [store, setStore] = useState<Store | null>(null);
    const [menu, setMenu] = useState<Item[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [iamportLoaded, setIamportLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태 추가
    const [productsPerPage] = useState(10); // 페이지당 제품 수 (조정 가능)

     // 총 페이지 수 계산
    const totalPages = Math.ceil(menu.length / productsPerPage);

    // 현재 페이지에 맞는 제품 슬라이싱
    const currentMenuItems = menu.slice(currentPage * productsPerPage, (currentPage + 1) * productsPerPage);


    //const { addToCart, openModalCart } = useCart();
    const { addToWishlist, wishlistState } = useWishlist();

    const fetchStoreData = async (id: string) => {
        try {
            console.log(`Fetching store data for ID: ${id}`); // ID 확인
            const storeResponse = await axios.get(`/api/stores/${id}`);
            console.log("Store response data:", storeResponse.data); // Store 데이터 확인
    
            setStore(storeResponse.data);
            const companyId = storeResponse.data.companyId;
            console.log(`Fetching menu for company ID: ${companyId}`); // Company ID 확인
    
            const menuResponse = await axios.get(`/api/stores/${companyId}/menu`);
            console.log("Menu response data:", menuResponse.data); // Menu 데이터 확인
    
            setMenu(menuResponse.data); // Menu 데이터 설정
        } catch (error) {
            console.error('데이터를 불러오는 데 실패했습니다.', error);
            setError('데이터를 불러오는 데 실패했습니다.');
        }
    };
    

    useEffect(() => {
        const id = window.location.pathname.split('/').pop();
        console.log("Fetched ID from URL:", id); // id 값을 확인

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };

      return (
        <>
          {type === "grid" ? (
            <div className="product-item grid-type" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {currentMenuItems.length > 0 ? (
                currentMenuItems.map(item => (
                  <div
                    key={item.id}
                    className="product-main cursor-pointer block"
                    style={{ flex: '0 1 calc(20% - 20px)', display: 'flex', flexDirection: 'column' }}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => handleMenuClick(item)}
                  >
                    <div className="product-thumb bg-white relative overflow-hidden rounded-2xl flex-grow">
                      <div className="list-action-right absolute top-3 right-3 max-lg:hidden">
                        {hoveredItem === item.id && (
                          <div
                            className="add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">Add To Cart</div>
                            <ShoppingBag size={18} />
                          </div>
                        )}
                      </div>
                      <div
                        className="product-img"
                        style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                      >
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={500}
                          height={500}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            transform: hoveredItem === item.id ? 'scale(1.1)' : 'scale(1)', // hover 시 확대 효과
                          }}
                          fetchPriority="high"
                        />
                      </div>
                    </div>
                    <div className="product-infor mt-4 lg:mb-7">
                      <div className="product-price text-title duration-300">{item.name}</div>
                      <div className="product-price text-title duration-300">{item.price}원</div>
                    </div>
                  </div>
                ))
              ) : (
                <p>메뉴가 없습니다.</p>
              )}
            </div>
          ) : type === "list" && (
            <div className="product-item list-type" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {currentMenuItems.length > 0 ? (
                currentMenuItems.map(item => (
                  <div key={item.id} className="product-main cursor-pointer block">
                    <div className="product-thumb bg-white relative overflow-hidden rounded-2xl">
                      <div className="product-img" style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <Image src={item.imageUrl} alt={item.name} width={500} height={500} style={{ width: '100%', height: '100%', objectFit: 'cover' }} fetchPriority="high" />
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
          )}
    
          {/* 페이지네이션 버튼 */}
          <div className="pagination mt-10 flex justify-center">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                style={{ margin: '0 5px', padding: '5px 10px', border: currentPage === index ? '1px solid black' : '1px solid gray', borderRadius: '10px' }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      );
    };
    
    export default Product;