'use client';

import React, { createContext, useContext, useState } from 'react';

interface Review {
    id: number;
    name: string;
    content: string;
    imageUrl?: string;
    createdDateTime: string;
    updatedDateTime?: string;
}

interface ModalReviewContextType {
    isModalOpen: boolean;
    openModalReview: (review: Review) => void;
    closeModalReview: () => void;
    selectedReview: Review | null;
}

const ModalReviewContext = createContext<ModalReviewContextType | undefined>(undefined);

export const useModalReviewContext = () => {
    const context = useContext(ModalReviewContext);
    if (!context) {
        throw new Error("useModalReviewContext must be used within a ModalReviewProvider");
    }
    return context;
};

export const ModalReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const openModalReview = (review: Review) => {
        setSelectedReview(review);
        setIsModalOpen(true);
    };

    const closeModalReview = () => {
        setSelectedReview(null);
        setIsModalOpen(false);
    };

    return (
        <ModalReviewContext.Provider value={{ isModalOpen, openModalReview, closeModalReview, selectedReview }}>
            {children}
        </ModalReviewContext.Provider>
    );
};
