'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import './TestimonialItem.css';

interface ReviewType {
  id: string;
  star: number;
  title: string;
  content: string;
  author: string;
  createdDateTime: string;
  updatedDateTime?: string;
  comments: CommentType[];
  imageUrl: string;
  name: string;
}

interface CommentType {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

const TestimonialItem: React.FC<{ companyId: string }> = ({ companyId }) => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryFetched, setSummaryFetched] = useState(false);
  const prevCompanyIdRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!companyId) {
          setError('유효하지 않은 companyId입니다.');
          return;
        }

        const reviewsResponse = await axios.get(`/api/review/listByCompany/${companyId}`);
        if (reviewsResponse.data && reviewsResponse.data.length > 0) {
          const sortedReviews = reviewsResponse.data.sort(
              (a: any, b: any) => new Date(b.createdDateTime).getTime() - new Date(a.createdDateTime).getTime()
          );

          const reviewsWithComments = await Promise.all(
              sortedReviews.map(async (review: ReviewType) => {
                const commentsResponse = await axios.get(`/api/review/${review.id}/comments`);
                return { ...review, comments: commentsResponse.data };
              })
          );

          setReviews(reviewsWithComments);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error('리뷰 데이터를 불러오는 데 실패했습니다.', error);
        setError('리뷰를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (companyId && companyId !== prevCompanyIdRef.current) {
      fetchReviews();
      prevCompanyIdRef.current = companyId;
    }
  }, [companyId]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (reviews.length >= 10 && !summaryFetched) {
        try {
          const summaryResponse = await axios.post('/api/v1/chat-gpt/summarize', {
            data: reviews.map((review) => review.content),
          });
          setSummary(summaryResponse.data.answer);
          setSummaryFetched(true);
        } catch (error) {
          console.error('요약을 가져오는 데 실패했습니다.', error);
        }
      }
    };

    fetchSummary();
  }, [reviews, summaryFetched]);

  if (loading) {
    return <p>리뷰 데이터를 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p className="error-message text-red-500">{error}</p>;
  }

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(reviews.length / reviewsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
      <div className="testimonial-container">
        {summary ? (
            <div>
              <h3>요약된 리뷰:</h3>
              <p>{summary}</p>
            </div>
        ) : reviews.length < 10 ? (
            <p>요약을 진행하기에 충분한 리뷰가 작성되지 않았습니다.</p>
        ) : (
            <p>리뷰 요약을 로딩 중입니다...</p>
        )}

        {currentReviews.length > 0 ? (
            currentReviews.map((review: ReviewType) => (
                <div key={review.id} className="testimonial-divdidual" style={{ border: '1px solid #F7F7F7', borderRadius: '10px', backgroundColor: '#F7F7F7', padding: '20px', marginBottom: '20px' }}>
                  <div className="testimonial-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="review-content" style={{ flex: 2, marginRight: '20px' }}>
                      <div className="menuss" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                        {review.name && typeof review.name === 'string' && review.name.includes(',') ? (
                            review.name.split(',').map((menu, index) => (
                                <span key={index} className="tag px-5 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold bg-purple text-purple" style={{ textAlign: 'center', display: 'inline-block', justifyContent: 'center', alignItems: 'center' }}>
                        {menu.trim()}
                      </span>
                            ))
                        ) : (
                            review.name && typeof review.name === 'string' && (
                                <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold bg-purple text-purple" style={{ textAlign: 'center', display: 'inline-block', justifyContent: 'center', alignItems: 'center' }}>
                        {review.name.trim()}
                      </span>
                            )
                        )}
                      </div>

                      <div className="text-button" style={{fontSize: '13px' }}>{review.author}</div>
                      <div className="caption2 date text-secondary2 mt-3 mb-3">
                        {review.updatedDateTime ? (
                            `${new Date(review.updatedDateTime).toLocaleDateString()} (수정됨)`
                        ) : (
                            new Date(review.createdDateTime).toLocaleDateString()
                        )}
                      </div>
                      <div className="heading6 title mt-4">{review.title}</div>
                      <div className="desc mt-2">{review.content}</div>
                    </div>

                    {review.imageUrl ? (
                        <div className="product-img" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', width: '200px', height: '200px', overflow: 'hidden' }}>
                          <Image
                              src={review.imageUrl}
                              alt="review image"
                              width={220}
                              height={400}
                              fetchPriority="high"
                              unoptimized={true}
                              onError={(e) => console.error('Image failed to load for URL:', review.imageUrl)}
                              style={{ objectFit: 'cover' }}
                          />
                        </div>
                    ) : null}
                  </div>

                  <div className="comments-section mt-4 mb-4" style={{ overflow: 'hidden' }}>
                    {review.comments && review.comments.length > 0 && (
                        review.comments.map((comment: CommentType) => (
                            <div key={comment.id} className="comment-item" style={{ padding: '10px' }}>
                              <hr style={{ margin: '10px 0', color: '#ccc' }} />
                              <div className="text-button comment-author mt-3">사장님</div>
                              <div className="caption2 date text-secondary2 mt-2">
                                {comment.updatedAt ? (
                                    `${new Date(comment.updatedAt!).toLocaleDateString()} (수정됨)`
                                ) : (
                                    new Date(comment.createdAt).toLocaleDateString()
                                )}
                              </div>
                              <div className="desc mt-2">{comment.content}</div>
                            </div>
                        ))
                    )}
                  </div>
                </div>
            ))
        ) : (
            <p className="no-reviews text-sm text-gray-500">리뷰가 없습니다.</p>
        )}

        {/* 페이지네이션 버튼 추가 */}
        <div className="pagination mt-4" style={{ textAlign: 'center' }}>
          {pageNumbers.map((number) => (
              <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  style={{
                    margin: '0 5px',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    backgroundColor: currentPage === number ? '#000' : '#fff',
                    color: currentPage === number ? '#fff' : '#000',
                    cursor: 'pointer',
                  }}
              >
                {number}
              </button>
          ))}
        </div>
      </div>
  );
};

export default TestimonialItem;
