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
        기간
      </button>
      <button onClick={handleRangeReset} className="resetButton">초기화</button>
     <div className='mld'>
      <div className='mld1'>
      <span>아침</span>
      </div>
      <div className='mld2'>
      <span>점심</span>
      </div>
      <div className='mld3'>
      <span>저녁</span>
      </div>
      </div>

      <div className="selectionBox">
        
        {selectedItem && selectedDates[selectedItem] && selectedDates[selectedItem].length > 0 ? (
          selectedDates[selectedItem].map((date, index) => (
            <div key={index} className="selectedDate">
              {formatDate(date)} {/* 날짜 포맷팅 */}
              <div className="mealButtonsInline">
              
                <div className="mealSection">
                <button onClick={() => handleMealCountChange(selectedItem, formatDate(date), 'breakfast', Math.max(0, (mealCounts[selectedItem]?.[formatDate(date)]?.breakfast || 0) - 1))} style={{color:'#CCCCCC'}}>-</button>

                  <span>{(mealCounts[selectedItem]?.[formatDate(date)]?.breakfast || 0)}</span>
                  <button onClick={() => handleMealCountChange(selectedItem, formatDate(date), 'breakfast', (mealCounts[selectedItem]?.[formatDate(date)]?.breakfast || 0) + 1)} style={{color:'#CCCCCC'}}>+</button>

                </div>

                <div className="mealSection">
                <button onClick={() => handleMealCountChange(selectedItem, formatDate(date), 'lunch', Math.max(0, (mealCounts[selectedItem]?.[formatDate(date)]?.lunch || 0) - 1))} style={{color:'#CCCCCC'}}>-</button>

                  <span>{(mealCounts[selectedItem]?.[formatDate(date)]?.lunch || 0)}</span>
                  <button onClick={() => handleMealCountChange(selectedItem, formatDate(date), 'lunch', (mealCounts[selectedItem]?.[formatDate(date)]?.lunch || 0) + 1)} style={{color:'#CCCCCC'}}>+</button>

                </div>
                <div className="mealSection">
                <button onClick={() => handleMealCountChange(selectedItem, formatDate(date), 'dinner', Math.max(0, (mealCounts[selectedItem]?.[formatDate(date)]?.dinner || 0) - 1))} style={{color:'#CCCCCC'}}>-</button>

                  <span>{(mealCounts[selectedItem]?.[formatDate(date)]?.dinner || 0)}</span>
                  <button onClick={() => handleMealCountChange(selectedItem, formatDate(date), 'dinner', (mealCounts[selectedItem]?.[formatDate(date)]?.dinner || 0) + 1)} style={{color:'#CCCCCC'}}>+</button>

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
