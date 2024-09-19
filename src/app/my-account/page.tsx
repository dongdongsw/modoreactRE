'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import MenuOne from '@/components/Header/Menu/MenuOne';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer';
import UserInfo, { UserInfoContent } from './UserInfo'; // DashboardContent 임포트
import PaymentHistory, { PaymentHistoryContent } from './PaymentHistory';
import CartItems, {CartContent} from './CartItems'; // MyAddressContent를 임포트합니다
import Logout from './Logout';
import FavoriteStores, { FavoriteStoresContent } from "@/app/my-account/FavoriteStores";
import { toast } from 'react-toastify'; // Add toast notification library
import {useRouter} from "next/navigation";
import MenuYoga from "@/components/Header/Menu/MenuYoga";

const MyAccount = () => {
    const [activeTab, setActiveTab] = useState<string>('userinfo');
    const [nickname, setNickname] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter(); // Initialize router

    const handleActiveTab = async (tab: string) => {
        if (tab === 'logout') {
            try {
                const response = await axios.get('/login/logout');
                if (response.data.message === '로그아웃 되었습니다.') {
                    toast.success('로그아웃 되었습니다.');
                    router.push('/');
                } else {
                    toast.error('로그아웃 실패. 다시 시도해 주세요.');
                }
            } catch (error) {
                toast.error('로그아웃 중 오류가 발생했습니다.');
            }
        } else {
            setActiveTab(tab);
        }
    };
    useEffect(() => {
        axios.get('/login/user/nickname')
            .then(response => {
                const user = response.data;
                if (user && typeof user === 'object' && user.nickname) {
                    setNickname(user.nickname);
                    setIsAuthenticated(true);
                } else {
                    setNickname('');
                    setIsAuthenticated(false);
                }
            })
            .catch(error => {
                if (error instanceof Error) {
                    console.error('Error fetching nickname:', error.message);
                }
                setNickname('');
                setIsAuthenticated(false);
            });
    }, []);

    return (
        <>
            <div id="header" className='relative w-full'>
                <MenuYoga props="bg-transparent" />
                <Breadcrumb heading='My Account' subHeading='My Account' />
            </div>
            <div className="profile-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col w-full">
                        <div className="left md:w-1/3 w-full xl:pr-[3.125rem] lg:pr-[28px] md:pr-[16px]">
                            <div className="user-infor bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                                <div className="heading flex flex-col items-center justify-center">
                                    <div className="avatar">
                                        <Image
                                            src={'/images/avatar/1.png'}
                                            width={300}
                                            height={300}
                                            alt='avatar'
                                            className='md:w-[140px] w-[120px] md:h-[140px] h-[120px] rounded-full'
                                        />
                                    </div>
                                    <div className="name heading6 mt-4 text-center">{nickname}</div>
                                    <div className="mail heading6 font-normal normal-case text-secondary text-center mt-1">님 환영합니다!</div>
                                </div>
                                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                                    <UserInfo
                                        isActive={activeTab === 'userinfo'}
                                        onClick={() => handleActiveTab('userinfo')}
                                    />
                                    <PaymentHistory
                                        isActive={activeTab === 'pay'}
                                        onClick={() => handleActiveTab('orders')}
                                    />
                                    <CartItems
                                        isActive={activeTab === 'cart'}
                                        onClick={() => handleActiveTab('cart')}
                                    />
                                    <FavoriteStores
                                        isActive={activeTab === 'favorive'}
                                        onClick={() => handleActiveTab('favorite')}
                                    />
                                    <Logout
                                        isActive={activeTab === 'logout'}
                                        onClick={() => handleActiveTab('logout')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="right md:w-2/3 w-full">
                            {activeTab === 'userinfo' && <UserInfoContent />}
                            {activeTab === 'orders' && <PaymentHistoryContent />}
                            {activeTab === 'cart' && <CartContent />}
                            {activeTab === 'favorite' && <FavoriteStoresContent />}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyAccount;