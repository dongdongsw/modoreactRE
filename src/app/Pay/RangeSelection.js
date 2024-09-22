import React from 'react';
import './RangeSelection.css'; // 일반 CSS 파일 import

const RangeSelection = ({ selectedItem, selectedDates, handleMealCountChange, mealCounts, setIsRangeSelectionActive, setIsDailySelectionActive, saveDatesToLocalStorage, setSelectedDates }) => {
  const handleRangeReset = () => {
    if (selectedItem) {
      setSelectedDates(prev => {
        const newDates = { ...prev, [selectedItem]: [] };
        saveDatesToLocalStorage(newDates, {}, mealCounts);
        return newDates;
      });
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD' 형식으로 포맷팅
  };

  return (
    <div className="rangeSelection">
      <button 
        onClick={() => {
          setIsRangeSelectionActive(true);
          setIsDailySelectionActive(false);
        }} 
        className={`rangeButton ${selectedDates[selectedItem] ? 'active' : ''}`}
      >
        기간 이용
      </button>
      <button onClick={handleRangeReset} className="resetButton">초기화</button>
      <div className="selectionBox">
        
        {selectedItem && selectedDates[selectedItem] && selectedDates[selectedItem].length > 0 ? (
          selectedDates[selectedItem].map((date, index) => (
            <div key={index} className="selectedDate">
              {formatDate(date)} {/* 날짜 포맷팅 */}
              <div className="mealButtonsInline">
                <div className="mealSection">
                  <span>아침</span>
                  <button onClick={() => handleMealCountChange(selectedItem, formatDate(date), 'breakfast', (mealCounts[selectedItem]?.[formatDate(date)]?.breakfast || 0) + 1)}>+</button>
                  <span>{(mealCounts[selectedItem]?.[formatDate(date)]?.breakfast || 0)}</span>
                  <button onClick={() => handleMealCountChange(selectedItem, formatDate(date), 'breakfast', Math.max(0, (mealCounts[selectedItem]?.[formatDate(date)]?.breakfast || 0) - 1))}>-</button>
                </div>
                <div className="mealSection">
                  <span>점심</span>
                  <button onClick={() => handleMealCountChange(selectedItem, formatDate(date), 'lunch', (mealCounts[selectedItem]?.[formatDate(date)]?.lunch || 0) + 1)}>+</button>
                  <span>{(mealCounts[selectedItem]?.[formatDate(date)]?.lunch || 0)}</span>
                  <button onClick={() => handleMealCountChange(selectedItem, formatDate(date), 'lunch', Math.max(0, (mealCounts[selectedItem]?.[formatDate(date)]?.lunch || 0) - 1))}>-</button>
                </div>
                <div className="mealSection">
                  <span>저녁</span>
                  <button onClick={() => handleMealCountChange(selectedItem, formatDate(date), 'dinner', (mealCounts[selectedItem]?.[formatDate(date)]?.dinner || 0) + 1)}>+</button>
                  <span>{(mealCounts[selectedItem]?.[formatDate(date)]?.dinner || 0)}</span>
                  <button onClick={() => handleMealCountChange(selectedItem, formatDate(date), 'dinner', Math.max(0, (mealCounts[selectedItem]?.[formatDate(date)]?.dinner || 0) - 1))}>-</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>날짜를 선택하세요.</p>
        )}
      </div>
    </div>
  );
};

export default RangeSelection;
