'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { usePathname } from 'next/navigation';
import Product from '@/components/Product/Product';
import productData from '@/data/Product.json'
import useLoginPopup from '@/store/useLoginPopup';
import useMenuMobile from '@/store/useMenuMobile';
import { useModalCartContext } from '@/context/ModalCartContext';
import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { useModalSearchContext } from '@/context/ModalSearchContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { toast } from 'react-toastify';

const MenuYoga = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { openLoginPopup, handleLoginPopup } = useLoginPopup();
    const { openMenuMobile, handleMenuMobile } = useMenuMobile();
    const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);
    const { openModalCart } = useModalCartContext();
    const { cartState } = useCart();
    const { openModalWishlist } = useModalWishlistContext();
    const { openModalSearch } = useModalSearchContext();
    const [nickname, setNickname] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');

    const handleOpenSubNavMobile = (index: number) => {
        setOpenSubNavMobile(openSubNavMobile === index ? null : index);
    };

    const [fixedHeader, setFixedHeader] = useState(false);
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
            setLastScrollPosition(scrollPosition);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollPosition]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [externalIdResponse, roleResponse] = await Promise.all([
                    axios.get('/login/user/externalId'),
                    axios.get('/login/user/role')
                ]);

                if (externalIdResponse.status === 200 && externalIdResponse.data) {
                    setNickname(externalIdResponse.data); // externalId를 닉네임으로 설정
                    setIsAuthenticated(true);
                }

                if (roleResponse.status === 200 && roleResponse.data) {
                    const { role } = roleResponse.data;
                    setUserRole(role);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);


    const handleGenderClick = (gender: string) => {
        router.push(`/shop/breadcrumb1?gender=${gender}`);
    };

    const handleCategoryClick = (category: string) => {
        router.push(`/shop/breadcrumb1?category=${category}`);
    };

    const handleTypeClick = (type: string) => {
        router.push(`/shop/breadcrumb1?type=${type}`);
    };

    const handleLogout = () => {
        axios.get('/login/logout')
            .then(response => {
                setNickname('');
                setIsAuthenticated(false);
                alert(response.data.message);
                window.location.href = "http://localhost:3000";
            })
            .catch(error => {
                console.error('There was an error logging out!', error);
            });
    };

    return (
        <>
            <div className={`header-menu style-one ${fixedHeader ? ' fixed' : 'relative'} bg-white w-full md:h-[74px] h-[56px]`}>
                <div className="container mx-auto h-full">
                    <div className="header-main flex justify-between h-full">
                        <div className="menu-mobile-icon lg:hidden flex items-center" onClick={handleMenuMobile}>
                            <i className="icon-category text-2xl"></i>
                        </div>
                        <Link href={'/'} className='flex items-center'>
                            <div className="heading4" style={{    
                                background: 'linear-gradient(to left, #000000 ,   #000000)',
                                color: 'transparent',
                                WebkitBackgroundClip: 'text'
                              }}>Modo Modo</div>
                        </Link>
                        <div className="menu-main h-full max-lg:hidden">
                            <ul className='flex items-center gap-8 h-full'>
                                
                                    <Link
                                        href={'/shop'}
                                        className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 
                                            ${pathname === '/shop/square' ? 'active' : ''}`}>
                                        STORE
                                    </Link>

                                    <Link href="/notice/NoticeListPage" className={`text-button-uppercase duration-300 h-full flex items-center justify-center 
                                        ${pathname === '/notice/NoticeListPage' ? 'active' : ''}`} >
                                        NOTICE
                                    </Link>

                                    <Link href="/event/EventListPage" className={`text-button-uppercase duration-300 h-full flex items-center justify-center 
                                        ${pathname === '/event/EventListPage' ? 'active' : ''}`} >
                                        EVENT
                                    </Link>

                                    <Link href="/faqs/FaQsListPage" className={`text-button-uppercase duration-300 h-full flex items-center justify-center 
                                        ${pathname === '/faqs/FaQsListPage' ? 'active' : ''}`} >
                                        FAQ
                                    </Link>

                                    <Link href="/pages/RegisterStore" className={`text-button-uppercase duration-300 h-full flex items-center justify-center 
                                        ${pathname === '/pages/RegisterStore' ? 'active' : ''}`} >
                                        REGISTER STORE
                                    </Link>

                                {userRole === 'ROLE_ADMIN' && (
                                    <li>
                                        <Link
                                            href="/pages/ManageStore"
                                            className={`text-button-uppercase duration-300 h-full flex items-center justify-center 
                                ${pathname === '/pages/ManageStore' ? 'active' : ''}`}
                                        >
                                            MANAGESTORE
                                        </Link>
                                    </li>
                                )}

                                {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_OWNER') && (
                                    <li>
                                        <Link href="/pages/dashboard" className={`text-button-uppercase duration-300 h-full flex items-center justify-center 
        ${pathname === '/pages/dashboard' ? 'active' : ''}`}>
                                           DASHBOARD
                                        </Link>
                                    </li>
                                )}

                                           
                                    

                              {/*}  <li className='h-full'>
                                    <Link href="#!" className='text-button-uppercase duration-300 h-full flex items-center justify-center'>
                                        Shop
                                    </Link>
                                    <div className="mega-menu absolute top-[74px] left-0 bg-white w-screen">
                                        <div className="container">
                                            <div className="flex justify-between py-8">
                                                <div className="nav-link basis-2/3 flex justify-between pr-12">

                                                    <div className="nav-item">
                                                        <div className="text-button-uppercase pb-2">Shop Layout</div>
                                                        <ul>
                                                            
                                                            <li>
                                                                <Link
                                                                    href={'/shop'}
                                                                    className={`link text-secondary duration-300 ${pathname === '/shop/square' ? 'active' : ''}`}
                                                                >
                                                                    Shop Square
                                                                </Link>
                                                            </li>
                                                            
                                                            
                                                        </ul>
                                                    </div>
                                                    <div className="nav-item">
                                                        <div className="text-button-uppercase pb-2">Products Pages</div>
                                                        <ul>
                                                           
                                                            <li>
                                                                <Link
                                                                    href={'/my-account'}
                                                                    className={`link text-secondary duration-300 ${pathname === '/my-account' ? 'active' : ''}`}
                                                                >
                                                                    My Account
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </li>
                                
                                
                                <li className='h-full relative'>
                                    <Link href="#!" className='text-button-uppercase duration-300 h-full flex items-center justify-center'>
                                        Pages
                                    </Link>
                                    <div className="sub-menu py-3 px-5 -left-10 absolute bg-white rounded-b-xl">
                                        <ul className='w-full'>
                                            
                                            
                                            <li>
                                                <Link href="/pages/page-not-found" className={`text-secondary duration-300 ${pathname === '/pages/page-not-found' ? 'active' : ''}`}>
                                                    404
                                                </Link>
                                            </li>
                                           
                                            
                                          {/*  <li>
                                                <Link href="/pages/RegisterStore" className={`text-secondary duration-300 ${pathname === '/pages/RegisterStore' ? 'active' : ''}`}>
                                                    RegisterStore
                                                </Link>
                                            </li>
                                            {userRole === 'ROLE_ADMIN' && (
                                                <li>
                                                    <Link
                                                        href="/pages/ManageStore"
                                                        className={`text-secondary duration-300 ${pathname === '/pages/ManageStore' ? 'active' : ''}`}
                                                    >
                                                        ManageStore
                                                    </Link>
                                                </li>
                                            )}
                                            {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_OWNER') && (
                                                <li>
                                                    <Link
                                                        href="/pages/dashboard"
                                                        className={`text-secondary duration-300 ${pathname === '/pages/dashboard' ? 'active' : ''}`}
                                                    >
                                                        Dashboard
                                                    </Link>
                                                </li>
                                            )}

                                        </ul>
                                    </div>
                                </li>*/}
                            </ul>
                        </div>
                        <div className="right flex gap-12">
                            
                            <div className="list-action flex items-center gap-4">
                                <div className="user-icon flex items-center justify-center cursor-pointer">
                                    <Icon.SignIn size={24} color='black' onClick={handleLoginPopup} />
                                    <div className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-sm ${openLoginPopup ? 'open' : ''}`}>
                                        {isAuthenticated ? (
                                            <button onClick={handleLogout} className="button-main w-full text-center">
                                                Logout
                                            </button>
                                        ) : (
                                            <>
                                                <Link href="http://localhost:8080/oauth2/authorization/kakao" className="button-main w-full text-center">Login</Link>
                                                <div className="text-secondary text-center mt-3 pb-4">
                                                    Don’t have an account?
                                                    <Link href={'/login/signup'} className='text-black pl-1 hover:underline'>Sign Up</Link>
                                                </div>
                                            </>
                                        )}
                                        <div className="bottom pt-4 border-t border-line"></div>
                                        <Link href={'#!'} className='body1 hover:underline'>Support</Link>
                                    </div>
                                </div>
                                <div className="max-md:hidden wishlist-icon flex items-center cursor-pointer">
                                    <Link href={'/my-account'} className={`link text-secondary duration-300 ${pathname === '/my-account' ? 'active' : ''}`}>
                                                         
                                    <Icon.User size={24} color='black' />
                                    </Link>
                                </div>
                                <div className="max-md:hidden wishlist-icon flex items-center cursor-pointer" onClick={openModalWishlist}>
                                    <Icon.Heart size={24} color='black' />
                                </div>
                                <div className="cart-icon flex items-center relative cursor-pointer" onClick={openModalCart}>
                                    <Icon.Handbag size={24} color='black' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="menu-mobile" className={`${openMenuMobile ? 'open' : ''}`}>
                <div className="menu-container bg-white h-full">
                    <div className="container h-full">
                        <div className="menu-main h-full overflow-hidden">
                            <div className="heading py-2 relative flex items-center justify-center">
                                <div
                                    className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                                    onClick={handleMenuMobile}
                                >
                                    <Icon.X size={14} />
                                </div>
                                <Link href={'/'} className='logo text-3xl font-semibold text-center'>ModoModo</Link>
                            </div>
                            <div className="form-search relative mt-2">
                                <Icon.MagnifyingGlass size={20} className='absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer' />
                                <input type="text" placeholder='What are you looking for?' className=' h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4' />
                            </div>
                            <div className="list-nav mt-6">
                                <ul>
                                    <li
                                        className={`${openSubNavMobile === 1 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(1)}
                                    >
                                        <a href={'/shop'} className={`text-xl font-semibold flex items-center justify-between`}>STORE
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                       </li>
                                    <li
                                        className={`${openSubNavMobile === 2 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(2)}
                                    >
                                        <a href={'/notice/NoticeListPage'} className='text-xl font-semibold flex items-center justify-between mt-5'>NOTICE
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                    </a>
                                    </li>
                                     
                                    <li
                                        className={`${openSubNavMobile === 3 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(3)}
                                    >
                                        <a href={'/event/EventListPage'} className='text-xl font-semibold flex items-center justify-between mt-5'>EVENT
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                       </li>
                                    <li
                                        className={`${openSubNavMobile === 4 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(4)}
                                    >
                                        <a href={'/faqs/FaQsListPage'} className='text-xl font-semibold flex items-center justify-between mt-5'>FAQ
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                       </li> 
                            
                                    <li
                                        className={`${openSubNavMobile === 5 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(5)}
                                    >
                                        <a href={'/pages/RegisterStore'} className='text-xl font-semibold flex items-center justify-between mt-5'>REGISTER STORE
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                
                           
                                    </li>

                                    {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_OWNER') && (
                                 <li
                                        className={`${openSubNavMobile === 3 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(6)}
                                    >
                                        <a href={'/pages/ManageStore'} className='text-xl font-semibold flex items-center justify-between mt-5'>MANAGE STORE
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                       </li>
                                )}
        

                                {(userRole === 'ROLE_ADMIN' || userRole === 'ROLE_OWNER') && (
                                 <li
                                        className={`${openSubNavMobile === 3 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(7)}
                                    >
                                        <a href={'/pages/dashboard'} className='text-xl font-semibold flex items-center justify-between mt-5'>DASHBOARD
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                       </li>
                                )}

                    
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MenuYoga