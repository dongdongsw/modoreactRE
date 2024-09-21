import React from 'react';
import './CompanySelector.css'; // 일반 CSS 파일 import

const CompanySelector = ({ categorizedItems, activeCompany, setActiveCompany, selectedItem, setSelectedItem, fetchRestDays }) => {
  const handleCompanySelection = (companyId) => {
    setActiveCompany(activeCompany === companyId ? null : companyId);
    if (activeCompany !== companyId) {
      fetchRestDays(companyId);  // 회사 ID로 쉬는 날 데이터를 가져옴
    }
  };

  return (
    <div className="companySelector"> {/* 일반 className 사용 */}
      <h3>업체 선택</h3>
      {Object.keys(categorizedItems).map((companyId) => (
        <div key={companyId}>
          <button
            onClick={() => handleCompanySelection(companyId)}
            className={`companyButton ${activeCompany === companyId ? 'active' : ''}`} 
          >
            회사 ID: {companyId}
          </button>
          {activeCompany === companyId && (
            <div className="companyItems">
              {categorizedItems[companyId].map((item) => (
                <div key={item.merchanUid} className="cartItem">
                  <input
                    type="radio"
                    name="selectedItem"
                    onChange={() => setSelectedItem(item.merchanUid)}
                    checked={selectedItem === item.merchanUid}
                  />
                  <label>{item.name} - {item.price} 원</label>
                </div>
              ))}
              {/* 여기서 결제 버튼을 추가합니다 */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CompanySelector;
