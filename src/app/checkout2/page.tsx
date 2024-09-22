'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'

const Checkout = () => {
    const { openModalCart } = useModalCartContext()
    const { cartState } = useCart();
    let [totalCart, setTotalCart] = useState<number>(0)

    cartState.cartArray.map(item => totalCart += item.price * item.quantity)

    return (
        <>
            <div id="header" className='relative w-full'>
                <div className={`header-menu style-one fixed top-0 left-0 right-0 w-full md:h-[74px] h-[56px]`}>
                    <div className="container mx-auto h-full">
                        <div className="header-main flex items-center justify-between h-full">
                            <Link href={'/'} className='flex items-center'>
                                <div className="heading4">Modo Modo</div>
                            </Link>
                            <button className="max-md:hidden cart-icon flex items-center relative h-fit cursor-pointer" onClick={openModalCart}>
                                <Icon.Handbag size={24} color='black' />
                                <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">{cartState.cartArray.length}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="checkout-block relative md:pt-[74px] pt-[56px]">
                <div className="content-main flex max-lg:flex-col-reverse justify-between">
                    <div className="left flex lg:justify-end w-full">
                        <div className="lg:max-w-[716px] flex-shrink-0 w-full lg:pt-20 pt-12 lg:pr-[70px] pl-[16px] max-lg:pr-[16px]">
                            <form>
                                <div className="login flex justify-between gap-4">
                                    <h4 className="heading4">메뉴 선택</h4>
                                </div>
                                <div>
                                    <input type="text" className="border-line mt-5 px-4 py-3 w-full rounded-lg" placeholder="Email or mobile phone number" required />
                                    <div className="flex items-center mt-5">
                                        <div className="block-input">
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="information md:mt-10 mt-6">
                                    <div className="heading5">날짜 선택</div>
                                    <div className="deli_type mt-5">
                                        <div className="item flex items-center gap-2 relative px-5 border border-line rounded-t-lg">
                                        </div>
                                        <div className="item flex items-center gap-2 relative px-5 border border-line rounded-b-lg">
                                           
                                        </div>
                                    </div>
                                    
                                </div>
                            </form>
                            <div className="copyright caption1 md:mt-20 mt-12 py-3 border-t border-line">©2024 Anvogue. All Rights Reserved.</div>
                        </div>
                    </div>
                    <div className="right justify-start flex-shrink-0 lg:w-[47%] bg-surface lg:py-20 py-12">
                        <div className="lg:sticky lg:top-24 h-fit lg:max-w-[606px] w-full flex-shrink-0 lg:pl-[80px] pr-[16px] max-lg:pl-[16px]">
                            <div className="list_prd flex flex-col gap-7">
                                <div className="item flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="bg_img relative flex-shrink-0 w-[100px] h-[100px]">
                                            <img src="/images/product/1000x1000.png" alt="product/1000x1000" className="w-full h-full object-cover rounded-lg" />
                                            <span className="quantity flex items-center justify-center absolute -top-3 -right-3 w-7 h-7 rounded-full bg-black text-white">1</span>
                                        </div>
                                        <div>
                                            <strong className="name text-title">Contrasting sheepskin sweatshirt</strong>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Icon.Tag className="text-secondary" />
                                                <span className="code text-secondary">AN6810 <span className="discount">(-$14.20)</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <del className="caption1 text-secondary text-end org_price">$99.00</del>
                                        <strong className="text-title price">$60.00</strong>
                                    </div>
                                </div>
                                <div className="item flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="bg_img relative flex-shrink-0 w-[100px] h-[100px]">
                                            <img src="/images/product/1000x1000.png" alt="product/1000x1000" className="w-full h-full object-cover rounded-lg" />
                                            <span className="quantity flex items-center justify-center absolute -top-3 -right-3 w-7 h-7 rounded-full bg-black text-white">1</span>
                                        </div>
                                        <div>
                                            <strong className="name text-title">Contrasting sheepskin sweatshirt</strong>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Icon.Tag className="text-secondary" />
                                                <span className="code text-secondary">AN6810 <span className="discount">(-$14.20)</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <del className="caption1 text-secondary text-end org_price">$99.00</del>
                                        <strong className="text-title price">$60.00</strong>
                                    </div>
                                </div>
                            </div>
                            
                            
                            <div className="total-cart-block flex items-center justify-between mt-4">
                                <strong className="heading4">Total</strong>
                                <div className="flex items-end gap-2">
                                    <span className="body1 text-secondary">USD</span>
                                    <strong className="heading4">$186,99</strong>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Checkout