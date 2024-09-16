import React from 'react';
import { Moon } from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icon from "@phosphor-icons/react/dist/ssr";

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
}

const UserInfo: React.FC<TabButtonProps> = ({ isActive, onClick }) => {
    return (
        <div
            className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <Icon.LockKeyOpen size={20} />
            <strong className="heading6">개인정보</strong>
        </div>
    );
};

const UserInfoContent: React.FC = () => {
    return (
        <div className="list p-10">
            <h5 className="heading5">Items</h5>
            <div className="list_prd">
                {/* 첫 번째 상품 항목 */}
                <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                    <Link href={'/product/default'} className="flex items-center gap-5"> {/* a 태그 대신 Link 바로 사용 */}
                        <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                            <Image
                                src={'/images/product/1000x1000.png'}
                                width={1000}
                                height={1000}
                                alt={'Contrasting sheepskin sweatshirt'}
                                className='w-full h-full object-cover'
                            />
                        </div>
                        <div>
                            <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                            <div className="caption1 text-secondary mt-2">
                                <span className="prd_size uppercase">XL</span>
                                <span>/</span>
                                <span className="prd_color capitalize">Yellow</span>
                            </div>
                        </div>
                    </Link>
                    <div className='text-title'>
                        <span className="prd_quantity">1</span>
                        <span> X </span>
                        <span className="prd_price">$45.00</span>
                    </div>
                </div>

                {/* 두 번째 상품 항목 */}
                <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                    <Link href={'/product/default'} className="flex items-center gap-5"> {/* a 태그 대신 Link 바로 사용 */}
                        <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                            <Image
                                src={'/images/product/1000x1000.png'}
                                width={1000}
                                height={1000}
                                alt={'Contrasting sheepskin sweatshirt'}
                                className='w-full h-full object-cover'
                            />
                        </div>
                        <div>
                            <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                            <div className="caption1 text-secondary mt-2">
                                <span className="prd_size uppercase">XL</span>
                                <span>/</span>
                                <span className="prd_color capitalize">White</span>
                            </div>
                        </div>
                    </Link>
                    <div className='text-title'>
                        <span className="prd_quantity">2</span>
                        <span> X </span>
                        <span className="prd_price">$70.00</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
export { UserInfoContent };
