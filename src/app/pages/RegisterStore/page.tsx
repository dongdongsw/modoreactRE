'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TopNavOne from '@/components/Header/TopNav/TopNavOne';
import MenuYoga from '@/components/Header/Menu/MenuYoga';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import axios from 'axios'; // AxiosError import 추가

const RegisterStorePage = () => {
    const [storeInfo, setStoreInfo] = useState({
        id: null,
        name: '',
        address: '',
        detailAddress: '',
        phoneNumber: '',
        foodType: '',
        imageUrl: '',
        description: '',
        companyId: '',
        isEditing: true,
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    useEffect(() => {
        const loadDaumPostcodeScript = () => {
            const script = document.createElement('script');
            script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            script.onload = () => {
                console.log('다음 우편번호 스크립트가 로드되었습니다.');
            };
            script.onerror = () => {
                console.error('다음 우편번호 스크립트를 로드하는데 실패했습니다.');
            };
            document.body.appendChild(script);
        };

        loadDaumPostcodeScript();
    }, []);

    const execDaumPostcode = () => {
        if (!window.daum || !window.daum.Postcode) {
            console.error('다음 우편번호 서비스가 사용할 수 없습니다.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: function(data) {
                let addr = '';

                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress;
                } else {
                    addr = data.jibunAddress;
                }

                setStoreInfo(prevState => ({
                    ...prevState,
                    address: addr,
                    
                }));
            }
        }).open();
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setStoreInfo(prevState => ({ ...prevState, [name]: value }));
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedImage(event.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (selectedImage) {
            const formData = new FormData();
            formData.append('file', selectedImage);

            try {
                const response = await axios.post('/api/stores/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setStoreInfo(prevState => ({
                    ...prevState,
                    imageUrl: response.data,
                }));
                alert('이미지가 업로드되었습니다.');
            } catch (error) {
                // error가 AxiosError 타입인지 확인
                if (axios.isAxiosError(error)) {
                    console.error('이미지 업로드 중 오류가 발생했습니다:', error.response ? error.response.data : error.message);
                    alert('이미지 업로드 중 오류가 발생했습니다.');
                } else {
                    console.error('예상치 못한 오류가 발생했습니다:', error);
                    alert('예상치 못한 오류가 발생했습니다.');
                }
            }
        }
    };

    const handleSaveClick = async () => {
        try {
            if (!storeInfo.companyId) {
                throw new Error('가맹점 식별 코드가 누락되었습니다.');
            }

            const fullAddress = storeInfo.address + ' ' + (storeInfo.detailAddress || '');

            const url = storeInfo.id ? `/api/stores/${storeInfo.id}` : `/api/stores`;
            const method = storeInfo.id ? 'put' : 'post';

            const response = await axios({
                method,
                url,
                data: {
                    name: storeInfo.name,
                    address: fullAddress,
                    phoneNumber: storeInfo.phoneNumber,
                    foodType: storeInfo.foodType,
                    imageUrl: storeInfo.imageUrl,
                    description: storeInfo.description,
                    companyId: storeInfo.companyId
                }
            });

            setStoreInfo(prevState => ({
                ...response.data,
                isEditing: false,
                companyId: response.data.companyId
            }));

            alert('가게 정보가 저장되었습니다.');
            window.location.reload();
        } catch (error) {
            // error가 AxiosError 타입인지 확인
            if (axios.isAxiosError(error)) {
                console.error('가게 정보 저장 중 오류가 발생했습니다:', error.response ? error.response.data : error.message);
                alert('가게 정보 저장 중 오류가 발생했습니다.');
            } else {
                console.error('예상치 못한 오류가 발생했습니다:', error);
                alert('예상치 못한 오류가 발생했습니다.');
            }
        }
    };

    const imageUrl = storeInfo.imageUrl ? storeInfo.imageUrl : '';

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuYoga/>
                <Breadcrumb heading='Register Store' subHeading='Register Store' />
            </div>
    
            <div className='contact-us md:py-20 py-10'>
                <div className="container ">
                    <div className="md:mt-6 mt-4">
                        <div className="heading3">가게등록</div>
                        <div className="body1 text-secondary2 mt-3">가게 등록하는 페이지 입니다.</div>
                        <div className="store-name grid sm:grid-cols-2 grid-cols-1 gap-4 gap-y-5">
                            <p>
                                <strong>가게 이름:</strong>
                                <input className="store-input border-line px-4 py-3 w-full rounded-lg"
                                    type="text"
                                    name="name"
                                    value={storeInfo.name}
                                    onChange={handleInputChange}
                                    placeholder="Store Name *" 
                                    required
                                />
                            </p>
    
                            <p>
                                <strong>전화번호:</strong>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={storeInfo.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Phone number *" 
                                    required
                                    className="store-input border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                />
                            </p>
    
                            <div>
                                <p>
                                    <strong>가게 주소:</strong>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="address"
                                            value={storeInfo.address}
                                            readOnly
                                            placeholder="주소"
                                            className="store-input border-line px-4 pt-3 pb-3 w-full rounded-lg pr-20"
                                        />
                                        <button className="store-button-register button-main absolute top-1 bottom-1 right-1 flex items-center justify-center
">주소 검색</button>
                                    </div>
                                </p>
                                <p>
                                    <input
                                        type="text"
                                        name="detailAddress"
                                        value={storeInfo.detailAddress || ''}
                                        onChange={handleInputChange}
                                        placeholder="상세 주소"
                                        className="store-input border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                    />
                                </p>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                            <p>
                                <strong>음식 종류:</strong>
                                <input
                                    type="text"
                                    name="foodType"
                                    value={storeInfo.foodType}
                                    onChange={handleInputChange}
                                    required
                                    className="store-input border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                />
                            </p>
                            <p>
                                <strong>가맹점 식별 코드:</strong>
                                <input
                                    type="text"
                                    name="companyId"
                                    value={storeInfo.companyId}
                                    onChange={handleInputChange}
                                    placeholder="가맹점 식별 코드"
                                    required
                                    className="store-input border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                />
                            </p>
                        </div>

                            <div className="sm:col-span-2">
                            <p>
                                <strong>이미지:</strong>
                                <div className="relative flex items-center w-full rounded-lg border border-line">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="store-input border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                    />
                                    <button onClick={handleImageUpload}
                                    className="store-button-register button-main absolute top-1 bottom-1 right-1 flex items-center justify-center
">이미지업로드</button>
                                </div>
                            </p>
                        </div>


                        <div className="message sm:col-span-2">
                            <textarea
                                name="description"
                                value={storeInfo.description}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Your Message *"
                                className="store-textarea border-line px-4 pt-3 pb-3 w-full rounded-lg"
                            />
                        </div>
                    
                        <div className="form-button-group block-button md:mt-6 mt-4 sm:col-span-2">
                            <button
                                onClick={handleSaveClick}
                                className="store-button-register button-main"
                            >
                                Submit
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <Footer />
        </>
    );
    };
    
    export default RegisterStorePage;
    
    