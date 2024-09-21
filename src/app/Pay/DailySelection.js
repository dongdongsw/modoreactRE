import React from 'react';
import './DailySelection.css'; // 일반 CSS 파일 import

const DailySelection = ({ selectedItem, selectedDays, handleMealCountChange, mealCounts, setIsRangeSelectionActive, setIsDailySelectionActive, saveDatesToLocalStorage, setSelectedDays }) => {

  const handleDailyReset = () => {
    if (selectedItem) {
      setSelectedDays(prev => {
        const newDays = { ...prev, [selectedItem]: [] };
        saveDatesToLocalStorage({}, newDays, mealCounts);
        return newDays;
      });
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD' 형식으로 포맷팅
  };

  return (
    <div className="dailySelection">
      <button 
        onClick={() => {
          setIsDailySelectionActive(true);
          setIsRangeSelectionActive(false);
        }} 
        className={`dailyButton ${selectedDays[selectedItem] ? 'active' : ''}`}
      >
        일일 기간
      </button>
      <button onClick={handleDailyReset} className="resetButton">초기화</button>
      <div className="selectionBox">
        <h4>일일 기간</h4>
        {selectedItem && selectedDays[selectedItem] && selectedDays[selectedItem].length > 0 ? (
          selectedDays[selectedItem].map((date, index) => (
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

export default DailySelection;
