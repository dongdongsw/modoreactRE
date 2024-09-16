// src/app/my-account/Logout.tsx
import React from 'react';
import * as Icon from "@phosphor-icons/react/dist/ssr";

interface LogoutProps {
    isActive: boolean;
    onClick: () => void;
}

const Logout: React.FC<LogoutProps> = ({ isActive, onClick }) => {
    return (
        <div
            className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <Icon.DoorOpen size={20} />
            <strong className="heading6">Logout</strong>
        </div>
    );
};

export default Logout;
