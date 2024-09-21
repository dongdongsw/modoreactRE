import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentConfirmation.css'; // 일반 CSS 파일 import

const PaymentConfirmation = ({ itemsToPay, totalAmount, onPayment, onCancel }) => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get('/api/userinfo/list');
                console.log('Fetched Addresses:', response.data);
                setAddresses(response.data);

                if (response.data.length > 0) {
                    setSelectedAddress(response.data[0].fullAddress);
                    setPhoneNumber(response.data[0].phoneNumber);
                    setEmail(response.data[0].email);
                }
            } catch (error) {
                console.error('Error fetching addresses', error);
            }
        };

        fetchAddresses();
    }, []);

    useEffect(() => {
        if (selectedAddress) {
            const selectedInfo = addresses.find(address => address.fullAddress === selectedAddress);
            if (selectedInfo) {
                setPhoneNumber(selectedInfo.phoneNumber);
                setEmail(selectedInfo.email);
            }
        }
    }, [selectedAddress, addresses]);

    const handleAddressConfirmation = () => {
        alert(`선택하신 주소로 배달됩니다\n\n주소: ${selectedAddress}\n이메일: ${email}\n전화번호: ${phoneNumber}`);
        setIsAddressConfirmed(true);
    };

    const handlePayment = () => {
        if (isAddressConfirmed) {
            console.log("결제하기 클릭됨", { selectedAddress, phoneNumber, email });
            onPayment(selectedAddress, phoneNumber, email);  // onPayment 호출 시 인자 전달
        } else {
            alert('주소를 확인해 주세요.');
        }
    };

    return (
        <div className="paymentConfirmation">
            <div className="addressSelection">
                <h3>배송 정보 선택</h3>
                <select
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="addressSelect"
                >
                    {addresses.map((address, index) => (
                        <option key={index} value={address.fullAddress}>
                            {address.fullAddress}
                        </option>
                    ))}
                </select>
                <div className="addressInfo">
                    <p>주소: {selectedAddress}</p>
                    <p>전화번호: {phoneNumber}</p>
                    <p>이메일: {email}</p>
                </div>
                <button onClick={handleAddressConfirmation} className="confirmButton">주소 확인</button>
            </div>

            <h2>결제금액 확인</h2>
            <div className="itemsList">
                {itemsToPay.map((item, index) => (
                    <div key={index} className="itemDetail">
                        <h4>{item.name}</h4>
                        {item.dates.map((dateDetail, idx) => (
                            <div key={idx} className="dateDetail">
                                <p>날짜: {dateDetail.date}</p>
                                {dateDetail.meals.breakfast > 0 && <p>아침: {dateDetail.meals.breakfast} x {item.price} 원</p>}
                                {dateDetail.meals.lunch > 0 && <p>점심: {dateDetail.meals.lunch} x {item.price} 원</p>}
                                {dateDetail.meals.dinner > 0 && <p>저녁: {dateDetail.meals.dinner} x {item.price} 원</p>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="totalAmount">
                <h3>총 결제금액: {totalAmount} 원</h3>
            </div>

            <div className="confirmationButtons">
                <button onClick={onCancel} className="cancelButton">이전 단계</button>
                <button onClick={handlePayment} className="payButton">결제하기</button>
            </div>
        </div>
    );
};

export default PaymentConfirmation;
