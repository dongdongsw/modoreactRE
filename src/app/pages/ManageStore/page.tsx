"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopNavOne from '@/components/Header/TopNav/TopNavOne';
import MenuYoga from '@/components/Header/Menu/MenuYoga';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer';

const ManageStoreRequestsPage = () => {
    const [storeRequests, setStoreRequests] = useState<Array<{
        id: number;
        name: string;
        address: string;
        detailAddress: string;
        phoneNumber: string;
        foodType: string;
        imageUrl: string;
        description: string;
        companyId: string;
        isEditing: boolean;
    }>>([]);

    useEffect(() => {
        axios.get('/api/stores/requests')
            .then(response => {
                setStoreRequests(response.data);
            })
            .catch(error => {
                console.error('가게 등록 요청 목록을 불러오는 중 오류가 발생했습니다.', error);
            });
    }, []);

    const handleApprove = (requestId: number) => {
        axios.put(`/api/stores/approve/${requestId}`)
            .then(response => {
                alert('가게 등록이 승인되었습니다.');
                setStoreRequests(storeRequests.filter(request => request.id !== requestId));
            })
            .catch(error => {
                console.error('가게 등록 승인 중 오류가 발생했습니다.', error);
                alert('가게 등록 승인 중 오류가 발생했습니다.');
            });
    };

    const handleReject = (requestId: number) => {
        // 가게 등록 거절 로직을 여기에 추가합니다.
        alert(`가게 등록 요청 ID ${requestId}가 거절되었습니다.`);
    };

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuYoga />
                <Breadcrumb heading='ManageStore' subHeading='ManageStore' />
            </div>
    
            <div className="manage-store-requests-container md:py-20 py-10 ">
                <div className="container ">
                <div className="md:mt-6 mt-4">
                <h5 className="heading5">가게 등록 요청 관리 페이지</h5>
                <div className="body1 text-secondary2 mt-3">Manage Store Page.</div>
                    <table className="w-full">
                        <thead className="border-b border-line">
                            <tr>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">가게 이름</th>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">음식 종류</th>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">주소</th>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">전화번호</th>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">설명</th>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">업체 ID</th>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">승인</th>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">거절</th>
                            </tr>
                        </thead>
                        <tbody>
                            {storeRequests.length > 0 ? (
                                storeRequests.map(request => (
                                    <tr
                                        key={request.id}
                                        className="border-b border-line cursor-pointer hover:bg-gray-50"
                                    >   <th className='py-3 text-left'>
                                        <td className="py-3 text-left text-sm px-2">{request.name}</td>
                                        </th>
                                        <th className='py-3 text-left'>
                                        <td className="py-3 text-left text-sm px-2">{request.foodType}</td></th>
                                        <th className='py-3 text-left'>                                       
                                             <td className="py-3 text-left text-sm px-2">{request.address}</td>
                                        </th>
                                        
                                        <th className='py-3 text-left'>
                                        <td className="py-3 text-left text-sm px-2">{request.phoneNumber}</td></th>
                                        <th className='py-3 text-left'>
                                        <td className="py-3 text-left text-sm px-2">{request.description}</td></th>
                                        <th className='py-3 text-left'>
                                        <td className="py-3 text-left text-sm px-2">{request.companyId}</td></th>
                                        <div className="flex justify-center items-center h-full">
                                        <td className="px-2 text-center">
                                            <button onClick={() => handleApprove(request.id)} className="flex items-center space-x-2 text-yellow-600">
                                                <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-success text-success caption1 font-semibold">
                                                    승인
                                                </span>
                                            </button>
                                        </td>
                                        <th className='py-3 text-left'>
                                        <td className="py-3 text-left text-sm px-2">
                                            <button onClick={() => handleReject(request.id)} className="flex items-center space-x-2 text-red-600">
                                                <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-red text-red caption1 font-semibold">
                                                    거절
                                                </span>
                                            </button>
                                        </td>
                                        </th>
                                        </div>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-3 text-center text-sm">가게 등록 요청이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};    

export default ManageStoreRequestsPage;
