'use client'
import React, { useState, useEffect  } from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuYoga from '@/components/Header/Menu/MenuYoga'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import axios from 'axios';
import Link from 'next/link';

// Q&A 데이터 타입 정의
interface Qanda {
    id: string;
    title: string;
    content: string;
    category: string; // Q&A 항목에 대한 카테고리 필드 추가
}

const Faqs = () => {
    const [activeTab, setActiveTab] = useState<string | undefined>('주문 및 결제')
    const [activeQuestion, setActiveQuestion] = useState<string | undefined>('')
    const [qandas, setQandas] = useState<Qanda[]>([]); // Qanda[] 타입으로 상태를 정의
    const [visibleContent, setVisibleContent] = useState<{ [key: string]: boolean }>({}); // 각 Q&A의 표시 상태를 관리하는 객체
    const [userRole, setUserRole] = useState('');

    // API 호출: Q&A와 사용자 역할 가져오기
    useEffect(() => {
        axios.get('/api/qanda')
            .then(response => {
                console.log(response.data); // Q&A 데이터를 콘솔에 출력하여 구조 확인
                setQandas(response.data);
            })
            .catch(error => {
                console.error('Q&A 목록을 가져오는 중 오류 발생:', error);
            });

        axios.get('/login/user/role')
            .then(response => {
                const { role } = response.data;
                setUserRole(role);
                console.log('User role:', role);
            })
            .catch(error => {
                console.error('Error fetching user role:', error);
            });
    }, []);

    // 콘텐츠 표시/숨김 토글 함수
    const toggleContentVisibility = (id: string) => {
        setVisibleContent(prevState => ({
            ...prevState,
            [id]: !prevState[id], // Q&A 항목의 표시 여부를 토글
        }));
    };

    const handleActiveTab = (tab: string) => {
        setActiveTab(tab);
    };

    // 탭에 따라 Q&A 필터링
    const filteredQandas = qandas.filter(qanda => {
        switch (activeTab) {
            case '주문 및 결제':
                return qanda.category === 'order or pay';
            case '결제 방법':
                return qanda.category === 'pay method';
            case '배달 및 수령':
                return qanda.category === 'delivery';
            case '환불 및 교환':
                return qanda.category === 'refund or exchange';
            case '회원가입 및 로그인':
                return qanda.category === 'register or login';
            case '예약 및 취소':
                return qanda.category === 'reservation or cancel';
            case '매장 관련':
                return qanda.category === 'deposits';
            case '기타':
                return qanda.category === 'etc';
            default:
                return false;
        }
    });

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuYoga/>
                <Breadcrumb heading='FAQs' subHeading='FAQs' />
            </div>
            {userRole === 'ROLE_ADMIN' &&
            <div className="flex justify-center md:py-8">
            <Link href="/faqs/FaQsForm" className='text-secondary duration-300'>
                <button className="button-main">새로운 FaQs 작성</button>
                </Link>
                </div>
                }
                
            <div className='faqs-block md:py-20 py-10'>
                <div className="container">
                    <div className="flex justify-between">
                        <div className="left w-1/4">
                            <div className="menu-tab flex flex-col gap-5">
                                {[
                                    '주문 및 결제', '결제 방법', '배달 및 수령', '환불 및 교환', '회원가입 및 로그인', '예약 및 취소', '매장 관련', '기타'
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className={`tab-item inline-block w-fit heading6 has-line-before text-secondary2 hover:text-black duration-300 ${activeTab === item ? 'active' : ''}`}
                                        onClick={() => handleActiveTab(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="right w-2/3">
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === '주문 및 결제' ? 'active' : ''}`}>
                                {filteredQandas.map(qanda => (
                                    <div
                                        key={qanda.id}
                                        className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${visibleContent[qanda.id] ? 'open' : ''}`}
                                        onClick={() => toggleContentVisibility(qanda.id)}
                                    >
                                        <div className="heading flex items-center justify-between gap-6">
                                            <div className="heading6">{qanda.title}</div>
                                            <Icon.CaretRight size={24} />
                                        </div>
                                        {visibleContent[qanda.id] && (
                                            <div className="content body1 text-secondary">
                                                {qanda.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className={`tab-question flex flex-col gap-5 ${activeTab === '결제 방법' ? 'active' : ''}`}>
                                {filteredQandas.map(qanda => (
                                    <div
                                        key={qanda.id}
                                        className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${visibleContent[qanda.id] ? 'open' : ''}`}
                                        onClick={() => toggleContentVisibility(qanda.id)}
                                    >
                                        <div className="heading flex items-center justify-between gap-6">
                                            <div className="heading6">{qanda.title}</div>
                                            <Icon.CaretRight size={24} />
                                        </div>
                                        {visibleContent[qanda.id] && (
                                            <div className="content body1 text-secondary">
                                                {qanda.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className={`tab-question flex flex-col gap-5 ${activeTab === '배달 및 수령' ? 'active' : ''}`}>
                                {filteredQandas.map(qanda => (
                                    <div
                                        key={qanda.id}
                                        className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${visibleContent[qanda.id] ? 'open' : ''}`}
                                        onClick={() => toggleContentVisibility(qanda.id)}
                                    >
                                        <div className="heading flex items-center justify-between gap-6">
                                            <div className="heading6">{qanda.title}</div>
                                            <Icon.CaretRight size={24} />
                                        </div>
                                        {visibleContent[qanda.id] && (
                                            <div className="content body1 text-secondary">
                                                {qanda.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className={`tab-question flex flex-col gap-5 ${activeTab === '환불 및 교환' ? 'active' : ''}`}>
                                {filteredQandas.map(qanda => (
                                    <div
                                        key={qanda.id}
                                        className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${visibleContent[qanda.id] ? 'open' : ''}`}
                                        onClick={() => toggleContentVisibility(qanda.id)}
                                    >
                                        <div className="heading flex items-center justify-between gap-6">
                                            <div className="heading6">{qanda.title}</div>
                                            <Icon.CaretRight size={24} />
                                        </div>
                                        {visibleContent[qanda.id] && (
                                            <div className="content body1 text-secondary">
                                                {qanda.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className={`tab-question flex flex-col gap-5 ${activeTab === '회원가입 및 로그인' ? 'active' : ''}`}>
                                {filteredQandas.map(qanda => (
                                    <div
                                        key={qanda.id}
                                        className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${visibleContent[qanda.id] ? 'open' : ''}`}
                                        onClick={() => toggleContentVisibility(qanda.id)}
                                    >
                                        <div className="heading flex items-center justify-between gap-6">
                                            <div className="heading6">{qanda.title}</div>
                                            <Icon.CaretRight size={24} />
                                        </div>
                                        {visibleContent[qanda.id] && (
                                            <div className="content body1 text-secondary">
                                                {qanda.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className={`tab-question flex flex-col gap-5 ${activeTab === '예약 및 취소' ? 'active' : ''}`}>
                                {filteredQandas.map(qanda => (
                                    <div
                                        key={qanda.id}
                                        className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${visibleContent[qanda.id] ? 'open' : ''}`}
                                        onClick={() => toggleContentVisibility(qanda.id)}
                                    >
                                        <div className="heading flex items-center justify-between gap-6">
                                            <div className="heading6">{qanda.title}</div>
                                            <Icon.CaretRight size={24} />
                                        </div>
                                        {visibleContent[qanda.id] && (
                                            <div className="content body1 text-secondary">
                                                {qanda.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === '매장 관련' ? 'active' : ''}`}>
                                {filteredQandas.map(qanda => (
                                    <div
                                        key={qanda.id}
                                        className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${visibleContent[qanda.id] ? 'open' : ''}`}
                                        onClick={() => toggleContentVisibility(qanda.id)}
                                    >
                                        <div className="heading flex items-center justify-between gap-6">
                                            <div className="heading6">{qanda.title}</div>
                                            <Icon.CaretRight size={24} />
                                        </div>
                                        {visibleContent[qanda.id] && (
                                            <div className="content body1 text-secondary">
                                                {qanda.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === '기타' ? 'active' : ''}`}>
                                {filteredQandas.map(qanda => (
                                    <div
                                        key={qanda.id}
                                        className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${visibleContent[qanda.id] ? 'open' : ''}`}
                                        onClick={() => toggleContentVisibility(qanda.id)}
                                    >
                                        <div className="heading flex items-center justify-between gap-6">
                                            <div className="heading6">{qanda.title}</div>
                                            <Icon.CaretRight size={24} />
                                        </div>
                                        {visibleContent[qanda.id] && (
                                            <div className="content body1 text-secondary">
                                                {qanda.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
   

        /*<>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='FAQs' subHeading='FAQs' />
            </div>
            <div className='faqs-block md:py-20 py-10'>
                <div className="container">
                    <div className="flex justify-between">
                        <div className="left w-1/4">
                            <div className="menu-tab flex flex-col gap-5">
                                {[
                                    'how to buy', 'payment methods', 'delivery', 'exchanges & returns', 'registration', 'look after your garments', 'contacts'
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className={`tab-item inline-block w-fit heading6 has-line-before text-secondary2 hover:text-black duration-300 ${activeTab === item ? 'active' : ''}`}
                                        onClick={() => handleActiveTab(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="right w-2/3">
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === 'how to buy' ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '1' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('1')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === 'payment methods' ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === 'delivery' ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '1' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('1')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === 'exchanges & returns' ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === 'registration' ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '1' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('1')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === 'look after your garments' ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === 'contacts' ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '1' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('1')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">How does COVID-19 affect my online orders and store purchases?</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">NEW! Plus sizes for Woman</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">The courier companies have adapted their procedures to guarantee the safety of our employees and our community. We thank you for your patience, as there may be some delays to deliveries.
                                        We remind you that you can still find us at Mango.com and on all our online channels. Our customer services are still there for you, to answer any questions you may have, although due to the current situation, we are operating with longer waiting times.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>*/
    )
}

export default Faqs