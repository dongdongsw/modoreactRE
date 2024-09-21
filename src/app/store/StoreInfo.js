// Main/Store/StoreInfo.js
import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const StoreInfo = ({ store, isFavorite, toggleFavorite }) => {
    return (
        <div className="store-info">
            <h1 className="store-title">{store.name}</h1>
            <div className="store-image">
                <img src={`http://localhost:8080${store.imageUrl}`} alt={store.name} />
            </div>
            <div className="store-details">
                <p className="store-description">{store.description}</p>
                <p className="store-address">{store.address}</p>
                <p className="store-phone">{store.phone}</p>
                <p className="store-food-type">{store.foodType}</p>
            </div>
            <div className="favorite-icon" onClick={toggleFavorite}>
                {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
            </div>
        </div>
    );
};

export default StoreInfo;
