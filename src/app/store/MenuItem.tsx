//Main/Store/StoreDetail/MenuItem.js 경로

import React from 'react';
import { Item } from './storeItemtype';  // 타입 정의 가져오기
import Image from 'next/image'; // next/image 가져오기

  

interface MenuItemProps {
    item: Item;
    quantity: { [key: string]: number };
    handleQuantityChange: (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => void;
    handleAddToCart: (item: Item) => void;
    handlePayment: (item: Item) => void;
  }

const MenuItem: React.FC<MenuItemProps> = ({ item, quantity, handleQuantityChange, handleAddToCart, handlePayment }) => {
    return (
        <div key={item.id} className="menu-item-img">
        <Image 
            src={item.imageUrl || '/images/default.jpg'}  // 상대 경로로만 설정
            alt={item.name} 
                width={500} // width 설정
                height={500} // height 설정
                layout="responsive" // 반응형 레이아웃
            />            
            <div className="menu-item-info">
                <div>
                    <p>{item.name}</p>
                    <p>{item.price} 원</p>
                </div>
                <div className="button-group">
                    <button onClick={() => handleAddToCart(item)}>장바구니에 추가</button>
                    <button onClick={() => handlePayment(item)}>결제</button>
                </div>
            </div>
        </div>
    );
};
export default MenuItem;
