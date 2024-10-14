import React, { useState, useEffect } from 'react';
import './CompanySelector.css'; // 일반 CSS 파일 import
import axios from 'axios'; // axios import
import * as Icon from "@phosphor-icons/react/dist/ssr";


const CompanySelector = ({ categorizedItems, activeCompany, setActiveCompany, selectedItem, setSelectedItem, fetchRestDays }) => {
  const [companyNames, setCompanyNames] = useState({}); // 각 회사의 이름을 저장하는 상태
  const [activeIndex, setActiveIndex] = useState([]); // 여러 항목의 열림 상태를 관리하는 배열

  const handleCompanySelection = (companyId) => {
    setActiveCompany(activeCompany === companyId ? null : companyId);
    if (activeCompany !== companyId) {
      fetchRestDays(companyId);  // 회사 ID로 쉬는 날 데이터를 가져옴
    }
  };

  // Store ID를 조회하는 함수
  const fetchStoreIdByCompanyId = async (companyId) => {
    try {
      const response = await axios.get(`/api/stores/${companyId}/name`);
      return response.data; // store의 name 값 반환
    } catch (error) {
      console.error(`Error fetching store name for companyId ${companyId}:`, error);
      return null;
    }
  };

  const handleToggle = (index) => {
    // 클릭한 항목의 열림 상태를 토글하고, 다른 항목은 닫음
    setActiveIndex(prevIndex => prevIndex === index ? null : index);
  };

  // 회사 ID가 선택되면 이름을 가져옴
  useEffect(() => {
    Object.keys(categorizedItems).forEach(async (companyId) => {
      if (!companyNames[companyId]) {

        const name = await fetchStoreIdByCompanyId(companyId);

        setCompanyNames((prevNames) => ({
          ...prevNames,
          [companyId]: name, // 회사 이름을 상태에 저장
        }));
        
      }
    });
  }, [categorizedItems]); // categorizedItems가 변경될 때마다 실행
  
  return (
    <div className="companySelector">
      {Object.keys(categorizedItems).map((companyId, index) => (
        <div key={companyId}>
          <div className="compaanySelector2">
            <button
              onClick={() => {
                handleCompanySelection(companyId);
                handleToggle(index);
              }}
              className={`companyButton ${activeCompany === companyId ? 'active' : ''}`}
            >
              <div></div>
              {companyNames[companyId] || '로딩 중...'}
              {activeIndex === index ? (
                <Icon.CaretDown className='companyIcon' size={20} weight="bold" color='#0EAE7A' />
              ) : (
                <Icon.CaretRight className='companyIcon' size={20} weight="bold" color='#000000' />
              )}
            </button>
          </div>
          <div className={`companyItems ${activeIndex === index ? 'active' : ''}`}>
            {activeCompany === companyId && (
              <div>
                {categorizedItems[companyId].map((item) => (
                  <div key={item.merchanUid} className="cartItem">
                    <div className="menuselect">
                      <input
                        type="radio"
                        name="selectedItem"
                        onChange={() => setSelectedItem(item.merchanUid)}
                        checked={selectedItem === item.merchanUid}
                      />
                      <label> {item.name} : {item.price} 원</label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
  
};

export default CompanySelector;
