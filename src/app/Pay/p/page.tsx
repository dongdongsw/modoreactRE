// pages/pay.js
"use client"; // 클라이언트 컴포넌트로 지정


import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // next/navigation에서 관련 훅 가져오기
import axios, { AxiosError } from 'axios'; // AxiosError를 import
import CompanySelector from '../CompanySelector';
import DateSelector from '../DateSelector';
import RangeSelection from '../RangeSelection';
import DailySelection from '../DailySelection';
import NextStepButton from '../NextStepButton';
import PaymentConfirmation from '../PaymentConfirmation';
import StepIndicator from '../StepIndicator';
import '../Pay.css';

interface SelectedDates {
  [merchanUid: string]: Date[]; // 날짜 배열을 저장하는 객체
}

interface SelectedDays {
  [merchanUid: string]: Date[]; // 날짜 배열을 저장하는 객체
}

interface MealCounts {
  breakfast: number;
  lunch: number;
  dinner: number;
}

interface Meals {
  [itemId: string]: {
    [dateKey: string]: MealCounts;
  };
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

const Pay = () => {
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로(pathname) 추출
  const searchParams = useSearchParams(); // query string 정보 추출
  const isSingleItemMode = searchParams.get('singleItemMode') === 'true'; // query string에서 값 추출
  const singleItemMerchanUid = searchParams.get('singleItemMerchanUid');
  const [isMounted, setIsMounted] = useState(false); // 클라이언트에서만 동작하도록 상태 추가

  useEffect(() => {
    setIsMounted(true); // 컴포넌트가 클라이언트에 마운트되면 상태를 true로 설정
  }, []);
  
  
  const [cartItems, setCartItems] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDays, setSelectedDays] = useState<SelectedDays>({});
  const [selectedDates, setSelectedDates] = useState<SelectedDates>({});
  const [mealCounts, setMealCounts] = useState<Meals>({});
  const [isRangeSelectionActive, setIsRangeSelectionActive] = useState(false);
  const [isDailySelectionActive, setIsDailySelectionActive] = useState(false);
  const [iamportLoaded, setIamportLoaded] = useState(false);
  const [isNextStep, setIsNextStep] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [itemsToPay, setItemsToPay] = useState<any[]>([]);  // itemsToPay를 any[] 타입으로 지정
  const [currentStep, setCurrentStep] = useState(0);
  const [restDays, setRestDays] = useState({
    dailyRestDays: [],
    periodRestDays: [],
    weeklyRestDays: [],
  });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

  useEffect(() => {
    

  // singleItemMerchanUid가 string인지 확인하고 처리
  if (isSingleItemMode && typeof singleItemMerchanUid === 'string') {
    fetchSingleItemCart(singleItemMerchanUid);
  } else {
    fetchCartItems();
  }
  loadSavedDates();
  loadIamportScript();
  fetchUserAddresses();
}, [isSingleItemMode, singleItemMerchanUid]);

  const fetchSingleItemCart = async (merchanUid: string) => {
    try {
      const response = await axios.get('/api/cart/view');
      const singleItem = response.data.filter((item: any) => item.merchanUid === merchanUid);
      setCartItems(singleItem);
    } catch (error) {
      console.error('단일 상품 전용 장바구니 항목 가져오기 실패', error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('/api/cart/view');
      setCartItems(response.data);
    } catch (error) {
      console.error('기존 장바구니 항목 가져오기 실패', error);
    }
  };

  useEffect(() => {
    if (activeCompany) {
      fetchRestDays(activeCompany);
    }
  }, [activeCompany]);

  const loadIamportScript = () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
    script.onload = () => {
      if (window.IMP) {
        setIamportLoaded(true);
      } else {
        console.error('IMP 객체를 로드하는 데 실패했습니다.');
      }
    };
    script.onerror = () => {
      console.error('IAMPORT 스크립트를 로드하는 데 실패했습니다.');
    };
    document.body.appendChild(script);
  };

  const fetchRestDays = async (companyId: string) => {
    try {
      const response = await axios.get(`/api/rest-days/by-company`, { params: { companyId } });
      const { dailyRestDays, periodRestDays, weeklyRestDays } = response.data;
  
      setRestDays({
        dailyRestDays: dailyRestDays.split(', ').map((day: string) => day.slice(2)),
        periodRestDays: periodRestDays.split(', ').map((period: string) => period.slice(2)),
        weeklyRestDays: weeklyRestDays.split(', '),
      });
    } catch (error) {
      // error가 AxiosError 타입인지 확인
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          setRestDays({
            dailyRestDays: [],
            periodRestDays: [],
            weeklyRestDays: [],
          });
          console.warn(`No rest days found for companyId: ${companyId}`);
        } else {
          console.error('Failed to fetch rest days', error);
        }
      } else {
        // Axios 에러가 아닐 경우 일반 에러 처리
        console.error('An unexpected error occurred', error);
      }
    }
  };
  const loadSavedDates = () => {
    const savedDates = JSON.parse(localStorage.getItem('selectedDates') || '{}');
    const savedDays = JSON.parse(localStorage.getItem('selectedDays') || '{}');
    const savedMeals = JSON.parse(localStorage.getItem('mealCounts') || '{}');

    const convertedDates = convertDateStringsToDates(savedDates);
    const convertedDays = convertDateStringsToDates(savedDays);

    setSelectedDates(convertedDates);
    setSelectedDays(convertedDays);
    setMealCounts(savedMeals);
  };

  const convertDateStringsToDates = (dateObject: any) => {
    return Object.fromEntries(
      Object.entries(dateObject).map(([itemId, dates]) => [
        itemId,
        Array.isArray(dates) ? dates.map((dateString) => new Date(dateString)) : [],
      ])
    );
  };

  const saveDatesToLocalStorage = (dates: any, days: any, meals: any) => {
    localStorage.setItem('selectedDates', JSON.stringify(dates));
    localStorage.setItem('selectedDays', JSON.stringify(days));
    localStorage.setItem('mealCounts', JSON.stringify(meals));
  };

  const handleMealCountChange = (itemId: string, date: string, mealType: MealType, count: number) => {
    const dateKey = formatDate(new Date(date));  // Date 객체로 변환 후 포맷팅
    console.log("Updating meal count for:", dateKey, "Item ID:", itemId, "Meal type:", mealType, "New count:", count);
  
    setMealCounts((prev) => {
      const newMeals = { ...prev };
      if (!newMeals[itemId]) newMeals[itemId] = {};
      if (!newMeals[itemId][dateKey]) newMeals[itemId][dateKey] = { breakfast: 0, lunch: 0, dinner: 0 };
      
      // 이제 mealType이 'breakfast', 'lunch', 'dinner' 중 하나로 제한되었기 때문에 타입 오류가 해결됩니다.
      newMeals[itemId][dateKey][mealType] = count;
  
      saveDatesToLocalStorage(selectedDates, selectedDays, newMeals);
      console.log("Updated mealCounts:", newMeals);
      return newMeals;
    });
  };

  const categorizedItems = cartItems.reduce((acc: any, item: any) => {
    if (!acc[item.companyId]) {
      acc[item.companyId] = [];
    }
    acc[item.companyId].push(item);
    return acc;
  }, {});

  const calculateTotalAmount = () => {
    let total = 0;
    const itemsToPay: any[] = [];

    const itemsToProcess = activeCompany ? categorizedItems[activeCompany]?.filter((item: any) => 
      hasSelectedDatesOrDays(item.merchanUid)
    ) : [];

    if (Array.isArray(itemsToProcess)) {
      itemsToProcess.forEach((item: any) => {
        const datesDetail: any[] = [];
        const selectedDatesSet = getSelectedDatesSet(item.merchanUid);

        selectedDatesSet.forEach((date: any) => {
          const mealCountsForDate = getMealCountsForDate(item.merchanUid, date);

          if (mealCountsForDate.breakfast > 0 || mealCountsForDate.lunch > 0 || mealCountsForDate.dinner > 0) {
            const totalMealsForDate =
              mealCountsForDate.breakfast + mealCountsForDate.lunch + mealCountsForDate.dinner;
            total += item.price * totalMealsForDate;

            datesDetail.push({
              date: formatDate(date),
              meals: mealCountsForDate,
            });
          }
        });

        if (datesDetail.length > 0) {
          itemsToPay.push({
            name: item.name,
            price: item.price,
            dates: datesDetail,
          });
        }
      });
    } else {
      console.error('No items found for activeCompany:', activeCompany);
    }

    setItemsToPay(itemsToPay);
    setTotalAmount(total);
  };

  const hasSelectedDatesOrDays = (merchanUid: string) => {
    return (
      (selectedDays[merchanUid]?.length > 0) ||  // 옵셔널 체이닝 사용
      (selectedDates[merchanUid]?.length > 0)    // 옵셔널 체이닝 사용
    );
  };
  

  const getSelectedDatesSet = (merchanUid: string) => {
    const selectedDatesSet = new Set([
      ...(selectedDays[merchanUid] || []),
      ...(selectedDates[merchanUid] || []),
    ]);
    return selectedDatesSet;
  };

  const getMealCountsForDate = (merchanUid: string, date: Date) => {
    const dateKey = formatDate(date);
    const mealCountsForDate = mealCounts[merchanUid]?.[dateKey] || { breakfast: 0, lunch: 0, dinner: 0 };
    return mealCountsForDate;
  };

  const formatDate = (date: Date) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    return utcDate.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 반환
  };

  const fetchUserAddresses = async () => {
    try {
      const response = await axios.get('/api/userinfo/list');
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddress(response.data[0].fullAddress);
        setPhoneNumber(response.data[0].phoneNumber);
        setEmail(response.data[0].email);
      }
    } catch (error) {
      console.error('Error fetching user addresses', error);
    }
  };

  useEffect(() => {
    fetchUserAddresses(); // 주소 가져오기
  }, []);

  const handleConfirmAddress = () => {
    alert(`해당 정보로 배송됩니다.\n\n주소: ${selectedAddress}\n폰번호: ${phoneNumber}\n이메일: ${email}`);
    setIsAddressConfirmed(true);
  };

  const handleNextStep = () => {
    calculateTotalAmount();
    setCurrentStep(1);
    setIsNextStep(true);
  };

  const handleBackToSelection = () => {
    setCurrentStep(0);
    setIsNextStep(false);
  };

  const handlePayment = (selectedAddress: string, phoneNumber: string, email: string) => {
    setCurrentStep(2);
    if (activeCompany) {
      handleCompanyPayment(activeCompany, selectedAddress, phoneNumber, email);
    } else {
      console.error('활성화된 회사가 없습니다.');
    }
  };

  const handleCompanyPayment = (companyId: string, selectedAddress: string, phoneNumber: string, email: string) => {
    if (!iamportLoaded || !window.IMP) {
      alert('결제 모듈이 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const itemsToPay = categorizedItems[companyId]?.filter((item: any) =>
      hasSelectedDatesOrDays(item.merchanUid)
    );

    if (!itemsToPay || itemsToPay.length === 0) {
      alert('결제할 항목이 없습니다.');
      return;
    }

    const { totalAmount, merchantUidList, combinedName } = preparePaymentData(itemsToPay);

    if (totalAmount > 0) {
      processPayment(companyId, totalAmount, merchantUidList, combinedName, selectedAddress, phoneNumber, email);
    } else {
      alert('결제할 항목이 없습니다.');
    }
  };

  const preparePaymentData = (itemsToPay: any[]) => {
    let totalAmount = 0;
    const merchantUidList: string[] = [];
    const randomMerchantUid = Math.random().toString(36).substr(2, 16);
    const combinedName = itemsToPay.map((item: any) => item.name).join(', ');

    itemsToPay.forEach((item: any) => {
      getSelectedDatesSet(item.merchanUid).forEach((date: any) => {
        const mealCountsForDate = getMealCountsForDate(item.merchanUid, date);
        const totalMealsForDate =
          mealCountsForDate.breakfast + mealCountsForDate.lunch + mealCountsForDate.dinner;

        totalAmount += item.price * totalMealsForDate;

        if (mealCountsForDate.breakfast > 0) {
          merchantUidList.push(
            `${randomMerchantUid}.${item.merchanUid}.${formatDate(date)}.M${mealCountsForDate.breakfast}`
          );
        }
        if (mealCountsForDate.lunch > 0) {
          merchantUidList.push(
            `${randomMerchantUid}.${item.merchanUid}.${formatDate(date)}.L${mealCountsForDate.lunch}`
          );
        }
        if (mealCountsForDate.dinner > 0) {
          merchantUidList.push(
            `${randomMerchantUid}.${item.merchanUid}.${formatDate(date)}.D${mealCountsForDate.dinner}`
          );
        }
      });
    });

    return { totalAmount, merchantUidList, combinedName };
  };

  const processPayment = (
    companyId: string,
    totalAmount: number,
    merchantUidList: string[],
    combinedName: string,
    selectedAddress: string,
    phoneNumber: string,
    email: string
  ) => {
    axios
      .get('/login/user/nickname')
      .then((response) => {
        const nicknameData = response.data.nickname;
        return axios.get('/api/userinfo').then((infoResponse) => {
          return { nicknameData, infoData: infoResponse.data };
        });
      })
      .then(({ nicknameData }) => {
        const { IMP } = window;
        IMP.init(companyId);

        IMP.request_pay(
          {
            pg: 'html5_inicis',
            pay_method: 'card',
            merchant_uid: merchantUidList[0],
            name: combinedName,
            amount: totalAmount,
            buyer_email: email,
            buyer_name: String(nicknameData),
            buyer_tel: phoneNumber,
            buyer_addr: selectedAddress,
          },
          function (rsp: any) {
            if (rsp.success) {
              alert('주문이 완료되었습니다.');
              savePaymentToDatabase(merchantUidList.join(', '), companyId, combinedName, totalAmount, rsp);
            } else {
              alert('결제 실패: ' + rsp.error_msg);
            }
          }
        );
      })
      .catch((error) => {
        console.error('결제 정보를 불러오는 데 실패했습니다.', error);
        alert('결제 정보를 불러오는 데 실패했습니다.');
      });
  };

  const savePaymentToDatabase = (
    merchantUid: string,
    companyId: string,
    name: string,
    amountTotal: number,
    rsp: any
  ) => {
    axios
      .post('/api/payment/callback', {
        pg: rsp.pg_provider,
        payMethod: rsp.pay_method,
        merchantUid: merchantUid,
        name: name,
        amountTotal: amountTotal,
        buyerEmail: rsp.buyer_email,
        buyerName: rsp.buyer_name,
        buyerTel: rsp.buyer_tel,
        buyerAddr: rsp.buyer_addr,
        externalId: rsp.merchant_uid,
        companyId: companyId,
      })
      .then(() => {
        console.log('결제 정보 저장 완료:', merchantUid);
      })
      .catch((error) => {
        console.error('결제 정보 저장 중 오류 발생:', error);
      });
  };

  if (!isMounted) {
    return null; // 서버사이드 렌더링 시 아무것도 렌더링하지 않음
  }
  return (
    <div className="pay-container">
      <div className="step-indicator-container">
        <StepIndicator currentStep={currentStep} />
      </div>
      {!isNextStep ? (
        <>
          <CompanySelector
            categorizedItems={categorizedItems}
            activeCompany={activeCompany}
            setActiveCompany={setActiveCompany}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            fetchRestDays={fetchRestDays} // fetchRestDays 함수 전달
          />
          <DateSelector
            selectedItem={selectedItem}
            selectedDates={selectedDates}
            selectedDays={selectedDays}
            setSelectedDates={setSelectedDates}
            setSelectedDays={setSelectedDays}
            saveDatesToLocalStorage={saveDatesToLocalStorage}
            isRangeSelectionActive={isRangeSelectionActive}
            isDailySelectionActive={isDailySelectionActive}
            restDays={restDays} // 쉬는 날 정보 전달
          />
          <div className="extra-section">
            <RangeSelection
              selectedItem={selectedItem}
              selectedDates={selectedDates}
              handleMealCountChange={handleMealCountChange}
              mealCounts={mealCounts}
              setIsRangeSelectionActive={setIsRangeSelectionActive}
              setIsDailySelectionActive={setIsDailySelectionActive}
              saveDatesToLocalStorage={saveDatesToLocalStorage}
              setSelectedDates={setSelectedDates}
            />
            <DailySelection
              selectedItem={selectedItem}
              selectedDays={selectedDays}
              handleMealCountChange={handleMealCountChange}
              mealCounts={mealCounts}
              setIsRangeSelectionActive={setIsRangeSelectionActive}
              setIsDailySelectionActive={setIsDailySelectionActive}
              saveDatesToLocalStorage={saveDatesToLocalStorage}
              setSelectedDays={setSelectedDays}
            />
          </div>

          <NextStepButton onNext={handleNextStep} />
        </>
      ) : (
        <PaymentConfirmation
          itemsToPay={itemsToPay}
          totalAmount={totalAmount}
          onPayment={handlePayment}
          onCancel={handleBackToSelection}
        />
      )}
    </div>
  );
};

export default Pay;
