// 'use client'은 이 컴포넌트가 클라이언트 측에서 실행되어야 함을 나타내는 Next.js 지시어입니다.
'use client'

// React, Next.js 및 기타 라이브러리와 컴포넌트를 불러옵니다.
import React, { useState, useEffect } from 'react'
import Link from 'next/link'                     // Next.js의 내부 페이지 이동을 위한 Link 컴포넌트.
import Image from 'next/image'                   // Next.js의 Image 컴포넌트, 최적화된 이미지 처리를 지원.
import * as Icon from "@phosphor-icons/react/dist/ssr";  // 아이콘 라이브러리에서 사용할 모든 아이콘 불러오기.
import { useModalCartContext } from '@/context/ModalCartContext'   // 장바구니 모달 상태 관리 컨텍스트 가져오기.
import { useCart } from '@/context/CartContext'  // 장바구니 상태 관리 컨텍스트 가져오기.
// import { countdownTime } from '@/store/countdownTime'  // 남은 시간 계산을 위한 countdownTime 함수 가져오기.
// import CountdownTimeType from '@/type/CountdownType';  // 카운트다운 시간 타입 정의 가져오기.
import { Item } from '@/app/store/storeItemtype';  // StoreItemtype 파일의 Item 타입 정의 가져오기.
import axios from 'axios';   // HTTP 요청을 처리하기 위한 Axios 라이브러리 불러오기.
import { useRouter } from 'next/navigation'; // Next.js의 useRouter import

interface CartItem { // CartItem 인터페이스: 장바구니 아이템의 구조 정의
    id: string; // 아이템 ID
    name: string; // 아이템 이름
    quantity: number; // 수량
    price: number; // 가격
    imageUrl: string; // 이미지 URL
}

const CartContent: React.FC = () => {
    const { isModalOpen, closeModalCart } = useModalCartContext();
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartError, setCartError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('/api/cart/view');
                setCartItems(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    setCartError('장바구니 항목을 불러오는 데 실패했습니다.');
                } else {
                    setCartError('알 수 없는 오류가 발생했습니다.');
                }
                console.error('장바구니 항목 불러오기 오류:', error);
            }
        };

        fetchCartItems();
    }, []);

    const handleRemove = async (id: string) => {
        try {
            const response = await fetch(`/api/cart/remove/${id}`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.status === 'success') {
                const updatedResponse = await axios.get('/api/cart/view');
                setCartItems(updatedResponse.data);
                alert('항목이 성공적으로 삭제되었습니다.');
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
            alert('항목 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <>
            <div className={`modal-cart-block`} onClick={closeModalCart}>
                <div
                    className={`modal-wishlist-main flex ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation(); }}
                >
                    <div className="right cart-block w-full py-6 relative overflow-hidden mt">
                        <div className="heading px-6 pb-3 flex items-center justify-between relative">
                            <div className="heading5">장바구니</div>
                            <div
                                className="close-btn absolute right-6 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                onClick={closeModalCart}
                            >
                                <Icon.X size={14} />
                            </div>
                        </div>

                        <div className="list-product px-6 mt-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className='item py-5 flex items-center justify-between gap-3 border-b border-line'>
                                    <div className="infor flex items-center gap-5">
                                        <div className="bg-img">
                                            <Image
                                                src={item.imageUrl || '이미지 준비 중 입니다.'}
                                                width={100}
                                                height={100}
                                                alt={item.name}
                                                className='w-[100px] aspect-square flex-shrink-0 rounded-lg'
                                            />
                                        </div>
                                        <div>
                                            <div className="name text-button">{item.name}</div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="product-price text-title">{item.price.toLocaleString('ko-KR')} 원</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="text-xl bg-white w-10 h-10 rounded-xl flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(item.id);
                                        }}
                                    >
                                        <Icon.Trash />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="footer-modal bg-white absolute bottom-0 left-0 w-full">
                            <div className="block-button text-center p-6 mt-0">
                                {cartItems.length > 0 && (
                                    <div className="mt-4 flex justify-center" style={{ textAlign: 'center', fontSize: '20px' }}>
                                        <button
                                            className="checkout-button bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-700"
                                            onClick={() => router.push('/Pay/P')}
                                        >
                                            결제하러가기
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartContent;
