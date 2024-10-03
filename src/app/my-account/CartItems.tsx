import React, { useEffect, useState } from 'react'; // React와 관련된 훅들 import
import * as Icon from '@phosphor-icons/react/dist/ssr'; // Phosphor Icons를 import하여 아이콘 사용
import axios from 'axios'; // Axios를 사용해 API 요청을 보낼 수 있도록 import
import Image from 'next/image'; // Next.js의 Image 컴포넌트 import (이미지 최적화)
import { useRouter } from 'next/navigation'; // Next.js의 useRouter import

interface TabButtonProps { // TabButtonProps 인터페이스: 탭 버튼 컴포넌트의 props 정의
    isActive: boolean; // 탭이 활성화되었는지 여부
    onClick: () => void; // 클릭했을 때 호출되는 함수
}

interface CartItem { // CartItem 인터페이스: 장바구니 아이템의 구조 정의
    id: string; // 아이템 ID
    name: string; // 아이템 이름
    quantity: number; // 수량
    price: number; // 가격
    imageUrl: string; // 이미지 URL
}

// 장바구니 탭 컴포넌트 정의. 탭이 활성화되었는지 여부(isActive)와 클릭 이벤트 핸들러(onClick)를 props로 받음
const CartItems: React.FC<TabButtonProps> = ({ isActive, onClick }) => {
    return (
        <div
            className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${isActive ? 'active' : ''}`} // 클릭하면 스타일이 바뀜
            onClick={onClick} // 클릭 시 실행될 함수 호출
        >
            <Icon.ShoppingBag size={20} /> {/* 장바구니 아이콘 */}
            <strong className="heading6">장바구니</strong> {/* '장바구니'라는 텍스트 */}
        </div>
    );
};

// CartContent 컴포넌트: 장바구니에 담긴 아이템을 렌더링하고 관리하는 컴포넌트
const CartContent: React.FC = () => {
    const router = useRouter(); // Next.js에서 페이지 이동을 위해 useRouter 훅 사용

    const [cartItems, setCartItems] = useState<CartItem[]>([]); // 장바구니 아이템들을 저장할 state
    const [cartError, setCartError] = useState<string | null>(null); // 에러 메시지를 저장할 state
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호를 저장하는 state
    const itemsPerPage = 5; // 한 페이지에 보여줄 아이템의 수

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

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber); // 페이지를 변경하는 함수

    return (
        <div className="cart-content p-7 border border-line rounded-xl"> {/* 장바구니 콘텐츠 영역 */}
            <div className="heading5 mb-4">상품 장바구니</div> {/* 제목 */}
            <div className="cart-items">
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
                {/* 결제하러가기 버튼 추가 부분 */}
            {cartItems.length > 0 && (
                <div className="mt-4 flex justify-center">
                    <button
                        className="checkout-button bg-blue-500  px-6 py-2 rounded-lg hover:bg-blue-700"
                        onClick={() => router.push('/Pay/P')} // useRouter의 push로 페이지 이동
                    >
                        결제하러가기
                    </button>
                </div>
            )}
            </div>

            

            {/* 페이지네이션 버튼들 */}
            <div className="flex justify-center mt-4">
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
    );
};

export default CartItems; // CartItems 컴포넌트 기본 export
export { CartContent }; // CartContent 컴포넌트 별도 export
