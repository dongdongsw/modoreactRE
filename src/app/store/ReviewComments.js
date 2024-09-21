//Main/Store/StoreDetail/ReviewComments.js 경로

import React from 'react';

const ReviewComments = ({ comments }) => {
    return (
        <div className="review-comments">
            <h3>사장님</h3>
            {comments.map(comment => (
                <div key={comment.id} className={`review-comment ${comment.isSeller ? 'seller' : ''}`}>
                    <p><strong>{comment.author}</strong> {comment.content}</p>
                    <p>{new Date(comment.createdAt).toLocaleDateString()}</p>
                    {comment.updatedAt && (
                        <p>{new Date(comment.updatedAt).toLocaleDateString()} (수정됨)</p>
                    )}
                    {comment.imageUrl && <img src={`http://localhost:8080${comment.imageUrl}`} alt="Comment" />}
                </div>
            ))}
        </div>
    );
};

export default ReviewComments;
