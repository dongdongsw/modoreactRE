'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import { ProductType } from '@/type/ProductType';
// import { useCart } from '@/context/CartContext';
// import { useWishlist } from '@/context/WishlistContext';
import axios from 'axios';
import { Item } from '../storeItemtype';
import { ShoppingBag } from "@phosphor-icons/react"; // 쇼핑백 아이콘 가져오기
import internal from 'stream';
import Modal from '../components/Modal'; // Modal 컴포넌트 임포트
import { useRouter } from 'next/navigation'; // useRouter 임포트


interface Store {
  id: string;
  name: string;
  price: number;
  companyId: string;
  count: internal;
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

const Product: React.FC<ProductProps> = ({ type }) => {
  const [store, setStore] = useState<Store | null>(null);
  const [menu, setMenu] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [iamportLoaded, setIamportLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage] = useState(10);
  const [externalId, setExternalId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<{ [key: string]: number }>({});
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [modalMessage, setModalMessage] = useState('');
  const router = useRouter();
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null); // 각 버튼의 hover 상태 관리

  const totalPages = Math.ceil(menu.length / productsPerPage);
  const currentMenuItems = menu.slice(currentPage * productsPerPage, (currentPage + 1) * productsPerPage);

  useEffect(() => {
    const fetchExternalId = async () => {
      try {
        const response = await axios.get('/login/user/externalId');
        setExternalId(response.data);
      } catch (error) {
        console.error('External ID를 가져오는 데 실패했습니다:', error);
      }
    };
    fetchExternalId();
  }, []);

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

  const handleAddToCart = (item: Item) => {
    if (!externalId) {
      alert('로그인 후 진행해주세요.');
      return;
    }

    axios.post('/api/cart/add', null, {
      params: {
        merchanUid: item.id,
        companyId: store?.companyId,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl
      }
    })
    .then(response => {
      setIsModalVisible(true);
      setCurrentItem(item); 
      setQuantity(prev => ({ ...prev, [item.id]: 1 }));
    })
    .catch(error => {
      console.error('장바구니 추가 중 오류 발생:', error);
      alert('장바구니에 추가하는 데 실패했습니다.');
    });
  };

  const handlePayment = async (item: Item) => {
    if (!externalId) {
      alert('로그인 후 진행해주세요.');
      return;
    }

    try {
      await axios.post('/api/cart/add', null, {
        params: {
          merchanUid: item.id,
          companyId: store?.companyId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl
        }
      });

      router.push(`/pay/p?singleItemMode=true&singleItemMerchanUid=${item.id}`);
    } catch (error) {
      console.error('단일 상품 전용 장바구니 추가 중 오류 발생:', error);
      alert('장바구니에 추가하는 데 실패했습니다.');
    }
  };

  const handleMenuClick = (item: Item) => {
    console.log(item);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {type === 'grid' ? (
        <div className="product-item grid-type" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {currentMenuItems.length > 0 ? (
            currentMenuItems.map((item) => (
              <div
                key={item.id}
                className="product-main cursor-pointer block"
                style={{ flex: '0 1 calc(20% - 20px)', display: 'flex', flexDirection: 'column' }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleMenuClick(item)}
              >
                <div className="product-thumb bg-white relative overflow-hidden rounded-2xl flex-grow" style={{boxShadow:'1.5px 1.5px 1.5px #ccc'}}>
                  <div className="list-action-right absolute top-3 right-3 max-lg:hidden">
                    {hoveredItem === item.id && (
                      <>
                        {/* Add To Cart Button */}
                        <div
                          className="add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative"
                          onMouseEnter={() => setHoveredButton("cart")} // 개별 버튼 hover 설정
                          onMouseLeave={() => setHoveredButton(null)} // hover 상태 해제
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          style={{
                            transform: hoveredButton === "cart" ? 'scale(1.1)' : 'scale(1)', // 개별 hover 시만 모션 변경
                          }}
                        >
                          <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">Add To Cart</div>
                          <ShoppingBag size={18} />
                        </div>
  
                        {/* 결제하기 버튼 */}
                        <div
                          className="list-action grid grid-cols-1 gap-3 px-5 absolute w-full bottom-0 max-lg:hidden"
                          style={{ marginLeft: '-195px', marginBottom: '-240px' }}
                        >
                          <div
                            className="quick-view-btn w-full text-button-uppercase py-2 text-center rounded-full duration-300 bg-white hover:bg-black hover:text-white"
                            onMouseEnter={() => setHoveredButton("pay")} // 개별 결제 버튼 hover 설정
                            onMouseLeave={() => setHoveredButton(null)} // hover 상태 해제
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePayment(item);
                            }}
                            style={{
                              transform: hoveredButton === "pay" ? 'scale(1.1)' : 'scale(1)', // 개별 hover 시만 모션 변경
                              width: '200px',
                            }}
                          >
                            결제하기
                          </div>
                        </div>
                      </>
                    )}
                  </div>
  
                  <div className="product-img" style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <Image
                      src={item.imageUrl || '이미지 준비 중입니다.'}
                      alt={item.name}
                      width={500}
                      height={500}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease', transform: hoveredItem === item.id ? 'scale(1.1)' : 'scale(1)' }}
                      fetchPriority="high"
                    />
                  </div>
                </div>
  
                <div className="product-infor mt-2 lg:mb-7">
                  <div className="product-price text-title duration-300  mb-1 text-center" style={{fontWeight:'weight'}}>{item.name}</div>
                  <div className="product-price text-title duration-300 text-center">{item.price}원</div>
                </div>
              </div>
            ))
          ) : (
            <p>메뉴가 없습니다.</p>
          )}
        </div>
      ) : (
        type === 'list' && (
          <div className="product-item list-type" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}></div>
        )
      )}
  
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
  
      <Modal
        isVisible={isModalVisible}
        message={modalMessage}
        onClose={() => setIsModalVisible(false)}
        onNavigate={() => handlePayment(currentItem!)} // 모달에서 handlePayment 호출
      />
    </>
  );
};

export default Product;