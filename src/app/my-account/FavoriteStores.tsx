// src/app/my-account/Settings.tsx
import React from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
}

const FavoriteStores: React.FC<TabButtonProps> = ({ isActive, onClick }) => {
    return (
        <div
            className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <Icon.Tag size={20} />
            <strong className="heading6">즐겨찾기</strong>
        </div>
    );
};

const FavoriteStoresContent: React.FC = () => {
    return (
        <div>
            <h2>즐겨찾기</h2>
            <p>Here is where you can manage your settings.</p>
        </div>
    );
};

export default FavoriteStores;
export { FavoriteStoresContent };
