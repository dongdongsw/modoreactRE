'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useModalReviewContext } from '@/context/ModalReviewContext';
import {data} from "autoprefixer";

interface Review {
    id: number;
    name: string;
    content: string;
    imageUrl?: string;
    createdDateTime: string;
    updatedDateTime: string;
    comments: Comment[]; // 대댓글 배열
    author: string; // 리뷰 작성자
}

interface Comment {
    id: number;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    timeDisplay: string; // for displaying the time format
}

const ModalReview = () => {
    const { isModalOpen, closeModalReview, selectedReview } = useModalReviewContext();
    const [activeComments, setActiveComments] = useState<Comment[]>([]);
    const [reply, setReply] = useState('');
    const [editingReply, setEditingReply] = useState('');
    const [editCommentId, setEditCommentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]); // State for storing reviews

    // 리뷰 데이터 가져오기
    const fetchReviews = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/stores/my-store-reviews');
            if (response.ok) {
                const data = await response.json();
                const processedReviews = data.map((review: Review) => ({
                    ...review,
                    comments: Array.isArray(review.comments) ? review.comments : [],
                }));
                setReviews(processedReviews);
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };


    useEffect(() => {
        fetchReviews(); // 컴포넌트가 마운트될 때 리뷰를 가져옵니다.
    }, []);

    const fetchComments = async (reviewId: number) => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const response = await axios.get(`http://localhost:8080/api/review/${reviewId}/comments`);
            if (response.status === 200) {
                const commentsWithTime = response.data.map((comment: Comment) => ({
                    ...comment,
                    timeDisplay: comment.updatedAt
                        ? new Date(comment.updatedAt).toLocaleDateString() + ' (수정됨)'
                        : new Date(comment.createdAt).toLocaleDateString(),
                }));
                setActiveComments(commentsWithTime);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            setErrorMessage('댓글을 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedReview) {
            fetchComments(selectedReview.id);
            console.log('Selected Review:', selectedReview);
        }
    }, [selectedReview]);

    const handleSaveReply = async (reviewId: number) => {
        if (!reply.trim()) {
            alert('댓글을 입력하세요.'); // 비어 있을 경우 알림
            return; // 저장을 진행하지 않고 함수 종료
        }

        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8080/api/review/${reviewId}/comments`, { content: reply });
            if (response.status === 200 || response.status === 201) {
                const newComment: Comment = { ...response.data, timeDisplay: new Date().toLocaleDateString() };
                setActiveComments((prevComments) => [...prevComments, newComment]);
                alert('댓글이 성공적으로 저장되었습니다.');
                setReply('');
            } else {
                alert('댓글 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Reply saving failed:', error);
            alert('댓글 저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };


    const handleEditReply = async (commentId: number) => {
        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:8080/api/review/comments/${commentId}`, { content: editingReply });
            if (response.status === 200) {
                setActiveComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.id === commentId
                            ? { ...comment, content: editingReply, timeDisplay: new Date().toLocaleDateString() + ' (수정됨)' }
                            : comment
                    )
                );
                setEditCommentId(null);
                setEditingReply('');
                alert('댓글이 성공적으로 수정되었습니다.');
            } else {
                alert('댓글 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('Reply update failed:', error);
            alert('댓글 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 댓글 삭제
    const handleDeleteReply = async (commentId: number) => {
        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:8080/api/review/comments/${commentId}`);
            if (response.status === 200) {
                setActiveComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
                alert('댓글이 성공적으로 삭제되었습니다.');
            }
        } catch (error) {
            console.error('Reply deletion failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`modal-cart-block`} onClick={closeModalReview}>
            <div
                className={`modal-cart-main flex-col ${isModalOpen ? 'open' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                }}
                style={{
                    width: '30%',
                    maxWidth: '400px',
                    minHeight: '400px',
                    maxHeight: '95vh',
                    overflowY: 'auto',
                    margin: 'auto',
                    padding: '20px',
                    borderRadius: '20px',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div className="full-width">
                    <div className="heading5">+</div>
                    {selectedReview ? (
                        <div className="testimonial-main rounded-2xl mb-4" style={{ backgroundColor: 'transparent' }}>
                            <div className="flex items-center mt-4">
                                <div className="heading6 title font-semibold text-black">{selectedReview.name}</div>
                                <div className="desc ml-2 text-secondary">주문</div>
                            </div>
                            <div className="desc mt-2">{selectedReview.content}</div>
                            {selectedReview.imageUrl && (
                                <div className="review-image mt-4">
                                    <Image
                                        src={selectedReview.imageUrl}
                                        alt="Review"
                                        width={100}
                                        height={56.25}
                                        className="rounded-lg shadow"
                                        style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                                    />
                                </div>
                            )}
                            <div className="caption2 date text-gray-500 mt-2">
                                {selectedReview.updatedDateTime
                                    ? `${new Date(selectedReview.updatedDateTime).toLocaleDateString()} (수정됨)`
                                    : new Date(selectedReview.createdDateTime).toLocaleDateString()}
                            </div>
                        </div>
                    ) : (
                        <div className="no-reviews">리뷰가 없습니다.</div>
                    )}

                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                    {loading && <div className="loading">로딩 중...</div>}

                    {/* 댓글 입력 및 표시 */}
                    {activeComments.length === 0 && (
                        <div className="comments mt-4">
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="댓글을 입력하세요"
                            className="w-full p-2 border rounded h-12"
                            rows={2}
                        />
                            <div className="flex justify-end">
                                <button
                                    onClick={() => selectedReview && handleSaveReply(selectedReview.id)}
                                    className="button-main mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                                >
                                    저장
                                </button>
                            </div>

                        </div>
                    )}

                    {activeComments.length > 0 && (
                        <>
                            <hr
                                style={{
                                    border: '0',
                                    height: '1px',
                                    backgroundColor: 'rgb(211, 211, 211)',
                                    margin: '1rem 0',
                                }}
                            />
                            <div className="comments mt-4">
                                {activeComments.map((comment) => (
                                    <div key={comment.id} className="comment-item">
                                        {editCommentId === comment.id ? (
                                            <>
                                            <textarea
                                                value={editingReply}
                                                onChange={(e) => setEditingReply(e.target.value)}
                                                placeholder="수정할 댓글을 입력하세요"
                                                className="w-full p-2 border rounded h-12"
                                                rows={2}
                                            />
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleEditReply(comment.id)}
                                                        className="button-main px-4 py-2 bg-green-500 text-white rounded-lg"
                                                    >
                                                        저장
                                                    </button>
                                                    <button
                                                        onClick={() => setEditCommentId(null)}
                                                        className="button-main px-4 py-2 bg-green-500 text-white rounded-lg"
                                                    >
                                                        취소
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center">
                                                    <h4 className="font-semibold">{(selectedReview as Review)?.author || '작성자 없음'}</h4>
                                                    <h4 className="font-thin text-gray-500 ml-1">님에게</h4>
                                                </div>
                                                <div className="comment-content">{comment.content}</div>
                                                <div className="caption2 date text-gray-500 mt-2">
                                                    {comment.author} | {comment.timeDisplay}
                                                </div>
                                                <div className="comment-actions flex justify-end gap-2 mt-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditCommentId(comment.id);
                                                            setEditingReply(comment.content);
                                                        }}
                                                        className="button-main px-4 py-2 bg-green-500 text-white rounded-lg"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReply(comment.id)}
                                                        className="button-main px-4 py-2 bg-green-500 text-white rounded-lg"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalReview;
