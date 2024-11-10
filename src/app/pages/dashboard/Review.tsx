import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useModalReviewContext} from "@/context/ModalReviewContext";
import {data} from "autoprefixer";

interface Comment {
    id: number;
    content: string;
    reviewId: number;
    createdAt: string;
    updatedAt?: string;
}

interface Review {
    id: number;
    createdDateTime: string;
    comments: Comment[];
    name: string;
    content: string;
    author: string;
    imageUrl?: string;
    updatedDateTime?: string;
}

export const ReviewContent: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [reviewsPerPage] = useState<number>(4);
    const [loading, setLoading] = useState<boolean>(true);

    const [reply, setReply] = useState<string>('');
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [editingReply, setEditingReply] = useState<string>('');
    const [editCommentId, setEditCommentId] = useState<number | null>(null);
    const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
    const [activeComments, setActiveComments] = useState<Comment[]>([]);
    const { openModalReview } = useModalReviewContext();


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/stores/my-store-reviews');
                if (response.ok) {
                    const data = await response.json();
                    const processedReviews = data.map((review: Review) => ({
                        ...review,
                        comments: Array.isArray(review.comments) ? review.comments : [],
                    }));

                    processedReviews.sort((a: Review, b: Review) => {
                        return new Date(b.createdDateTime).getTime() - new Date(a.createdDateTime).getTime();
                    });

                    setReviews(processedReviews);
                    setFilteredReviews(processedReviews);
                } else {
                    console.error('Failed to fetch reviews. Status code:', response.status);
                }
            } catch (error) {
                console.error('Error occurred:', error);
            }
        };

        fetchReviews();
    }, []);

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredReviews]);

    const fetchComments = async (reviewId: number) => {
        if (activeReviewId === reviewId) {
            setActiveReviewId(null);
            setActiveComments([]);
        } else {
            try {
                const response = await axios.get(`http://localhost:8080/api/review/${reviewId}/comments`);
                if (response.status === 200) {
                    setActiveReviewId(reviewId);
                    setActiveComments(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        }
    };

    const handleSaveReply = async (reviewId: number) => {
        try {
            const response = await axios.post(`http://localhost:8080/api/review/${reviewId}/comments`, { content: reply });

            if (response.status === 200 || response.status === 201) { // Handle both 200 and 201 as success
                const newComment = response.data;

                setActiveComments(prevComments => [...prevComments, newComment]);

                setReviews(prevReviews =>
                    prevReviews.map(review =>
                        review.id === reviewId
                            ? { ...review, comments: [...review.comments, newComment] }
                            : review
                    )
                );

                alert('댓글이 성공적으로 저장되었습니다.');
                setReply('');
                setIsReplying(false);
            } else {
                console.error('Failed to save comment. Status:', response.status);
                alert('댓글 저장에 실패했습니다.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Reply saving failed:', error.response ? error.response.data : error);
            } else {
                console.error('Unexpected error:', error);
            }
            alert('댓글 저장에 실패했습니다.');
        }
    };
    const handleEditReply = async (commentId: number) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/review/comments/${commentId}`, { content: editingReply });
            if (response.status === 200) {
                const currentDateTime = new Date().toISOString(); // 현재 날짜와 시간
                setActiveComments(prevComments =>
                    prevComments.map(comment =>
                        comment.id === commentId
                            ? { ...comment, content: editingReply, updatedAt: currentDateTime } // 현재 날짜로 업데이트
                            : comment
                    )
                );
                setReviews(prevReviews =>
                    prevReviews.map(review =>
                        review.comments.some(comment => comment.id === commentId)
                            ? {
                                ...review,
                                updatedDateTime: currentDateTime, // 리뷰의 업데이트 날짜도 현재로 변경
                                comments: review.comments.map(comment =>
                                    comment.id === commentId
                                        ? { ...comment, content: editingReply, updatedAt: currentDateTime }
                                        : comment
                                )
                            }
                            : review
                    )
                );
                setEditCommentId(null);
                setEditingReply('');
                alert('대댓글이 성공적으로 수정되었습니다.');
            } else {
                alert('대댓글 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('Reply update failed:', error);
            alert('대댓글 수정에 실패했습니다.');
        }
    };


    const handleDeleteReply = async (commentId: number) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/review/comments/${commentId}`);
            if (response.status === 200) {
                setActiveComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
                alert('댓글이 성공적으로 삭제되었습니다.');
            }
        } catch (error) {
            console.error('Reply deletion failed:', error);
        }
    };

    return (
        <div className="rest-content p-7 border border-line rounded-xl h-[950px] overflow-y-auto">
            <h5 className="heading5 text-2xl font-bold mb-4">리뷰 관리</h5>

            {/* 열 당 출력할 카드개수 설정 부분 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:2 gap-6">
                {currentReviews.map((review) => (
                    <div
                        className="testimonial-main p-4 rounded-2xl h-full mb-4 cursor-pointer"
                        style={{ backgroundColor: '#f7f7f7' }}
                        key={review.id}
                        onClick={() => {
                            console.log("Review Details:", review);
                            openModalReview(review);
                        }}
                    >
                        <div className="flex items-center mt-4">
                            <div className="heading6 title font-semibold text-black">
                                {review.name}
                            </div>
                            <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold bg-purple text-purple ml-2">
    주문
</span>
                        </div>
                        <hr
                            style={{
                                border: 0,
                                height: '1px',
                                backgroundColor: '#d3d3d3', // 회색
                                margin: '0.2rem 0', // 상하 여백
                            }}
                        />
                        <div className="desc mt-2">
                            {review.content.length > 30 ? (
                                <>
                                    {review.content.substring(0, 30)}...
                                    <span className="text-blue-500">더보기</span>
                                </>
                            ) : (
                                review.content
                            )}
                        </div>
                        {review.imageUrl && (
                            <div className="review-image mt-4">
                                {review.imageUrl && (
                                    <div style={{ width: '100%', height: '0', paddingBottom: '56.25%', position: 'relative' }}>
                                        <img
                                            src={review.imageUrl}
                                            alt={review.name}
                                            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="caption2 date text-gray-500 mt-2">
                            {review.updatedDateTime
                                ? `${new Date(review.updatedDateTime).toLocaleDateString()} (수정됨)`
                                : new Date(review.createdDateTime).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(filteredReviews.length / reviewsPerPage) }, (_, index) => (
                    <button
                        key={index}
                        className={`mx-1 px-4 py-2 rounded-lg ${
                            currentPage === index + 1 ? 'text-red' : 'text-black'
                        }`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                {currentPage < Math.ceil(filteredReviews.length / reviewsPerPage) && (
                    <button
                        className="mx-1 px-4 py-2 rounded-lg text-gray-300"
                        onClick={() => paginate(currentPage + 1)}
                    >
                        &gt;
                    </button>
                )}
            </div>
        </div>
    );

};
