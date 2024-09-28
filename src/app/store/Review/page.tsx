import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image';

interface ReviewType {
    id: string
    star: number
    title: string
    content: string
    author: string
    createdDateTime: string
    comments: CommentType[]
    imageurl: string
}

interface CommentType {
    id: string
    author: string
    content: string
    date: string
}

const TestimonialItem: React.FC<{ companyId: string }> = ({ companyId }) => {
    const [reviews, setReviews] = useState<ReviewType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    console.log("Initial companyId value outside useEffect:", companyId); // 컴포넌트 초기화 시점 로그


    useEffect(() => {
        // 리뷰 데이터를 가져오는 함수
        const fetchReviews = async () => {
            try {
                if (!companyId) {
                    setError("Invalid companyId provided.");
                    return;
                }

                console.log(`Fetching reviews for companyId: ${companyId}`); // 디버그 메시지 추가
                const reviewsResponse = await axios.get(`/api/review/listByCompany/${companyId}`)
                console.log('Reviews response:', reviewsResponse.data); // 가져온 리뷰 데이터 확인

                if (reviewsResponse.data && reviewsResponse.data.length > 0) {
                    // 리뷰 정렬 및 댓글 데이터 가져오기
                    const sortedReviews = reviewsResponse.data.sort((a: any, b: any) =>
                        new Date(b.createdDateTime).getTime() - new Date(a.createdDateTime).getTime()
                    )

                    const reviewsWithComments = await Promise.all(
                        sortedReviews.map((review: any) =>
                            axios.get(`/api/review/${review.id}/comments`)
                                .then(commentResponse => ({ ...review, comments: commentResponse.data }))
                        )
                    )
                    setReviews(reviewsWithComments)
                } else {
                    console.log('No reviews found.'); // 리뷰가 없는 경우
                    setReviews([]); 
                }
            } catch (error) {
                console.error('리뷰 데이터를 불러오는 데 실패했습니다.', error)
                setError('Failed to load reviews.')
            } finally {
                setLoading(false); // 로딩 상태 업데이트
            }
        }

        // companyId가 유효할 때만 데이터 요청
        if (companyId) {
            fetchReviews()
        }
    }, [companyId])

    if (loading) {
        return <p>리뷰 데이터를 불러오는 중입니다...</p>
    }

    if (error) {
        return <p className="error-message text-red-500">{error}</p>
    }

    return (
        <div className="testimonial-container">
            {reviews.length > 0 ? (
                reviews.map((review: ReviewType) => (
                    <div key={review.id} className="testimonial-item style-one h-full">
                        <div className="testimonial-main bg-white p-8 rounded-2xl h-full">
                        <div className="product-img" style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <Image
                            src = {review.imageurl || ''}
                            alt='Review Image'
                            width={500}
                            height={500}
                            
                            fetchPriority="high"
                            />
                            </div>
                            <div className="heading6 title mt-4">{review.title}</div>
                            <div className="desc mt-2">{review.content}</div>
                            <div className="text-button name mt-4">{review.author}</div>
                            <div className="caption2 date text-secondary2 mt-1">{new Date(review.createdDateTime).toLocaleDateString()}</div>
                        </div>
                        {/* 댓글 섹션 추가 */}
                        <div className="comments-section mt-4">
                            {review.comments && review.comments.length > 0 ? (
                                review.comments.map((comment: CommentType) => (
                                    <div key={comment.id} className="comment-item bg-gray-100 p-4 rounded-lg mt-2">
                                        <div className="text-button comment-author">{comment.author}</div>
                                        <div className="caption2 comment-date text-secondary2">{new Date(comment.date).toLocaleDateString()}</div>
                                        <div className="body1 comment-content mt-1">{comment.content}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-comments text-sm text-gray-500">댓글이 없습니다.</p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-reviews text-sm text-gray-500">리뷰가 없습니다.</p>
            )}
        </div>
    )
}

export default TestimonialItem
