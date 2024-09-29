import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

interface Period {
    startDate: Date;
    endDate: Date;
}

interface RestDayResponse {
    dailyRestDays: string;
    periodRestDays: string;
    weeklyRestDays: string;
}

const RestDayContent: React.FC = () => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [restDayType, setRestDayType] = useState<string>('DAILY');
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [periods, setPeriods] = useState<Period[]>([]);
    const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
    const today = new Date();
    const oneYearFromToday = new Date();
    oneYearFromToday.setFullYear(today.getFullYear() + 1);

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const resetSelections = () => {
        setSelectedDates([]);
        setPeriods([]);
        setWeeklyDays([]);
    };

    const formatDisplayDate = (date: Date) => {
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        return utcDate.toISOString().substring(2, 10).replace(/-/g, '.');
    };

    useEffect(() => {
        axios.get<RestDayResponse>('/api/rest-days/current')
            .then(response => {
                const restDay = response.data;

                if (restDay.dailyRestDays) {
                    const dailyDates = restDay.dailyRestDays.split(', ').map(day => {
                        const dateParts = day.replace('D.', '').split('.');
                        return new Date(+`20${dateParts[0]}`, +dateParts[1] - 1, +dateParts[2]);
                    });
                    setSelectedDates(dailyDates);
                }

                if (restDay.periodRestDays) {
                    const periodRanges = restDay.periodRestDays.split(', ');
                    const periodsArray = periodRanges.map(range => {
                        const [start, end] = range.split('~');
                        const startDateParts = start.replace('P.', '').split('.');
                        const endDateParts = end.replace('P.', '').split('.');
                        return {
                            startDate: new Date(+`20${startDateParts[0]}`, +startDateParts[1] - 1, +startDateParts[2]),
                            endDate: new Date(+`20${endDateParts[0]}`, +endDateParts[1] - 1, +endDateParts[2]),
                        };
                    });
                    setPeriods(periodsArray);
                }

                if (restDay.weeklyRestDays) {
                    const weeklyDaysArray = restDay.weeklyRestDays.split(', ').map(day => day.replace('W.', ''));
                    setWeeklyDays(weeklyDaysArray);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the rest days!', error);
            });
    }, []);

    const getDatesForWeeklyDays = () => {
        const dates: Date[] = [];
        let currentDate = new Date(today);

        while (currentDate <= oneYearFromToday) {
            if (weeklyDays.includes(daysOfWeek[currentDate.getDay()])) {
                dates.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    };

    const handleDateChange = (date: Date | null) => {
        if (!isEditing || !date) return;

        if (restDayType === 'DAILY') {
            if (!selectedDates.some(d => d.getTime() === date.getTime())) {
                setSelectedDates([...selectedDates, date]);
            }
        } else if (restDayType === 'PERIOD') {
            if (!startDate || (startDate && endDate)) {
                setStartDate(date);
                setEndDate(undefined);
            } else if (!endDate && date > startDate) {
                setEndDate(date);
                addPeriod(); // Call addPeriod when endDate is set
            }
        }
    };

    const addPeriod = () => {
        if (!isEditing) return;

        if (startDate && endDate) {
            const utcStartDate = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
            const utcEndDate = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
            setPeriods([...periods, { startDate: utcStartDate, endDate: utcEndDate }]);
            setStartDate(undefined);
            setEndDate(undefined);
        }
    };

    const handleModeChange = (mode: string) => {
        if (!isEditing) return;

        if (restDayType !== mode) {
            setRestDayType(mode);
            setStartDate(undefined);
            setEndDate(undefined);
        }
    };

    const toggleDayOfWeek = (day: string) => {
        if (!isEditing) return;

        if (weeklyDays.includes(day)) {
            setWeeklyDays(weeklyDays.filter(d => d !== day));
        } else {
            setWeeklyDays([...weeklyDays, day]);
        }
    };

    const saveRestDays = () => {
        const dailyRestDays = selectedDates.map(date => formatDisplayDate(date));
        const periodRestDays = periods.map(period =>
            `${formatDisplayDate(period.startDate)}~${formatDisplayDate(period.endDate)}`
        );
        const weeklyRestDays = weeklyDays.map(day => `W.${day}`);

        console.log("Saving rest days:", {
            dailyRestDays,
            periodRestDays,
            weeklyRestDays
        });

        axios.post('/api/rest-days', {
            dailyRestDays,
            periodRestDays,
            weeklyRestDays
        })
            .then(response => {
                console.log('Rest days saved:', response.data);
                setIsEditing(false);
                resetSelections();
            })
            .catch(error => {
                console.error('There was an error saving the rest days!', error);
            });
    };


    return (
        <>
            <style jsx>{`
              .date-display {
                max-height: 400px; 
                overflow-y: auto;
              }
              .selected-dates-daily,
              .selected-dates-period,
              .selected-dates-weekly {
                border-bottom: 1px solid #D1D5DB; 
                padding-bottom: 1rem; 
                margin-bottom: 1rem;
                display: flex; 
                flex-direction: column; 
                width: 100%; 
              }

              .selected-dates-daily h3,
              .selected-dates-period h3,
              .selected-dates-weekly h3 {
                margin: 0; 
                padding: 0; 
              }

              .no-selected-dates {
                color: #A0AEC0; 
              }
              .day-separator {
                margin: 0 0.5rem;
              }
              .button-transparent {
                background-color: transparent; 
                color: black; 
                cursor: pointer;
                padding: 0.5rem 1rem; 
                border-radius: 8px; 
                margin-right: 0.5rem; 
              }
            `}</style>
            <div className="recent_order p-7 border border-line rounded-[20px] overflow-hidden">
                <div className="flex flex-wrap gap-5">
                    <div className="rest-day-container-first flex-1">
                        <div className="settings-container">
                            <div className="weekly-days mb-4">
                                <span
                                    className="tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold bg-success mb-8"
                                    style={{ cursor: 'pointer' }}>
                                    1. 정기 휴무일이 있나요?
                                </span>
                                <div className="weekly-buttons flex items-center mt-2">
                                    {daysOfWeek.map((day, index) => (
                                        <React.Fragment key={day}>
                                            <button
                                                className={`cursor-pointer text-black ${weeklyDays.includes(day) ? 'bg-gray-300' : 'bg-transparent'} rounded-lg px-3 py-1`}
                                                onClick={() => toggleDayOfWeek(day)}
                                            >
                                                {day}
                                            </button>
                                            {index < daysOfWeek.length - 1 && <span className="day-separator"> / </span>}
                                        </React.Fragment>
                                    ))}
                                </div>

                                <div className="button-group mb-4 mt-2">
                                    <span
                                        className="tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold bg-success">
                                        2. 쉬는 날을 추가할 수 있어요.
                                    </span>
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => handleModeChange('DAILY')}
                                            className={`button-transparent mt-1 ${restDayType === 'DAILY' ? 'bg-gray-300' : ''}`}>
                                            일일
                                        </button>
                                        <span className="day-separator"> / </span>
                                        <button
                                            onClick={() => handleModeChange('PERIOD')}
                                            className={`button-transparent ${restDayType === 'PERIOD' ? 'bg-gray-300' : ''}`}>
                                            기간
                                        </button>
                                    </div>
                                    {restDayType === 'PERIOD' && (
                                        <button
                                            onClick={addPeriod}
                                            className="button-main px-4 py-2 bg-red-500 text-white rounded-lg ml-2"
                                            disabled={!startDate || !endDate}>
                                            기간 추가 ->
                                        </button>

                                    )}
                                </div>
                            </div>

                            <div className="date-picker-container mb-4">
                                <DatePicker
                                    selected={restDayType === 'DAILY' ? null : startDate}
                                    onChange={handleDateChange}
                                    dateFormat="yyyy/MM/dd"
                                    inline
                                    minDate={today}
                                    maxDate={oneYearFromToday}
                                    selectsStart={restDayType === 'PERIOD'}
                                    startDate={startDate}
                                    endDate={endDate}
                                    highlightDates={[
                                        ...selectedDates,
                                        ...periods.flatMap(period => {
                                            const dates = [];
                                            let currentDate = new Date(period.startDate);
                                            while (currentDate <= period.endDate) {
                                                dates.push(new Date(currentDate));
                                                currentDate.setDate(currentDate.getDate() + 1);
                                            }
                                            return dates;
                                        }),
                                        ...getDatesForWeeklyDays(),
                                    ]}
                                />
                            </div>

                            <div className="button-group">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="button-main px-4 py-2 bg-green-500 text-white rounded-lg mt-10 ml-2">
                                    {isEditing ? "취소" : "수정"}
                                </button>
                                {isEditing && (
                                    <>
                                        <button
                                            onClick={resetSelections} // 초기화 버튼
                                            className="button-main px-4 py-2 bg-red-500 text-white rounded-lg mt-10 ml-2">
                                            초기화
                                        </button>
                                        <button
                                            onClick={saveRestDays}
                                            className="button-main px-4 py-2 bg-green-500 text-white rounded-lg mt-10 ml-2">
                                            Save
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="date-display flex-1">
                        <span
                            className="tag px-4 py-1.5 rounded-full bg-opacity-10 caption1 font-semibold bg-success mb-8"
                            style={{ cursor: 'pointer', marginBottom: '5rem' }}>
                            3. 휴무 확인
                        </span>

                        <div className="selected-dates">
                            {/* 일일 섹션 */}
                            <div className="selected-dates-daily mb-4 mt-2">
                                <h3>일일</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
                                    {selectedDates.length > 0 ? (
                                        selectedDates.map((date, index) => (
                                            <span key={index} className="py-1.5 px-4 rounded-full text-button-uppercase text-secondary duration-300">
                                                {`D.${formatDisplayDate(date)}`}
                                            </span>
                                        ))
                                    ) : (
                                        <div className="no-selected-dates">선택된 날짜가 없습니다</div>
                                    )}
                                </div>
                            </div>

                            {/* 기간 섹션 */}
                            <div className="selected-dates-period mb-4">
                                <h3>기간</h3>
                                {periods.length > 0 ? (
                                    periods.map((period, index) => (
                                        <span key={index} className="py-1.5 px-4 rounded-full text-button-uppercase text-secondary duration-300">
                                            {`P.${formatDisplayDate(period.startDate)}~${formatDisplayDate(period.endDate)}`}
                                        </span>
                                    ))
                                ) : (
                                    <div className="no-selected-dates">선택된 날짜가 없습니다</div>
                                )}
                            </div>

                            {/* 주간 섹션 */}
                            <div className="selected-dates-weekly mb-4">
                                <h3>주간</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {weeklyDays.length > 0 ? (
                                        weeklyDays.map((day, index) => (
                                            <span key={index} className="py-1.5 px-4 rounded-full text-button-uppercase text-secondary duration-300">
                                                {day}
                                            </span>
                                        ))
                                    ) : (
                                        <div className="no-selected-dates">선택된 날짜가 없습니다</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export { RestDayContent };
