import React from 'react';
import Image from 'next/image';

const WhyChooseUs = () => {
    return (
        <div className="why-choose-us md:pt-4 pt-20">
            <div className="container">
                <div className="content flex max-lg:flex-col items-center justify-between gap-y-8 p-20">
                    <div className="left lg:w-1/2 sm:w-2/3 w-full lg:pr-4">
                        <Image
                            src={'/images/banner/Why.jpg'}
                            width={2000} // 이미지의 실제 너비
                            height={2000} // 이미지의 실제 높이
                            alt='bg'
                            layout='intrinsic' // 원래 비율을 유지
                            className='rounded-2xl object-cover w-full h-full' // 정사각형에 맞게 조정
                        />
                    </div>
                    <div className="right lg:w-1/2 lg:pl-16 flex flex-col justify-start">
                        <div className="heading4">왜 모도모도일까요?</div>
                        <div className="list-feature mt-1 pt-6">
                            <div className="item pb-3 border-b border-line">
                                <div className="body1 font-semibold uppercase">• 신선한 재료</div>
                                <div className="flex items-center mt-1 text-gray-600">
                                    <span className="text-secondary mt-2">전문가가 선별한 신선한 재료로 도시락을 준비합니다.</span>
                                </div>
                            </div>
                            <div className="item pb-3 border-b border-line mt-3">
                                <div className="body1 font-semibold uppercase">• 건강한 선택</div>
                                <div className="flex items-center mt-1 text-gray-600">
                                    <span className="text-secondary mt-2">영양을 고려한 균형 잡힌 메뉴로 건강한 식사를 제공합니다.</span>
                                </div>
                            </div>
                            <div className="item pb-3 border-line mt-3">
                                <div className="body1 font-semibold uppercase">• 차별화된 예약 시스템</div>
                                <div className="flex items-center mt-1 text-gray-600">
                                    <span className="text-secondary mt-2">원하는 시간과 날짜에 맞춰 도시락을 예약하실 수 있습니다.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;
