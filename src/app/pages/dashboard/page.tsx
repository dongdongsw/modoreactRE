'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { OrderNowContent } from '@/app/pages/dashboard/OrderNow';
import { MenuContent } from '@/app/pages/dashboard/Menu';
import { ReviewContent } from '@/app/pages/dashboard/Review';
import { AssignmentContent } from '@/app/pages/dashboard/Assignment';
import { RestDayContent } from '@/app/pages/dashboard/RestDay';
import Image from 'next/image';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import MenuYoga from "@/components/Header/Menu/MenuYoga";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<string>('ordernow');
    const [hoveredTab, setHoveredTab] = useState<string | null>(null); // Hovered tab state
    const [storeName, setStoreName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleActiveTab = (tab: string) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchStoreName = async () => {
            try {
                const response = await axios.get('/api/stores/my-store-name');
                setStoreName(response.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data || 'An error occurred while fetching the store name');
                } else {
                    setError('An unknown error occurred');
                }
            }
        };

        fetchStoreName();
    }, []);

    const tabItems = [
        { key: 'ordernow', label: '주문현황', icon: <Icon.ShoppingCart size={20} /> },
        { key: 'menu', label: '메뉴 관리', icon: <Icon.ShoppingBag size={20} /> },
        { key: 'review', label: '리뷰', icon: <Icon.Star size={20} /> },
        { key: 'assignment', label: '가게 관리', icon: <Icon.Notepad size={20} /> },
        { key: 'resetday', label: '쉬는날', icon: <Icon.Calendar size={20} /> },
    ];

    return (
        <>
            <div id="header" className="relative w-full">
                <MenuYoga />
            </div>
            <div className="profile-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex w-full">
                        <div className="left md:w-1/5 w-full md:px-2">
                            <div
                                className="user-info lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl w-full h-full"
                                style={{ backgroundColor: '#333', height: '950px' }}
                            >
                                <div className="heading flex flex-col items-center justify-center">
                                    <div className="avatar">
                                        <Image
                                            src={'/images/avatar/personDash.png'}
                                            width={300}
                                            height={300}
                                            alt="avatar"
                                            className="md:w-[140px] w-[120px] md:h-[140px] h-[120px] rounded-full"
                                        />
                                    </div>
                                    <div className="name heading6 mt-4 text-center text-white">{storeName}</div>
                                    <div className="mail heading6 font-normal normal-case text-secondary text-center mt-1 text-gray-100">님 환영합니다!</div>
                                </div>
                                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                                    {tabItems.map(({ key, label, icon }) => (
                                        <div
                                            key={key}
                                            className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 
                                            ${
                                                activeTab === key
                                                    ? 'text-black bg-white'
                                                    : hoveredTab === key
                                                        ? 'text-black bg-white' // Hover styling
                                                        : 'text-white hover:bg-white hover:text-black'
                                            }`}
                                            onClick={() => handleActiveTab(key)}
                                            onMouseEnter={() => setHoveredTab(key)} // Set hovered tab
                                            onMouseLeave={() => setHoveredTab(null)} // Remove hovered tab
                                        >
                                            {React.cloneElement(icon, {
                                                color: activeTab === key || hoveredTab === key ? 'black' : 'white',
                                            })}
                                            <strong className={`heading6 ${activeTab === key || hoveredTab === key ? 'text-black' : 'text-white'}`}>
                                                {label}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="right md:w-4/5 w-full md:px-2">
                            {activeTab === 'ordernow' && <OrderNowContent />}
                            {activeTab === 'menu' && <MenuContent />}
                            {activeTab === 'review' && <ReviewContent />}
                            {activeTab === 'assignment' && <AssignmentContent />}
                            {activeTab === 'resetday' && <RestDayContent />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
