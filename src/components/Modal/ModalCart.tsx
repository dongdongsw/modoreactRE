'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalCartContext } from '@/context/ModalCartContext'
import { useCart } from '@/context/CartContext'
import { countdownTime } from '@/store/countdownTime'
import CountdownTimeType from '@/type/CountdownType';
import { Item } from '@/app/store/storeItemtype';  // 타입 정의 가져오기
import axios from 'axios';

interface Store {
    id: string;
    name: string;
    price: number;
    merchanUid: string;
    companyId: string;
    imageUrl: string;
}

const ModalCart = ({ serverTimeLeft }: { serverTimeLeft: CountdownTimeType }) => {
    const [timeLeft, setTimeLeft] = useState(serverTimeLeft);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(countdownTime());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const { isModalOpen, closeModalCart } = useModalCartContext();
    const { cartState, removeFromCart } = useCart();
    const [quantity, setQuantity] = useState<{ [key: string]: number }>({});
    const [totalCart, setTotalCart] = useState<number>(0);

    // Total price 계산
    useEffect(() => {
        let total = 0;
        cartState.cartArray.forEach(item => {
            total += item.price * item.quantity;
        });
        setTotalCart(total);
    }, [cartState.cartArray]);

    const handleRemoveFromCart = (productId: string) => {
        removeFromCart(productId);
    };

    return (
        <>
            <div className={`modal-cart-block`} onClick={closeModalCart}>
                <div
                    className={`modal-cart-main flex ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation(); }}
                >
                    <div className="right cart-block md:w-1/2 w-full py-6 relative overflow-hidden">
                        <div className="heading px-6 pb-3 flex items-center justify-between relative">
                            <div className="heading5">장바구니</div>
                            <div
                                className="close-btn absolute right-6 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                                onClick={closeModalCart}
                            >
                                <Icon.X size={14} />
                            </div>
                        </div>

                        <div className="list-product px-6">
                            {cartState.cartArray.length > 0 ? (
                                cartState.cartArray.map((product) => (
                                    <div key={product.id} className='item py-5 flex items-center justify-between gap-3 border-b border-line'>
                                        <div className="infor flex items-center gap-3 w-full">
                                            
                                            <div className='w-full'>
                                                
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="name text-button">{product.name}</div>
                                                    <div
                                                        className="remove-cart-btn caption1 font-semibold text-red underline cursor-pointer"
                                                        onClick={() => handleRemoveFromCart(product.id)}
                                                    >
                                                        삭제
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between gap-2 mt-3 w-full">
                                                    <div className="flex items-center text-secondary2 capitalize">
                                                        {product.quantity} x ${product.price}
                                                    </div>
                                                    <div className="product-price text-title">${(product.price * product.quantity).toFixed(2)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-cart text-center py-5">장바구니에 항목이 없습니다.</div>
                            )}
                        </div>

                        <div className="footer-modal bg-white absolute bottom-0 left-0 w-full">
                            <div className="flex items-center justify-between pt-6 px-6">
                                <div className="heading5">Subtotal</div>
                                <div className="heading5">${totalCart.toFixed(2)}</div>
                            </div>
                            <div className="block-button text-center p-6">
                                {cartState.cartArray.length > 0 && (
                                    <div className="flex items-center gap-4">
                                        <Link
                                            href={'/cart'}
                                            className='button-main basis-1/2 bg-white border border-black text-black text-center uppercase'
                                            onClick={closeModalCart}
                                        >
                                            View cart
                                        </Link>
                                        <Link
                                            href={'/checkout'}
                                            className='button-main basis-1/2 text-center uppercase'
                                            onClick={closeModalCart}
                                        >
                                            Check Out
                                        </Link>
                                    </div>
                                )}
                                <div onClick={closeModalCart} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">
                                    Or continue shopping
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalCart;
