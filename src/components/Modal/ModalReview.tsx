'use client';


import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useModalReviewContext } from '@/context/ModalReviewContext';
import { countdownTime } from '@/store/countdownTime';
import CountdownTimeType from '@/type/CountdownType';

const ModalReview = ({ serverTimeLeft }: { serverTimeLeft: CountdownTimeType }) => {
    const [timeLeft, setTimeLeft] = useState(serverTimeLeft);
    const { isModalOpen, closeModalReview, selectedReview } = useModalReviewContext();
    const [activeComments, setActiveComments] = useState<any[]>([]);
    const [reply, setReply] = useState('');
    const [editingReply, setEditingReply] = useState('');
    const [editCommentId, setEditCommentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false); // Loading state
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(countdownTime());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchComments = async (reviewId: number) => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const response = await axios.get(`http://localhost:8080/api/review/${reviewId}/comments`);
            if (response.status === 200) {
                setActiveComments(response.data);
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
        }
    }, [selectedReview]);

    const handleSaveReply = async (reviewId: number) => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8080/api/review/${reviewId}/comments`, { content: reply });
            if (response.status === 200 || response.status === 201) {
                const newComment = response.data;
                setActiveComments(prevComments => [...prevComments, newComment]);
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
                setActiveComments(prevComments =>
                    prevComments.map(comment =>
                        comment.id === commentId
                            ? { ...comment, content: editingReply }
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

    const handleDeleteReply = async (commentId: number) => {
        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:8080/api/review/comments/${commentId}`);
            if (response.status === 200) {
                setActiveComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
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
                onClick={(e) => { e.stopPropagation(); }}
                style={{
                    width: '30%',
                    maxWidth: '400px',
                    margin: 'auto',
                }}
            >
                <div className="full-width py-6">
                    <div className="heading5 px-6 pb-3">리뷰 상세보기</div>
                    {selectedReview ? (
                        <div className="testimonial-main p-4 rounded-2xl mb-4" style={{ backgroundColor: '#f7f7f7' }}>
                            <div className="flex items-center mt-4">
                                <div className="heading6 title font-semibold text-black">{selectedReview.name}</div>
                                <div className="desc ml-2 text-secondary">주문</div>
                            </div>
                            <div className="desc mt-2">{selectedReview.content}</div>
                            {selectedReview.imageUrl && (
                                <div className="review-image mt-4">
                                    <Image src={selectedReview.imageUrl} alt="Review" width={100} height={100} className="rounded-lg shadow" />
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
                    <div className="comments mt-4">
                        {selectedReview ? (
                            <div>
                                <textarea
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder="댓글을 입력하세요"
                                    className="w-full p-2 border rounded"
                                />
                                <button
                                    onClick={() => handleSaveReply(selectedReview.id)}
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    댓글 저장
                                </button>
                            </div>
                        ) : (
                            <div className="text-gray-500">리뷰를 선택해 주세요.</div>
                        )}

                        {activeComments.length > 0 ? (
                            activeComments.map(comment => (
                                <div key={comment.id} className="comment-item p-2 border rounded mt-2">
                                    <div className="comment-content">{comment.content}</div>
                                    <div className="comment-author text-gray-500 mt-1">{comment.author}</div>
                                    <button onClick={() => {
                                        setEditCommentId(comment.id);
                                        setEditingReply(comment.content);
                                    }} className="text-blue-500">수정</button>
                                    <button onClick={() => handleDeleteReply(comment.id)} className="text-red-500">삭제</button>
                                    {editCommentId === comment.id && (
                                        <div>
                                            <textarea
                                                value={editingReply}
                                                onChange={(e) => setEditingReply(e.target.value)}
                                                placeholder="수정할 댓글을 입력하세요"
                                                className="w-full p-2 border rounded mt-2"
                                            />
                                            <button
                                                onClick={() => handleEditReply(comment.id)}
                                                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                                            >
                                                댓글 수정
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-comments">댓글이 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalReview;
