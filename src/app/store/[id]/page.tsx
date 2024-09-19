import React from 'react';

const StoreDetailPage: React.FC = () => {
    const store = {
        title: '스토어디테일페이지',
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>{store.title}</h1>
        </div>
    );
};

export default StoreDetailPage;
