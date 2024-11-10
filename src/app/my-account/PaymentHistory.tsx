import React, { useEffect, useState } from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import axios from 'axios';
import UserInfo from "@/app/my-account/UserInfo";

interface Payment {
    id: string;
    merchantUid: string;
    companyId: string;
    amountTotal: number;
    buyerName: string;
    buyerAddr: string;
    name: string;
    buyerTel: string;
    review:string;
}

interface Review {
    id: string;
    content: string;
    imageUrl?: string;
    createdDateTime: string;  // or Date if it's a Date object
    updatedDateTime?: string; // or Date if it's a Date object
}

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
}

const formatCurrency = (amountTotal: number | null): string => {
    if (amountTotal == null) return '0 원';
    return amountTotal.toLocaleString('ko-KR') + ' 원';
};

const PaymentHistory: React.FC<TabButtonProps> = ({ isActive, onClick }) => (
    <div
        className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${isActive ? 'active' : ''}`}
        onClick={onClick}
    >
        <Icon.Package size={20} />
        <strong className="heading6">결제 내역</strong>
    </div>
);

const PaymentHistoryContent: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [storeNames, setStoreNames] = useState<Record<string, string>>({});
    const [userReviews, setUserReviews] = useState<Record<string, Review[]>>({});
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewImage, setReviewImage] = useState<File | null>(null);
    const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null); // 추가된 상태
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(payments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPayments = payments.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSelectedPayment(null);  // 추가
            setSelectedReview(null);   // 추가
        }
    };

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('/api/payments/user'); // 결제 내역을 가져오는 API 호출
                setPayments(response.data);
            } catch (error) {
                console.error('Failed to fetch payments:', (error as Error).message);
            }
        };

        fetchPayments();
    }, []);

    useEffect(() => {
        const fetchStoreNames = async () => {
            const uniqueCompanyIds = [...new Set(payments.map(payment => payment.companyId))];
            const promises = uniqueCompanyIds.map(id =>
                axios.get(`/api/stores/${id}/name`)
                    .then(response => ({[id]: response.data}))
                    .catch(() => ({[id]: '알 수 없는 가맹점'}))
            );
            const results = await Promise.all(promises);
            setStoreNames(Object.assign({}, ...results));
        };

        const fetchUserReviews = async () => {
            const reviewMap: Record<string, Review[]> = {};
            for (const payment of payments) {
                try {
                    const response = await axios.get(`/api/review/list/${payment.merchantUid}`);
                    reviewMap[payment.id] = response.data;
                } catch (error) {
                    console.error(`Failed to fetch review for merchantUid ${payment.merchantUid}:`, (error as Error).message);
                }
            }
            setUserReviews(reviewMap);
        };

        fetchStoreNames();
        fetchUserReviews();
    }, [payments]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPayment) return;

        const formData = new FormData();
        formData.append('content', reviewContent);
        if (reviewImage) formData.append('image', reviewImage);
        formData.append('merchantUid', selectedPayment.merchantUid);

        try {
            if (selectedReview) {
                await axios.put(`/api/review/edit/${selectedReview.id}`, formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });

                const updatedReview = await axios.get(`/api/review/${selectedReview.id}`);
                const updatedReviews = userReviews[selectedPayment.id]?.map(review => review.id === selectedReview.id ? updatedReview.data : review) || [];
                setUserReviews({...userReviews, [selectedPayment.id]: updatedReviews});

                alert('리뷰가 성공적으로 수정되었습니다.');
                setIsEditing(false);
                setSelectedReview(null);
            } else {
                await axios.post('/api/review/post', formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });

                const response = await axios.get(`/api/review/list/${selectedPayment.merchantUid}`);
                setUserReviews({...userReviews, [selectedPayment.id]: response.data});

                alert('리뷰가 성공적으로 등록되었습니다.');
            }

            setReviewContent('');
            setReviewImage(null);
            setReviewImagePreview(null); // 추가된 상태 초기화
            setSelectedPayment(null);
        } catch (error) {
            alert('리뷰 처리에 실패했습니다.');
            console.error('Review submission or update error:', (error as Error).message);
        }
    };

    const handleReviewDelete = async () => {
        if (!selectedReview) return;

        try {
            await axios.delete(`/api/review/delete/${selectedReview.id}`);
            const response = await axios.get(`/api/review/list/${selectedPayment!.merchantUid}`);
            setUserReviews({...userReviews, [selectedPayment!.id]: response.data});

            alert('리뷰가 성공적으로 삭제되었습니다.');
            setIsEditing(false);
            setSelectedReview(null);
            setReviewContent('');
            setReviewImage(null);
            setReviewImagePreview(null);
        } catch (error) {
            alert('리뷰 삭제에 실패했습니다.');
            console.error('Review delete error:', (error as Error).message);
        }
    };

    const handleReviewView = (paymentId: string) => {
        const selectedPaymentData = payments.find(payment => payment.id === paymentId) || null;
        setSelectedPayment(selectedPaymentData);

        const reviews = userReviews[paymentId] || [];
        const review = reviews[0] || null;

        if (review) {
            setSelectedReview(review);
            setReviewContent(review.content);
            setReviewImage(review.imageUrl ? new File([], review.imageUrl) : null);
            setReviewImagePreview(review.imageUrl || null);
        } else {
            setReviewContent('');
            setReviewImage(null);
            setReviewImagePreview(null);
        }

        setIsEditing(true);
    };



    return (
        <div>
            <div className="recent_order p-7 border border-line rounded-xl">
                <h5 className="heading5">결제 내역</h5>
                {error && <p className="text-red-500">Error: {error}</p>}
                <div className="list w-full mt-5">
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-max table-auto">
                            <thead className="border-b border-line">
                            <tr>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">
                                    상품명
                                </th>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">
                                    주소
                                </th>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">
                                    업체명
                                </th>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">
                                    전화번호
                                </th>
                                <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">
                                    금액
                                </th>
                                <th className="pb-3 text-center text-sm font-bold uppercase text-secondary whitespace-nowrap px-2">
                                    리뷰
                                </th> {/* Centered header */}
                            </tr>
                            </thead>
                            <tbody>
                            {currentPayments.length > 0 ? (
                                currentPayments.map(payment => (
                                    <tr
                                        key={payment.id}
                                        className="border-b border-line cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleReviewView(payment.id)}
                                    >
                                        <td className="py-3 text-left text-sm px-2">{payment.name}</td>
                                        <td className="py-3 text-left text-sm px-2">{payment.buyerAddr}</td>
                                        <td className="py-3 text-left text-sm px-2">{storeNames[payment.companyId]}</td>
                                        <td className="py-3 text-left text-sm px-2">{payment.buyerTel}</td>
                                        <td className="py-3 text-left text-sm px-2">{formatCurrency(payment.amountTotal)}</td>
                                        <td className="py-3 px-2 text-center">
                                            <div className="flex justify-center items-center h-full">
                                                {userReviews[payment.id]?.length > 0 ? (
                                                    <button className="flex items-center space-x-2 text-yellow-600">
                      <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-yellow text-yellow caption1 font-semibold">
                        조회
                      </span>
                                                    </button>
                                                ) : (
                                                    <button className="flex items-center space-x-2 text-success-600">
                      <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-success text-success caption1 font-semibold">
                        등록
                      </span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-3 text-center text-sm">결제 내역이 없습니다.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`mx-1 px-4 py-2 rounded-lg ${
                                currentPage === index + 1
                                    ? 'text-red' // 현재 페이지는 빨간색
                                    : 'text-gray-500'  // 다른 페이지는 더 밝은 회색
                            }`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    {currentPage < totalPages && (
                        <button
                            className="mx-1 px-4 py-2 rounded-lg text-gray-300"
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            &gt;
                        </button>
                    )}
                </div>


                {selectedPayment &&  (
                    <div className="review-details mt-6 p-7 border border-line rounded-xl">
                        <h5 className="heading5 text-center">
                            {selectedPayment.name || '가맹점 이름'}
                        </h5>
                        {userReviews[selectedPayment.id]?.length > 0 ? (
                            <div className="review-date mt-4 text-right">
                                {selectedReview ? (
                                    <>
                                        {selectedReview.updatedDateTime ? (
                                            <p>
                                                수정일: {new Date(selectedReview.updatedDateTime).toLocaleDateString()} (수정됨)
                                            </p>
                                        ) : (
                                            <p>
                                                작성일: {new Date(selectedReview.createdDateTime).toLocaleDateString()}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p>리뷰 정보를 불러올 수 없습니다.</p> // selectedReview가 null일 때 보여줄 내용
                                )}
                            </div>

                        ) : null}

                        {reviewImagePreview && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: '8px'
                                }}
                            >
                                <img
                                    src={reviewImagePreview}
                                    alt="Review Preview"
                                    style={{
                                        maxWidth: '400px',
                                        maxHeight: '300px',
                                        width: 'auto',
                                        height: 'auto',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        )}

                        <form onSubmit={handleReviewSubmit}>
                            <div className="mb-4">
                            <textarea
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                rows={2}
                                className="w-full border border-gray-300 p-2 rounded-md"
                                placeholder="리뷰를 작성해주세요"
                                required
                                readOnly={!isEditing}
                            />
                                {!isEditing && (
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        수정
                                    </button>
                                )}
                            </div>
                            <div className="mb-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            const file = e.target.files[0];
                                            setReviewImage(file);
                                            setReviewImagePreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="block w-full"
                                />
                            </div>
                            <div className="flex gap-4 mb-4">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="submit"
                                            className="btn-primary bg-green-500"
                                        >
                                            저장
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={handleReviewDelete}
                                        >
                                            삭제
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn-primary bg-blue-500"
                                    >
                                        제출
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setSelectedPayment(null)}
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
export default PaymentHistory;
export { PaymentHistoryContent };
