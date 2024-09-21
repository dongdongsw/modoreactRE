import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateSelector.css'; // 일반 CSS 파일 import

const DateSelector = ({ 
  selectedItem, 
  selectedDates, 
  selectedDays, 
  setSelectedDates, 
  setSelectedDays, 
  saveDatesToLocalStorage, 
  isRangeSelectionActive, 
  isDailySelectionActive, 
  restDays  // 새로운 prop으로 쉬는 날 정보 추가
}) => {
  
  const handleDateSelection = (date) => {
    if (selectedItem) {
      if (isRangeSelectionActive) {
        const currentDates = selectedDates[selectedItem] || [];
        if (currentDates.length === 0 || (currentDates.length > 1)) {
          setSelectedDates(prev => {
            const newDates = { ...prev, [selectedItem]: [date] };
            saveDatesToLocalStorage(newDates, selectedDays, {});
            return newDates;
          });
        } else {
          const startDate = currentDates[0];
          const dates = [];
          let currentDate = new Date(startDate);
          while (currentDate <= date) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
          setSelectedDates(prev => {
            const newDates = { ...prev, [selectedItem]: dates };
            saveDatesToLocalStorage(newDates, selectedDays, {});
            return newDates;
          });
        }
      } else if (isDailySelectionActive) {
        setSelectedDays(prev => {
          const currentDays = prev[selectedItem] || [];
          const newDays = currentDays.some(selectedDay => selectedDay.toDateString() === date.toDateString())
            ? currentDays.filter(selectedDay => selectedDay.toDateString() !== date.toDateString())
            : [...currentDays, date];
          const updatedDays = { ...prev, [selectedItem]: newDays };
          saveDatesToLocalStorage(selectedDates, updatedDays, {});
          return updatedDays;
        });
      }
    }
  };

  const isDateRestDay = (date) => {
    const formattedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0).toISOString().slice(2, 10).replace(/-/g, '.');  // '24.09.02' 형태
    const weekDay = date.getDay();  // 0: 일요일, 6: 토요일
    const weekDayMap = ['일', '월', '화', '수', '목', '금', '토'];  // 한글 요일 맵핑
  
    const isDailyRestDay = restDays.dailyRestDays.some(day => day === formattedDate);
    const isPeriodRestDay = restDays.periodRestDays.some(period => {
        const [start, end] = period.split('~');
        return formattedDate >= start && formattedDate <= end;
    });
    const isWeeklyRestDay = restDays.weeklyRestDays.some(weekDayStr => {
      const restDayWeek = weekDayStr.slice(2); // '금'
      return weekDayMap[weekDay] === restDayWeek;
    });
  
    return isDailyRestDay || isPeriodRestDay || isWeeklyRestDay;
  };

  const dayClassName = (date) => {
    if (isDateRestDay(date)) {
      return 'restDay';  // 쉬는 날 스타일 적용
    }
    
    if (isRangeSelectionActive && selectedItem && selectedDates[selectedItem]) {
      const [startDate, endDate] = [selectedDates[selectedItem][0], selectedDates[selectedItem][selectedDates[selectedItem].length - 1]];
      if (startDate && endDate && date >= startDate && date <= endDate) {
        return 'selectedRange';
      }
    }
    
    if (isDailySelectionActive && selectedItem && selectedDays[selectedItem]) {
      if (selectedDays[selectedItem].some(selectedDay => selectedDay.toDateString() === date.toDateString())) {
        return 'selectedRange';
      }
    }
    
    return undefined;
  };

  return (
    <div className="dateSelector">
      <h3>날짜 선택</h3>
      <DatePicker
        selected={selectedItem ? (selectedDates[selectedItem]?.[0] || selectedDays[selectedItem]?.[0]) : null}
        onChange={handleDateSelection}
        minDate={new Date()}
        maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
        inline
        dayClassName={dayClassName}
        highlightDates={selectedItem ? [...(selectedDates[selectedItem] || []), ...(selectedDays[selectedItem] || [])] : []}
        filterDate={(date) => !isDateRestDay(date)}  // 쉬는 날을 선택하지 못하게 필터링
      />
    </div>
  );
};

export default DateSelector;
