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
    const router = useRouter(); // useRouter 훅 사용

    useEffect(() => {
        fetch('/menus/random')
            .then(response => response.json())
            .then(data => {
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
        e.stopPropagation(); // 클릭 이벤트 전파 방지
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

    const goToStore = (id: string) => {
        router.push(`/store/${id}`); // store로 이동
    };

    return (
        <div className="lookbook-block cos1 bg-surface md:py-20 py-10 md:mt-20 mt-10">
            <div className="container lg:flex items-center">
                <div className="heading lg:w-1/4 lg:pr-[15px] max-lg:pb-8">
                    <div className="heading3 md:pb-5 pb-3">A Full Meal, Packed with Care</div>
                    <Link href={'/shop/square'} className='text-button pb-1 border-b-2 border-black duration-300 hover:border-green'>Shop Now</Link>
                </div>
                <div className="list-product hide-product-sold lg:w-3/4 lg:pl-[15px]">
                    <div className={`list-product grid lg:grid-cols-3 sm:grid-cols-3 grid-cols-1 sm:gap-[30px] gap-[20px] mt-7`}>
                        {products.length ? (
                            products.map(product => (
                                <div
                                    key={product.id}
                                    className="product-main cursor-pointer block"
                                    onClick={() => goToStore(product.id)} // 사진을 클릭하면 스토어로 이동
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
                                                    borderRadius: '10px', // 모든 모서리를 둥글게 설정
                                                }}
                                            />

                                            <div className="list-action-right absolute top-2 right-2 z-[2] invisible group-hover:visible">
                                                <div className="add-cart-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-200">
                                                    <div
                                                        className="w-[16px] h-[16px] flex items-center justify-center cursor-pointer"
                                                        onClick={(e) => addToCart(product, e)} // 장바구니에만 담기
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
                                                {product.price}원
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='text-center col-span-full mt-4'>No stores found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RandomMenu;
