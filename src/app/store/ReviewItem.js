//Main/Store/StoreDetail/ReviewItem.js 경로

import React from 'react';
import ReviewComments from './ReviewComments';

const ReviewItem = ({ review }) => {
    return (
        <div key={review.id} className="review-item">
            <p><strong>주문메뉴:</strong> {review.name}</p>
            <p><strong>내용:</strong> {review.content}</p>
            <p><strong>작성자:</strong> {review.author}</p>
            <p>{new Date(review.createdDateTime).toLocaleDateString()}</p>
            {review.updatedDateTime && (
                <p>{new Date(review.updatedDateTime).toLocaleDateString()} (수정됨)</p>
            )}
            {review.imageUrl && <img src={`http://localhost:8080${review.imageUrl}`} alt="Review" />}
            {review.comments && review.comments.length > 0 && (
                <ReviewComments comments={review.comments} />
            )}
        </div>
    );
};

export default ReviewItem;
