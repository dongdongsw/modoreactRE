import React from 'react';

interface MenuItemProps {
    item: {
        id: string;
        name: string;
        price: number;
        imageUrl: string; // 이미지 URL
    };
    quantity: number;
    handleQuantityChange: (value: number) => void;
    handleAddToCart: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, quantity, handleQuantityChange, handleAddToCart }) => {
    return (
        <div className="menu-item">
            <img src={item.imageUrl} alt={item.name} className="menu-item-image" />

        </div>
    );
};

export default MenuItem;
