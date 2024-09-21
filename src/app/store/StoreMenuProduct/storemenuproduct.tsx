'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { ProductType } from '@/type/ProductType'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useModalWishlistContext } from '@/context/ModalWishlistContext'
import { useCompare } from '@/context/CompareContext'
import Marquee from 'react-fast-marquee'

import { usePathname, useRouter   } from 'next/navigation';
import { Item } from '../storeItemtype';  // 타입 정의 가져오기
import axios from 'axios';
import MenuItem from '../MenuItem';
import ReviewItem from '../ReviewItem';
import Tabs from '../Tabs';




interface Review {
  id: string;
  createdDateTime: string;  // 또는 Date 객체일 수 있음
  comments?: any[]; // `comments`는 이후 추가되므로 optional로 설정
}

declare global {
  interface Window {
    IMP: {
      init: (merchantCode: string) => void;
      request_pay: (options: any, callback: (response: any) => void) => void;
    };
  }
}
interface Store  {
  id: string;
  name: string;
  price: number;
  merchanUid: string;
  companyId: string;
  imageUrl: string;
}
  

/**
 * 인터페이스 정의: `ProductProps`는 `data`와 `type`이라는 두 가지 속성을 받음.
 * `data`는 `ProductType`을 따르고, `type`은 문자열을 가짐.
 */
interface ProductProps {
    data: ProductType
    type: string
}

const Product: React.FC<ProductProps> = ({ data, type }) => {
    



    // 상태값: 활성화된 색상, 사이즈, 퀵 쇼핑 모드 여부를 관리
    const [activeColor, setActiveColor] = useState<string>('')
    const [activeSize] = useState<string>('')

    // 장바구니 관련 훅
    const { addToCart, updateCart, cartState } = useCart();
    const { openModalCart } = useModalCartContext()

    // 위시리스트 관련 훅
    const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
    const { openModalWishlist } = useModalWishlistContext()

    // 비교 리스트 관련 훅
    const { compareState } = useCompare();

    // // 페이지 이동을 위한 라우터 사용
    // const router = useRouter()

    // 특정 색상을 클릭했을 때 색상을 활성화
    const handleActiveColor = (item: string) => {
        setActiveColor(item)
    }

    const pathname = usePathname();
    const id = pathname.split('/').pop(); // 경로에서 id 추출
    const router = useRouter();

    const [store, setStore] = useState<Store | null>(null);
    const [menu, setMenu] = useState<Item[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<{ [key: string]: number }>({});
    const [iamportLoaded, setIamportLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('menu');
    
    useEffect(() => {
      console.log('ID:', id);  // 추가된 로그

      if (!id) return;  // id가 없을 때는 API 호출을 하지 않음
  
      const fetchStoreData = async () => {
        try {
          const storeResponse = await axios.get(`/api/stores/${id}`);
          console.log('Store Response:', storeResponse.data);  // 추가된 로그

          setStore(storeResponse.data);
          const companyId = storeResponse.data.companyId;
  
          const menuResponse = await axios.get(`/api/stores/${companyId}/menu`);
          console.log('Menu Response:', menuResponse.data);  // 추가된 로그

          setMenu(menuResponse.data);
  
          const reviewsResponse = await axios.get(`/api/review/listByCompany/${companyId}`);
          console.log('Reviews Response:', reviewsResponse.data);  // 추가된 로그

          // sortedReviews가 Review 배열임을 명확히 지정
          const sortedReviews: Review[] = reviewsResponse.data.sort((a: Review, b: Review) => {
              const dateA = a?.createdDateTime ? new Date(a.createdDateTime) : new Date(0);
              const dateB = b?.createdDateTime ? new Date(b.createdDateTime) : new Date(0);
              return dateB.getTime() - dateA.getTime();
          });

            
  
          const reviewsWithComments: Review[] = await Promise.all(
              sortedReviews.map((review: Review) => // review의 타입을 Review로 명시
                axios.get(`/api/review/${review.id}/comments`)
                  .then(commentResponse => ({ ...review, comments: commentResponse.data }))
              )
            );
            
          setReviews(reviewsWithComments);
        } catch (error) {
          console.error('데이터를 불러오는 데 실패했습니다.', error);
          setError('데이터를 불러오는 데 실패했습니다.');
        }
      };
  
      fetchStoreData();
  
      const script = document.createElement('script');
      script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
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
  
      return () => {
        document.body.removeChild(script);
      };
    }, [id]);  // Next.js에서는 `router.query.id` 사용
  
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string | number) => {
      const value = parseInt(e.target.value, 10);
      setQuantity(prev => ({ ...prev, [itemId]: value }));
    };
    
  
    const handleAddToCart = (item: Item) => {
      const qty = quantity[item.id] || 1;
      axios
        .post('/api/cart/add', null, {
          params: {
            merchanUid: item.merchanUid,
            companyId: item.companyId,
            name: item.name,
            price: item.price,
            count: qty,
            imageUrl: item.imageUrl,
          },
        })
        .then(response => {
          alert('장바구니에 추가되었습니다.');
          setQuantity(prev => ({ ...prev, [item.id]: 1 }));
        })
        .catch(error => {
          console.error('장바구니 추가 중 오류 발생:', error);
          alert('장바구니에 추가하는 데 실패했습니다.');
        });
        openModalCart()
    };
  
    const handlePayment = async (item: Item) => {
      try {
        await axios.post('/api/cart/add', null, {
          params: {
            merchanUid: item.merchanUid,
            companyId: item.companyId,
            name: item.name,
            price: item.price,
            count: 1, // 단일 상품이므로 수량은 1로 설정
            imageUrl: item.imageUrl,
          },
        });
  
        router.push(`/pay?singleItemMode=true&singleItemMerchanUid=${item.merchanUid}`);

      } catch (error) {
        console.error('단일 상품 전용 장바구니 추가 중 오류 발생:', error);
        alert('장바구니에 추가하는 데 실패했습니다.');
      }
    };



    // 장바구니에 상품 추가하는 함수
    // const handleAddToCart = () => {
    //     // 장바구니에 해당 상품이 없을 경우 추가, 이미 있을 경우 업데이트
    //     if (!cartState.cartArray.find(item => item.id === data.id)) {
    //         addToCart({ ...data });
    //         updateCart(data.id, data.quantityPurchase, activeSize, activeColor)
    //     } else {
    //         updateCart(data.id, data.quantityPurchase, activeSize, activeColor)
    //     }
    //     // 장바구니 모달을 열음
    //     openModalCart()
    // };

    // 위시리스트에 추가 또는 제거하는 함수
    const handleAddToWishlist = () => {
        // 위시리스트에 상품이 있으면 제거, 없으면 추가
        if (wishlistState.wishlistArray.some(item => item.id === data.id)) {
            removeFromWishlist(data.id);
        } else {
            addToWishlist(data);
        }
        // 위시리스트 모달을 열음
        openModalWishlist();
    };

    // 할인율 계산
    let percentSale = Math.floor(100 - ((data.price / data.originPrice) * 100))
    // 상품 판매 퍼센트 계산
    let percentSold = Math.floor((data.sold / data.quantity) * 100)

    return (
        <>
            {/* 'grid' 타입일 때 상품을 그리드로 보여줌 */}
            {type === "grid" ? (
                <div className="product-item grid-type">
                    <div className="product-main cursor-pointer block">
                        {/* 상품 이미지와 배치 */}
                        <div className="product-thumb bg-white relative overflow-hidden rounded-2xl">
                            {/* 'New' 태그가 붙는 경우 */}
                            {data.new && (
                                <div className="product-tag text-button-uppercase bg-green px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                                    New
                                </div>
                            )}
                            {/* 'Sale' 태그가 붙는 경우 */}
                            {data.sale && (
                                <div className="product-tag text-button-uppercase text-white bg-red px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                                    Sale
                                </div>
                            )}
                            {/* 상품의 위시리스트 추가 아이콘 */}
                            <div className="list-action-right absolute top-3 right-3 max-lg:hidden">
                                <div
                                    className={`add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative ${wishlistState.wishlistArray.some(item => item.id === data.id) ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAddToWishlist()
                                    }}
                                >
                                    <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">Add To Wishlist</div>
                                    {wishlistState.wishlistArray.some(item => item.id === data.id) ? (
                                        <Icon.Heart size={18} weight='fill' className='text-white' />
                                    ) : (
                                        <Icon.Heart size={18} />
                                    )}
                                </div>
                            </div>
                            {/* 상품 이미지: 활성화된 색상에 따라 이미지가 달라짐 */}
                            <div className="product-img w-full h-full aspect-[3/4]">
                            {menu.length > 0 ? (
                                menu.map(item => (
                                  <MenuItem
                                    key={item.id}
                                    item={item}
                                    quantity={quantity}
                                    handleQuantityChange={handleQuantityChange}
                                    handleAddToCart={handleAddToCart}
                                    handlePayment={handlePayment}
                                  />
                                ))
                              ) : (
                                <p>메뉴가 없습니다.</p>
                              )}
                            </div>

                            {/* 할인 배너: 'Sale'일 경우, 마퀴 태그로 애니메이션 효과 */}
                            {data.sale && (
                                <Marquee className='banner-sale-auto bg-black absolute bottom-0 left-0 w-full py-1.5'>
                                    <div className={`caption2 font-semibold uppercase text-white px-2.5`}>Hot Sale {percentSale}% OFF</div>
                                    <Icon.Lightning weight='fill' className='text-red' />
                                </Marquee>
                            )}

                            {/* 상품 하단의 버튼들 */}
                            <div className="list-action grid grid-cols-2 gap-3 px-5 absolute w-full bottom-5 max-lg:hidden">
                                {data.action === 'add to cart' && (
                                    <div
                                        className="add-cart-btn w-full text-button-uppercase py-2 text-center rounded-full duration-500 bg-white hover:bg-black hover:text-white"
                                        onClick={e => {
                                            e.stopPropagation();
                                            // handleAddToCart()
                                        }}
                                    >
                                        Add To Cart
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* 상품 정보 표시 (이름, 가격, 판매량 등) */}
                        <div className="product-infor mt-4 lg:mb-7">
                            <div className="product-name text-title duration-300">{data.name}</div>
                            <div className="product-price-block flex items-center gap-2 flex-wrap mt-1 duration-300 relative z-[1]">
                                <div className="product-price text-title">${data.price}.00</div>
                                {percentSale > 0 && (
                                    <>
                                        <div className="product-origin-price caption1 text-secondary2"><del>${data.originPrice}.00</del></div>
                                        <div className="product-sale caption1 font-medium bg-green px-3 py-0.5 inline-block rounded-full">
                                            -{percentSale}%
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* 'list' 타입일 경우 상품을 리스트로 보여줌 */}
                    {type === "list" && (
                        <div className="product-item list-type">
                            <div className="product-main cursor-pointer flex lg:items-center sm:justify-between gap-7 max-lg:gap-5">
                                <div className="product-thumb bg-white relative overflow-hidden rounded-2xl block max-sm:w-1/2">
                                    <div className="product-img w-full aspect-[3/4] rounded-2xl overflow-hidden">
                                        {data.thumbImage.map((img, index) => (
                                            <Image
                                                key={index}
                                                src={img}
                                                width={500}
                                                height={500}
                                                priority={true}
                                                alt={data.name}
                                                className='w-full h-full object-cover duration-700'
                                            />
                                        ))}
                                    </div>
                                </div>
                                {/* 상품 정보 표시 */}
                                <div className='flex sm:items-center gap-7 max-lg:gap-4 max-lg:flex-wrap max-lg:w-full max-sm:flex-col max-sm:w-1/2'>
                                    <div className="product-infor max-sm:w-full">
                                        <div  className="product-name heading6 inline-block duration-300">{data.name}</div>
                                        <div className="product-price-block flex items-center gap-2 flex-wrap mt-2 duration-300 relative z-[1]">
                                            <div className="product-price text-title">${data.price}.00</div>
                                            <div className="product-origin-price caption1 text-secondary2"><del>${data.originPrice}.00</del></div>
                                            {data.originPrice && (
                                                <div className="product-sale caption1 font-medium bg-green px-3 py-0.5 inline-block rounded-full">
                                                    -{percentSale}%
                                                </div>
                                            )}
                                        </div>
                                        
                                    </div>
                                    <div className="action w-fit flex flex-col items-center justify-center">
                                        <div className="list-action-right flex items-center justify-center gap-3 mt-4">
                                            {/* 즐겨찾기 아이콘 */}
                                            <div
                                                className={`add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative ${wishlistState.wishlistArray.some(item => item.id === data.id) ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleAddToWishlist()
                                                }}
                                            >
                                                {wishlistState.wishlistArray.some(item => item.id === data.id) ? (
                                                    <Icon.Heart size={18} weight='fill' className='text-white' />
                                                ) : (
                                                    <Icon.Heart size={18} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    )
}

export default Product
