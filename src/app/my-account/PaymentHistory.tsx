// src/app/my-account/CartItems.tsx
import React from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
}

const PaymentHistory: React.FC<TabButtonProps> = ({ isActive, onClick }) => {
    return (
        <div
            className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <Icon.Cards size={20} />
            <strong className="heading6">결제 내역</strong>
        </div>
    );
};

const PaymentHistoryContent: React.FC = () => {
    return (
        <div>
            <h2>결제내역!</h2>
            <p>Here is where you can manage your addresses.!!!!!!!!!!!!!</p>
        </div>
    );
};

export default PaymentHistory;
export { PaymentHistoryContent };
