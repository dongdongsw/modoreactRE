import React from 'react';
import Image from 'next/image';

interface BrandItemProps {
    src: string;
    alt: string;
}

const BrandItem: React.FC<BrandItemProps> = ({ src, alt }) => (
    <div className="brand-item flex items-center justify-center w-[100px] h-[100px] bg-white rounded-[16px] overflow-hidden">
        <Image
            src={src}
            width={100}
            height={100}
            alt={alt}
            className='object-contain w-full h-full'
            loading="lazy"
            decoding="async"
        />
    </div>
);

const Brand: React.FC = () => {
    return (
        <div className="brand-block bg-surface md:py-[60px] py-[32px]">
            <div className="heading4 text-center mb-4">Modo와 함께하고 있는 납품업체</div>

            <div className="container">
                <div className="list-brand flex justify-between items-center gap-6">
                    <BrandItem src="/images/brand/kindergarden.jpg" alt="Kindergarden" />
                    <BrandItem src="/images/brand/kang.png" alt="Kang" />
                    <BrandItem src="/images/brand/gs.jpg" alt="GS" />
                    <BrandItem src="/images/brand/hyundai.jpg" alt="Hyundai" />
                    <BrandItem src="/images/brand/konkuk.png" alt="Konkuk" />
                </div>

            </div>
        </div>
    );
}

export default Brand;
