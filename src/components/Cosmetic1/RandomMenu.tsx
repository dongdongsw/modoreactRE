import React, { useEffect, useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from "next/link";

interface RandomMenuProps {
    data: {
        id: string;
        companyId?: string;
        name: string;
        price: number;
        imageUrl?: string;
    }[];
    start: number;
    limit: number;
}

const RandomMenu: React.FC<RandomMenuProps> = ({ data, start, limit }) => {
    const [products, setProducts] = useState<any[]>(data.slice(start, start + limit));
    const [storeNames, setStoreNames] = useState<{ [key: string]: string }>({});
    const [externalId, setExternalId] = useState<string | null>(null);
    const [hoveredImage, setHoveredImage] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch('/menus/random')
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    setProducts(data);
                    data.forEach((product: any) => {
                        fetch(`/api/stores/${product.companyId}/name`)
                            .then(response => response.text())
                            .then(storeName => {
                                setStoreNames(prev => ({
                                    ...prev,
                                    [product.companyId]: storeName
                                }));
                            })
                            .catch(error => console.error('Error fetching store name:', error));
                    });
                } else {
                    setError('등록된 메뉴가 없습니다.');
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);


    useEffect(() => {
        fetch('/login/user/externalId', {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.ok ? response.text() : Promise.reject('External ID not found'))
            .then(data => setExternalId(data))
            .catch(error => {
                console.error('Error fetching externalId:', error);
                setExternalId(null);
            });
    }, []);

    const addToCart = (product: any, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!externalId) {
            alert('로그인 후 진행해주세요.');
            return;
        }

        const { id: merchanUid, companyId, name, price, imageUrl } = product;

        fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                merchanUid,
                companyId,
                name,
                price: price.toString(),
                imageUrl,
                externalId,
            }).toString(),
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('성공적으로 담겼습니다.');
                } else {
                    console.error('Failed to add product to cart.');
                }
            })
            .catch(error => {
                console.error('Error adding product to cart:', error);
            });
    };

    const goToStore = (companyId: string) => {
        fetch(`/api/stores/${companyId}/id`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Store ID not found');
                }
                return response.json();
            })
            .then(storeId => {
                router.push(`/store/${storeId}`);
            })
            .catch(error => {
                console.error('Error fetching store ID:', error);
            });
    };


    return (
        <div className="lookbook-block cos1 bg-surface md:py-20 py-10 md:mt-20 mt-10">
            <div className="container lg:flex items-center">
                <div className="heading lg:w-1/4 lg:pr-[15px] max-lg:pb-8">
                    <div className="heading5 md:pb-5 pb-3" >
                        오늘의 추천 메뉴,<br />
                        고민 없이 선택해보세요!
                    </div>

                    <Link href={'/shop'} className='text-button pb-1 border-b-2 border-black duration-300 hover:border-green'>구경하기</Link>
                </div>
                <div className="list-product hide-product-sold lg:w-3/4 lg:pl-[15px]">
                    <div className={`list-product grid lg:grid-cols-3 sm:grid-cols-3 grid-cols-1 sm:gap-[30px] gap-[20px] mt-7`}>
                        {error ? (
                            <div className='text-center col-span-full mt-4'>{error}</div>
                        ) : products.length ? (
                            products.map(product => (
                                <div
                                    key={product.id}
                                    className="product-main cursor-pointer block"
                                    onClick={() => goToStore(product.companyId)}
                                >
                                    <div className="relative overflow-hidden rounded-2xl">
                                        <div
                                            className="product-img w-full overflow-hidden relative group"
                                            onMouseEnter={() => setHoveredImage(product.id)}
                                            onMouseLeave={() => setHoveredImage(null)}
                                        >
                                            <div className="product-tag text-button-uppercase bg-green px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
                                                {storeNames[product.companyId] || 'Loading...'}
                                            </div>
                                            <img
                                                alt={product.name}
                                                className="w-full h-full object-cover duration-700"
                                                src={product.imageUrl}
                                                style={{
                                                    aspectRatio: '3 / 4',
                                                    height: 'auto',
                                                    transform: hoveredImage === product.id ? 'scale(1.05)' : 'scale(1)',
                                                    transition: 'transform 0.2s ease',
                                                    borderRadius: '10px',
                                                }}
                                            />
                                            <div className="list-action-right absolute top-2 right-2 z-[2] invisible group-hover:visible">
                                                <div className="add-cart-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-200">
                                                    <div
                                                        className="w-[16px] h-[16px] flex items-center justify-center cursor-pointer"
                                                        onClick={(e) => addToCart(product, e)}
                                                    >
                                                        <FaShoppingBag color="currentColor" size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="product-info py-4 px-5">
                                            <div className="product-title text-body4 font-semibold text-main text-center">
                                                {product.name}
                                            </div>
                                            <div className="product-price text-title text-center">
                                                {product.price.toLocaleString()}원
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='text-center col-span-full mt-4'>등록된 메뉴가 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RandomMenu;
