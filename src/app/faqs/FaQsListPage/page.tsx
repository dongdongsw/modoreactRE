'use client'
import React, { useState, useEffect  } from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuYoga from '@/components/Header/Menu/MenuYoga'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation'


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
    const [editingQanda, setEditingQanda] = useState<{ id: string; title: string; content: string } | null>(null);

    const router = useRouter();  


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

     // Q&A 삭제 함수
     const handleDelete = (id: string) => {
        axios.delete(`/api/qanda/${id}`)
            .then(() => {
                setQandas(prevQandas => prevQandas.filter(qanda => qanda.id !== id));
            })
            .catch(error => {
                console.error('Error deleting Q&A:', error);
            });
    };

    // 수정 버튼 클릭 시 Q&A 항목 수정 모드로 전환
    const handleEdit = (qanda: Qanda) => {
        setEditingQanda({ id: qanda.id, title: qanda.title, content: qanda.content });
    };

    // 수정 내용 저장 함수
    const handleSaveEdit = () => {
        if (editingQanda) {
            const formData = new FormData();
    
            // board 파트로 JSON 데이터 전송
            formData.append("board", new Blob([JSON.stringify({
                title: editingQanda.title,
                content: editingQanda.content,
                // 필요 시 다른 필드 추가
            })], { type: "application/json" }));
    
            
    
            axios.put(`/api/qanda/${editingQanda.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(() => {
                setQandas(prevQandas => prevQandas.map(qanda =>
                    qanda.id === editingQanda.id ? { ...qanda, ...editingQanda } : qanda
                ));
                setEditingQanda(null); // 수정 모드 종료
            })
            .catch(error => console.error('Error updating Q&A:', error));
        }
    };
    

    const handleCancelEdit = () => {
        setEditingQanda(null);
    };


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
                                        {editingQanda && editingQanda.id === qanda.id ? (
                                        <div className="edit-mode">
                                            <input
                                                type="text"
                                                value={editingQanda.title}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, title: e.target.value })}
                                                className="input-main w-full mb-4"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <textarea
                                                value={editingQanda.content}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, content: e.target.value })}
                                                className="textarea-main w-full h-40"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <div className="flex gap-3 mt-4">
                                                <button className="button-main" onClick={handleSaveEdit}>저장</button>
                                                <button className="button-secondary" onClick={handleCancelEdit}>취소</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="heading flex items-center justify-between gap-6">
                                                <div className="heading6">{qanda.title}</div>
                                                <Icon.CaretRight size={24} />
                                            </div>
                                            {visibleContent[qanda.id] && (
                                                <div className="content body1 text-secondary mt-3">
                                                    {qanda.content}
                                                </div>
                                            )}
                                            {userRole === 'ROLE_ADMIN' && (
                                                <div className="flex gap-3 mt-10 justify-end">
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(qanda);
                                                    }}>수정</button>
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(qanda.id);
                                                    }}>삭제</button>
                                                </div>
                                            )}
                                        </>
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
                                        <div className="heading flex items-right justify-between gap-6 mt-3">
                                        <div> </div>
                                        {userRole === 'ROLE_ADMIN' && (
                                                <button
                                                    className="button-main"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // 삭제 버튼 클릭 시 Q&A 표시 토글을 막음
                                                        handleDelete(qanda.id);
                                                    }}
                                                >
                                                    삭제
                                                </button>
                                            )}
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
                                        {editingQanda && editingQanda.id === qanda.id ? (
                                        <div className="edit-mode">
                                            <input
                                                type="text"
                                                value={editingQanda.title}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, title: e.target.value })}
                                                className="input-main w-full mb-4"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <textarea
                                                value={editingQanda.content}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, content: e.target.value })}
                                                className="textarea-main w-full h-40"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <div className="flex gap-3 mt-4">
                                                <button className="button-main" onClick={handleSaveEdit}>저장</button>
                                                <button className="button-secondary" onClick={handleCancelEdit}>취소</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="heading flex items-center justify-between gap-6">
                                                <div className="heading6">{qanda.title}</div>
                                                <Icon.CaretRight size={24} />
                                            </div>
                                            {visibleContent[qanda.id] && (
                                                <div className="content body1 text-secondary mt-3">
                                                    {qanda.content}
                                                </div>
                                            )}
                                            {userRole === 'ROLE_ADMIN' && (
                                                <div className="flex gap-3 mt-10 justify-end">
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(qanda);
                                                    }}>수정</button>
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(qanda.id);
                                                    }}>삭제</button>
                                                </div>
                                            )}
                                        </>
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
                                        {editingQanda && editingQanda.id === qanda.id ? (
                                        <div className="edit-mode">
                                            <input
                                                type="text"
                                                value={editingQanda.title}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, title: e.target.value })}
                                                className="input-main w-full mb-4"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <textarea
                                                value={editingQanda.content}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, content: e.target.value })}
                                                className="textarea-main w-full h-40"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <div className="flex gap-3 mt-4">
                                                <button className="button-main" onClick={handleSaveEdit}>저장</button>
                                                <button className="button-secondary" onClick={handleCancelEdit}>취소</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="heading flex items-center justify-between gap-6">
                                                <div className="heading6">{qanda.title}</div>
                                                <Icon.CaretRight size={24} />
                                            </div>
                                            {visibleContent[qanda.id] && (
                                                <div className="content body1 text-secondary mt-3">
                                                    {qanda.content}
                                                </div>
                                            )}
                                            {userRole === 'ROLE_ADMIN' && (
                                                <div className="flex gap-3 mt-10 justify-end">
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(qanda);
                                                    }}>수정</button>
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(qanda.id);
                                                    }}>삭제</button>
                                                </div>
                                            )}
                                        </>
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
                                        {editingQanda && editingQanda.id === qanda.id ? (
                                        <div className="edit-mode">
                                            <input
                                                type="text"
                                                value={editingQanda.title}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, title: e.target.value })}
                                                className="input-main w-full mb-4"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <textarea
                                                value={editingQanda.content}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, content: e.target.value })}
                                                className="textarea-main w-full h-40"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <div className="flex gap-3 mt-4">
                                                <button className="button-main" onClick={handleSaveEdit}>저장</button>
                                                <button className="button-secondary" onClick={handleCancelEdit}>취소</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="heading flex items-center justify-between gap-6">
                                                <div className="heading6">{qanda.title}</div>
                                                <Icon.CaretRight size={24} />
                                            </div>
                                            {visibleContent[qanda.id] && (
                                                <div className="content body1 text-secondary mt-3">
                                                    {qanda.content}
                                                </div>
                                            )}
                                            {userRole === 'ROLE_ADMIN' && (
                                                <div className="flex gap-3 mt-10 justify-end">
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(qanda);
                                                    }}>수정</button>
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(qanda.id);
                                                    }}>삭제</button>
                                                </div>
                                            )}
                                        </>
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
                                        {editingQanda && editingQanda.id === qanda.id ? (
                                        <div className="edit-mode">
                                            <input
                                                type="text"
                                                value={editingQanda.title}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, title: e.target.value })}
                                                className="input-main w-full mb-4"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <textarea
                                                value={editingQanda.content}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, content: e.target.value })}
                                                className="textarea-main w-full h-40"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <div className="flex gap-3 mt-4">
                                                <button className="button-main" onClick={handleSaveEdit}>저장</button>
                                                <button className="button-secondary" onClick={handleCancelEdit}>취소</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="heading flex items-center justify-between gap-6">
                                                <div className="heading6">{qanda.title}</div>
                                                <Icon.CaretRight size={24} />
                                            </div>
                                            {visibleContent[qanda.id] && (
                                                <div className="content body1 text-secondary mt-3">
                                                    {qanda.content}
                                                </div>
                                            )}
                                            {userRole === 'ROLE_ADMIN' && (
                                                <div className="flex gap-3 mt-10 justify-end">
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(qanda);
                                                    }}>수정</button>
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(qanda.id);
                                                    }}>삭제</button>
                                                </div>
                                            )}
                                        </>
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
                                        {editingQanda && editingQanda.id === qanda.id ? (
                                        <div className="edit-mode">
                                            <input
                                                type="text"
                                                value={editingQanda.title}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, title: e.target.value })}
                                                className="input-main w-full mb-4"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <textarea
                                                value={editingQanda.content}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, content: e.target.value })}
                                                className="textarea-main w-full h-40"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <div className="flex gap-3 mt-4">
                                                <button className="button-main" onClick={handleSaveEdit}>저장</button>
                                                <button className="button-secondary" onClick={handleCancelEdit}>취소</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="heading flex items-center justify-between gap-6">
                                                <div className="heading6">{qanda.title}</div>
                                                <Icon.CaretRight size={24} />
                                            </div>
                                            {visibleContent[qanda.id] && (
                                                <div className="content body1 text-secondary mt-3">
                                                    {qanda.content}
                                                </div>
                                            )}
                                            {userRole === 'ROLE_ADMIN' && (
                                                <div className="flex gap-3 mt-10 justify-end">
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(qanda);
                                                    }}>수정</button>
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(qanda.id);
                                                    }}>삭제</button>
                                                </div>
                                            )}
                                        </>
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
                                        {editingQanda && editingQanda.id === qanda.id ? (
                                        <div className="edit-mode">
                                            <input
                                                type="text"
                                                value={editingQanda.title}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, title: e.target.value })}
                                                className="input-main w-full mb-4"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <textarea
                                                value={editingQanda.content}
                                                onChange={(e) => setEditingQanda({ ...editingQanda, content: e.target.value })}
                                                className="textarea-main w-full h-40"
                                                style={{
                                                    border: '1px solid #000000',
                                                    borderRadius: '7px'
                                                }}
                                            />
                                            <div className="flex gap-3 mt-4">
                                                <button className="button-main" onClick={handleSaveEdit}>저장</button>
                                                <button className="button-secondary" onClick={handleCancelEdit}>취소</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="heading flex items-center justify-between gap-6">
                                                <div className="heading6">{qanda.title}</div>
                                                <Icon.CaretRight size={24} />
                                            </div>
                                            {visibleContent[qanda.id] && (
                                                <div className="content body1 text-secondary mt-3">
                                                    {qanda.content}
                                                </div>
                                            )}
                                            {userRole === 'ROLE_ADMIN' && (
                                                <div className="flex gap-3 mt-10 justify-end">
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(qanda);
                                                    }}>수정</button>
                                                    <button className="button-main" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(qanda.id);
                                                    }}>삭제</button>
                                                </div>
                                            )}
                                        </>
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
   

        
    )
}

export default Faqs