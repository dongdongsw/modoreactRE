import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentConfirmation.css'; // 일반 CSS 파일 import
import * as Icon from "@phosphor-icons/react/dist/ssr";

const PaymentConfirmation = ({ itemsToPay, totalAmount, onPayment, onCancel }) => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
    const [activeIndices, setActiveIndices] = useState([]); // 여러 항목의 열림 상태를 관리하는 배열

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get('/api/userinfo/list');
                console.log('Fetched Addresses:', response.data);
                setAddresses(response.data);

                if (response.data.length > 0) {
                    setSelectedAddress(response.data[0].alias);
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

    const handleToggle = (index) => {
        // 클릭한 항목의 열림 상태를 토글합니다.
        setActiveIndices(prevActiveIndices => {
            if (prevActiveIndices.includes(index)) {
                // 이미 열려 있는 경우 닫기 (배열에서 인덱스 제거)
                return prevActiveIndices.filter(i => i !== index);
            } else {
                // 아직 열려 있지 않은 경우 열기 (배열에 인덱스 추가)
                return [...prevActiveIndices, index];
            }
        });
    };
    
    return (
        <>
            <div className="paymainconfrimContainer">
                <div className="paymainconfirmContainer1">
                    <div className="paymainconfirmContainer2">
                        {/* 첫 번째 그리드 항목: 배송 정보 선택 */}
                        <div className="addressSelectMenu">
                            <div className="login flex justify-between gap-4">
                                <h4 className="heading4">배송 정보 선택</h4>
                            </div>
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
                                <div className="addressInfo-a">
                                    <p>주소: {selectedAddress}</p>
                                </div>
                                <div className="addressInfo-b">
                                    <p>전화번호: {phoneNumber}</p>
                                    
                                </div>
                                <div className="addressInfo-c">
                                    <p>이메일: {email}</p>
                                    
                                </div>
                            </div>
                            <div className="confirmButton-container">
                                <button onClick={handleAddressConfirmation} className="confirmButton">주소 확인</button>
                            </div>
                        </div>
    
                        {/* 두 번째 그리드 항목: 결제 금액 확인 */}
                        <div className="paymainconfirmpay">
                            <h4 className="heading4">결제 금액 확인서</h4>
                            <hr id="hz" />
                            <div className="itemsList">
                                {itemsToPay.map((item, index) => (
                                    <div key={index} className="itemDetail">
                                        <div
                                            className="item-header"
                                            onClick={() => handleToggle(index)}
                                            style={{
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <h5 className="heading5">{item.name}</h5>
                                            {activeIndices.includes(index) ? (
                                                <Icon.CaretDown size={24} weight="bold" color="#ccc" />
                                            ) : (
                                                <Icon.CaretRight size={24} weight="bold" color="#ccc" />
                                            )}
                                        </div>
                                        {activeIndices.includes(index) && (
                                            <>
                                                {item.dates.map((dateDetail, idx) => (
                                                    <div key={idx} className="dateDetail">
                                                        <p>{dateDetail.date}</p>
                                                        <div className="dateDetail-meal">
                                                            {dateDetail.meals.breakfast > 0 && (
                                                                <p>
                                                                    아침 : {item.price}원 x {dateDetail.meals.breakfast}개
                                                                </p>
                                                            )}
                                                            {dateDetail.meals.lunch > 0 && (
                                                                <p>
                                                                    점심 : {item.price}원 x {dateDetail.meals.lunch}개
                                                                </p>
                                                            )}
                                                            {dateDetail.meals.dinner > 0 && (
                                                                <p>
                                                                    저녁 : {item.price}원 x {dateDetail.meals.dinner}개
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="dateDetail-meal-line" />
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <hr id="hz" />
    
                            <div className="totalAmount">
                                <h4 className="heading4">총 결제금액: {totalAmount} 원</h4>
                                <div className="totalAmountLine"></div> {/* 선을 위한 div 추가 */}

                            </div>
    
                            
                    </div>
                    <div className="confirmationButtons">
                        <button onClick={onCancel} className="cancelButton">이전 단계</button>
                    </div>
                    <div className="confirmationButtons1">
                        <button onClick={handlePayment} className="payButton">결제하기</button>
                    </div>

                        </div>
                </div>
                
            </div>
        </>
    );
};

export default PaymentConfirmation;