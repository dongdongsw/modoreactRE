//Main/Store/StoreDetail/Tabs.js 경로


import React from 'react';

const Tabs = ({ activeTab, handleTabChange }) => {
    return (
        <div className="tabs">
            <button onClick={() => handleTabChange('menu')} className={activeTab === 'menu' ? 'active' : ''}>메뉴</button>
            <button onClick={() => handleTabChange('reviews')} className={activeTab === 'reviews' ? 'active' : ''}>리뷰</button>
        </div>
    );
};

export default Tabs;
