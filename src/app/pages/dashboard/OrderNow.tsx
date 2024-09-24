import React, { useEffect, useState } from 'react';

interface Order {
    id: number;
    merchantUid: string;
    buyerName: string;
    buyerTel: string;
    name: string;
    buyerAddr: string;
    orderId?: string;
    timeSlot?: string;
    quantity?: number;
    orderDate?: string;
    amountTotal?: number;
}

export const OrderNowContent: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>('');  // 선택된 시간대 (아침, 점심, 저녁)
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');  // 검색 쿼리
    const [selectedDate, setSelectedDate] = useState<string>('');  // 선택된 날짜

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/payments/company');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Order[] = await response.json();
                const processedOrders = processOrders(data);
                setOrders(processedOrders);
                filterOrders(processedOrders, selectedTime, searchQuery, selectedDate);  // 초기 로드 시 모든 주문 표시
            } catch (error) {
                console.error('Error fetching payment data:', error);
                setError('Failed to fetch orders. Please try again later.');
            }
        };

        fetchData();
    }, [selectedTime, selectedDate]); // selectedTime과 selectedDate가 변경될 때마다 필터링 동작

    // 주문 데이터를 처리하여 필요한 값 추출
    const processOrders = (orders: Order[]): Order[] => {
        return orders.map(order => {
            const orderId = extractOrderId(order.merchantUid);
            const timeSlot = extractTimeSlot(order.merchantUid);
            const quantity = extractQuantity(order.merchantUid);
            const orderDate = extractDate(order.merchantUid);

            return {
                ...order,
                orderId,
                timeSlot,
                quantity,
                orderDate,
            };
        });
    };

    // 주문 ID 추출
    const extractOrderId = (merchantUid: string): string => {
        return merchantUid.split('.')[0];
    };

    // 예약 시간대 추출 (아침, 점심, 저녁)
    const extractTimeSlot = (merchantUid: string): string => {
        const timeIndicator = merchantUid.split('.').pop()?.charAt(0);
        switch (timeIndicator) {
            case 'M':
                return '아침';
            case 'L':
                return '점심';
            case 'D':
                return '저녁';
            default:
                return '알 수 없음';
        }
    };

    // 수량 추출
    const extractQuantity = (merchantUid: string): number => {
        const quantity = merchantUid.split('.').pop()?.slice(1);
        return quantity ? parseInt(quantity, 10) : 0;
    };

    // 주문 날짜 추출
    const extractDate = (merchantUid: string): string => {
        return merchantUid.split('.')[2] || '';
    };

    // 주문 필터링
    const filterOrders = (orders: Order[], time: string, query: string, date: string) => {
        let filtered = orders;

        if (time) {
            filtered = filtered.filter(order => order.timeSlot === time);  // 시간대에 따라 필터링
        }

        if (query) {
            const lowerCaseQuery = query.toLowerCase();
            filtered = filtered.filter(order =>
                order.orderId?.toLowerCase().includes(lowerCaseQuery) ||
                order.name.toLowerCase().includes(lowerCaseQuery) ||
                order.buyerName.toLowerCase().includes(lowerCaseQuery) ||
                order.buyerTel.toLowerCase().includes(lowerCaseQuery)  // 고객 전화번호 필터링 추가
            );
        }

        if (date) {
            filtered = filtered.filter(order => order.orderDate === date); // 날짜 필터링
        }

        setFilteredOrders(filtered);
    };

    // 시간대 필터링 핸들러
    const handleTimeChange = (time: string) => {
        if (time === 'ALL') {
            setSelectedTime(''); // 선택한 시간대 초기화
            setFilteredOrders(orders); // 모든 주문으로 설정
        } else {
            setSelectedTime(time); // 선택한 시간대 저장
            filterOrders(orders, time, searchQuery, selectedDate); // 선택한 시간대에 따라 필터링
        }
    };

    // 검색 입력 변경 핸들러
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);  // 검색 쿼리 저장
    };

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        filterOrders(orders, selectedTime, searchQuery, selectedDate);  // 검색 실행
    };

    // 초기화 버튼 클릭 핸들러
    const handleReset = () => {
        setSearchQuery('');
        setSelectedDate(''); // 날짜 선택 초기화
        filterOrders(orders, selectedTime, '', '');  // 초기화 후 모든 주문을 표시
    };

    // 날짜 변경 핸들러
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);
        filterOrders(orders, selectedTime, searchQuery, date); // 날짜 필터링
    };

    const handleCancelOrder = (id: number) => {
        const confirmCancel = window.confirm('정말 취소하시겠습니까?');
        if (confirmCancel) {
            setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
            setFilteredOrders(prevOrders => prevOrders.filter(order => order.id !== id));
            window.alert('취소되었습니다.'); // 취소 메시지 표시
        }
    };
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    // 현재 페이지에 해당하는 주문을 계산
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    // 페이지 수 계산
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    // 페이지 변경 함수
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber); // 페이지 번호 업데이트
    };


    return (
        <div className="recent_order p-7 border border-line rounded-xl">
            <h5 className="heading5 text-2xl font-bold mb-4">주문 현황</h5>
            {error && <div className="error-message text-red-500 mb-4">{error}</div>}

            {/* 검색창 및 버튼 */}
            <div className="input-block w-full flex items-center">
                <div className="relative flex-grow">
                    <input
                        placeholder="Search..."
                        className="caption1 w-full h-[44px] pl-4 pr-14 rounded-xl border border-line"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <button
                        className="store-button-register button-main absolute top-1 bottom-1 right-1 flex items-center justify-center"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                <button
                    className="button-main h-[44px] ml-2 flex items-center"
                    style={{ backgroundColor: 'transparent', color: 'inherit', padding: '0 8px' }}
                    onClick={handleReset}
                >
                    초기화
                </button>
            </div>

            {/* 날짜 필터링 UI */}
            <div className="flex justify-between mt-4">
                <div className="date-filter">
                    <label htmlFor="order-date" className="mr-2">날짜 선택:</label>
                    <input
                        type="date"
                        id="order-date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="rounded border border-line"
                    />
                </div>
                <div className="time-filter flex gap-2">
                    <button
                        onClick={() => handleTimeChange('ALL')}
                        className={`ttag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold bg-gray-200 text-gray-600 bg-opacity-30 ${selectedTime === 'ALL' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        ALL
                    </button>
                    <button
                        onClick={() => handleTimeChange('아침')}
                        className={`tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold bg-yellow text-yellow ${selectedTime === '아침' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        아침
                    </button>
                    <button
                        onClick={() => handleTimeChange('점심')}
                        className={`tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold bg-purple text-purple ${selectedTime === '점심' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        점심
                    </button>
                    <button
                        onClick={() => handleTimeChange('저녁')}
                        className={`tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold bg-success text-success ${selectedTime === '저녁' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        저녁
                    </button>
                </div>
            </div>

            {/* 주문 현황 표 출력 */}
            <div className="recent_order mt-3 p-7 border border-line rounded-xl">

            {filteredOrders.length === 0 ? (
                <div className="no-orders text-center">No orders found.</div>
            ) : (
                <div className="list overflow-x-auto w-full">
                    <table className="min-w-full table-auto text-left">
                        <thead>
                        <tr className="text-gray-700 border-b border-line">
                            <th className="py-3 px-2 text-center whitespace-nowrap">주문 ID</th>
                            <th className="py-3 px-2 whitespace-nowrap text-center">상품명</th>
                            <th className="py-3 px-2 whitespace-nowrap text-center">시간</th>
                            <th className="py-3 px-2 whitespace-nowrap text-center">수량</th>
                            <th className="py-3 px-2 whitespace-nowrap text-center">날짜</th>
                            <th className="py-3 px-2 whitespace-nowrap text-center">전화번호</th>
                            <th className="py-3 px-2 text-center whitespace-nowrap">주소</th>
                            <th className="py-3 px-2 text-center whitespace-nowrap">주문자</th>
                            <th className="py-3 px-2 whitespace-nowrap text-center">총액</th>
                            <th className="py-3 px-2 whitespace-nowrap text-center">작업</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentOrders.map(order => (
                            <tr key={order.id} className="border-b border-line">
                                <td className="py-3 px-2 whitespace-nowrap text-center">{order.orderId}</td>
                                <td className="py-3 px-2 whitespace-nowrap text-center">{order.name}</td>
                                <td className="py-3 px-2 whitespace-nowrap text-center">{order.timeSlot}</td>
                                <td className="py-3 px-2 whitespace-nowrap text-center">{order.quantity}</td>
                                <td className="py-3 px-2 whitespace-nowrap text-center">{order.orderDate}</td>
                                <td className="py-3 px-2 whitespace-nowrap text-center">{order.buyerTel}</td>
                                <td className="py-3 px-2 whitespace-nowrap text-center">{order.buyerAddr}</td>
                                <td className="py-3 px-2 whitespace-nowrap text-center">{order.buyerName}</td>
                                <td className="py-3 px-2 whitespace-nowrap text-center">{order.amountTotal} 원</td>
                                <td className="py-3 px-2 text-center whitespace-nowrap">
                                    <button
                                        className="tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold bg-red text-red"
                                        onClick={() => handleCancelOrder(order.id)}
                                    >
                                        취소
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* 페이지네이션 */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`mx-1 px-4 py-2 rounded-lg ${
                                    currentPage === index + 1
                                        ? 'text-red'
                                        : 'text-black'  // 더 밝은 회색으로 변경
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
                </div>
            )}
        </div>
        </div>
    );

};

