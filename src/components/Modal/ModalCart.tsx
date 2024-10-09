// 'use client'은 이 컴포넌트가 클라이언트 측에서 실행되어야 함을 나타내는 Next.js 지시어입니다.
'use client'

// React, Next.js 및 기타 라이브러리와 컴포넌트를 불러옵니다.
import React, { useState, useEffect } from 'react'
import Link from 'next/link'                     // Next.js의 내부 페이지 이동을 위한 Link 컴포넌트.
import Image from 'next/image'                   // Next.js의 Image 컴포넌트, 최적화된 이미지 처리를 지원.
import * as Icon from "@phosphor-icons/react/dist/ssr";  // 아이콘 라이브러리에서 사용할 모든 아이콘 불러오기.
import { useModalCartContext } from '@/context/ModalCartContext'   // 장바구니 모달 상태 관리 컨텍스트 가져오기.
import { useCart } from '@/context/CartContext'  // 장바구니 상태 관리 컨텍스트 가져오기.
import { countdownTime } from '@/store/countdownTime'  // 남은 시간 계산을 위한 countdownTime 함수 가져오기.
import CountdownTimeType from '@/type/CountdownType';  // 카운트다운 시간 타입 정의 가져오기.
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

// CartContent 컴포넌트: 장바구니에 담긴 아이템을 렌더링하고 관리하는 컴포넌트
const CartContent: React.FC = () => {
    const { isModalOpen, closeModalCart } = useModalCartContext();  // 모달 상태와 모달 닫기 함수를 컨텍스트에서 가져옴.
    const router = useRouter(); // Next.js에서 페이지 이동을 위해 useRouter 훅 사용
    const [cartItems, setCartItems] = useState<CartItem[]>([]); // 장바구니 아이템들을 저장할 state
    const [cartError, setCartError] = useState<string | null>(null); // 에러 메시지를 저장할 state
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호를 저장하는 state
    const itemsPerPage = 4; // 한 페이지에 보여줄 아이템의 수

    useEffect(() => {
        // 장바구니 아이템을 가져오는 비동기 함수
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('/api/cart/view'); // 서버로부터 장바구니 아이템을 가져옴
                setCartItems(response.data); // 성공 시 아이템들을 state에 저장
            } catch (error) {
                // 에러 처리
                if (error instanceof Error) {
                    setCartError('장바구니 항목을 불러오는 데 실패했습니다.'); // 에러 메시지 설정
                } else {
                    setCartError('알 수 없는 오류가 발생했습니다.');
                }
                console.error('장바구니 항목 불러오기 오류:', error); // 콘솔에 에러 출력
            }
        };

        fetchCartItems(); // 컴포넌트가 마운트되면 fetchCartItems 함수 실행
    }, []); // 빈 배열이므로 컴포넌트가 처음 마운트될 때만 실행

    // 장바구니 아이템 삭제 함수
    const handleRemove = async (id: string) => {
        try {
            const response = await fetch(`/api/cart/remove/${id}`, {
                method: 'POST', // 아이템을 삭제하는 API 호출
            });
            const data = await response.json();
            if (data.status === 'success') {
                const updatedResponse = await axios.get('/api/cart/view'); // 삭제 후 장바구니를 다시 가져옴
                setCartItems(updatedResponse.data); // 업데이트된 장바구니 아이템을 설정
                alert('항목이 성공적으로 삭제되었습니다.'); // 성공 메시지 표시
            }
        } catch (error) {
            console.error('Error removing cart item:', error); // 삭제 중 에러 처리
            alert('항목 삭제 중 오류가 발생했습니다.');
        }
    };

    // 페이지네이션 처리
    const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지에서 마지막 아이템의 인덱스
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지에서 첫 번째 아이템의 인덱스
    const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지에 표시할 아이템들 추출

    // 페이지를 변경하는 함수
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <>
            {/* 모달 전체 화면을 클릭하면 모달이 닫히도록 설정 */}
            <div className={`modal-cart-block`} onClick={closeModalCart}>
                {/* 모달 본체. 클릭 이벤트가 상위 요소로 전파되지 않도록 e.stopPropagation() 사용 */}
                <div
                    className={`modal-wishlist-main flex ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation(); }}
                >
                    {/* 오른쪽 장바구니 블록 */}
                    <div className="right cart-block w-full py-6 relative overflow-hidden mt">
                        {/* 헤더 - 장바구니 제목 및 닫기 버튼 */}
                        <div className="heading px-6 pb-3 flex items-center justify-between relative">
                            <div className="heading5">장바구니</div>
                            {/* 모달 닫기 버튼 */}
                            <div
                                className="close-btn absolute right-6 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                onClick={closeModalCart}
                            >
                                <Icon.X size={14} />  {/* Phosphor Icon 라이브러리에서 X 아이콘 사용 */}
                            </div>
                        </div>

                        {/* 장바구니 상품 목록 */}
                        <div className="list-product px-6 mt-6">
                            {currentItems.map((item) => ( // 현재 페이지에 해당하는 아이템들을 map으로 렌더링
                        <div key={item.id} className='item py-5 flex items-center justify-between gap-3 border-b border-line'>
                            <div className="infor flex items-center gap-5">
                                <div className="bg-img">
                                    <Image
                                        src={item.imageUrl || '이미지 준비 중 입니다.'} // 이미지 URL이 없으면 기본 이미지 사용
                                        width={100}
                                        height={100}
                                        alt={item.name}
                                        className='w-[100px] aspect-square flex-shrink-0 rounded-lg'
                                    />
                                </div>
                                <div>
                                    <div className="name text-button">{item.name}</div> {/* 아이템 이름 */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="product-price text-title">{item.price.toLocaleString('ko-KR')} 원</div> {/* 아이템 가격 */}
                                    </div>
                                </div>
                            </div>
                            <div
                                className="text-xl bg-white w-10 h-10 rounded-xl border border-black flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                onClick={(e) => { // 쓰레기통 아이콘 클릭 시 삭제 처리
                                    e.stopPropagation();
                                    handleRemove(item.id); // 아이템 삭제 함수 호출
                                }}
                            >
                                <Icon.Trash /> {/* 쓰레기통 아이콘 */}
                            </div>
                            
                        </div>
                        
                    ))}
                            {/* 페이지네이션 버튼들 */}
            <div className="flex justify-center mt-6">
                {Array.from({ length: Math.ceil(cartItems.length / itemsPerPage) }, (_, index) => (
                    <button
                        key={index}
                        className={`mx-1 px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'text-red' : 'text-black'}`} // 현재 페이지면 빨간색, 아니면 검정색
                        onClick={() => paginate(index + 1)} // 페이지 변경 함수 호출
                    >
                        {index + 1}
                    </button>
                ))}
                {currentPage < Math.ceil(cartItems.length / itemsPerPage) && ( // 마지막 페이지가 아닌 경우 '다음' 버튼 표시
                    <button
                        className="mx-1 px-4 py-2 rounded-lg text-gray-300"
                        onClick={() => paginate(currentPage + 1)}
                    >
                        &gt;
                    </button>
                )}
            </div>
                        </div>

                        {/* 장바구니 모달의 푸터 */}
                        <div className="footer-modal bg-white absolute bottom-0 left-0 w-full">
                            
                            {/* 장바구니에 항목이 있으면 결제 버튼 표시 */}
                            <div className="block-button text-center p-6 mt-0">
                                {/* 결제하러가기 버튼 추가 부분 */}
                                {cartItems.length > 0 && (
                                    <div className="mt-4 flex justify-center" 
                                    style={{
                                        textAlign:'center',
                                        fontSize:'20px'

                                    }}>
                                        <button
                                            className="checkout-button bg-blue-500  px-6 py-2 rounded-lg hover:bg-blue-700"
                                            onClick={() => router.push('/Pay/P')} // useRouter의 push로 페이지 이동
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
