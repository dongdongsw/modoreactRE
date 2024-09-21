import React, { useEffect, useState } from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import axios from 'axios';
import Image from 'next/image';

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
}

interface CartItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
}

const CartItems: React.FC<TabButtonProps> = ({ isActive, onClick }) => {
    return (
        <div
            className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <Icon.ShoppingBag size={20} />
            <strong className="heading6">장바구니</strong>
        </div>
    );
};

const CartContent: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartError, setCartError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="cart-content p-7 border border-line rounded-xl">
            <div className="heading5 mb-4">상품 장바구니</div>
            <div className="cart-items">
                {currentItems.map((item) => (
                    <div key={item.id} className='item py-5 flex items-center justify-between gap-3 border-b border-line'>
                        <div className="infor flex items-center gap-5">
                            <div className="bg-img">
                                <Image
                                    src={item.imageUrl || '/default-image.png'}
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
                            className="text-xl bg-white w-10 h-10 rounded-xl border border-black flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
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

            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(cartItems.length / itemsPerPage) }, (_, index) => (
                    <button
                        key={index}
                        className={`mx-1 px-4 py-2 rounded-lg ${
                            currentPage === index + 1 ? 'text-red' : 'text-black'
                        }`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                {currentPage < Math.ceil(cartItems.length / itemsPerPage) && (
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

export default CartItems;
export { CartContent };
