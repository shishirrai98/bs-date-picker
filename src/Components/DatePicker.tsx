import React, {useState, useEffect, useRef} from 'react';
import './DatePicker.css';
import useDateFunction from "../Hooks/useDateFunction";
import moment from "moment";
import DateClass from "../Function/BikramSambat.tsx";
import {CiCalendar} from "react-icons/ci";

interface DatePickerProps {
    startWeekDay?: number;
    weekendDays?: number[];
    language?: 'en' | 'ne';
}

const DatePicker: React.FC<DatePickerProps> = ({
                                                   startWeekDay = 0,
                                                   weekendDays = [6],
                                                   language = 'en',
                                               }) => {
    const {convertDate} = useDateFunction();
    const todayBSDate = convertDate({date: new Date().toISOString().split('T')[0], to: 'bs'});
    const [selectedDate, setSelectedDate] = useState<{ year: number, month: number, day: number } | null>(null);
    const [currentBSDate, setCurrentBSDate] = useState(todayBSDate);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const daysOfWeekEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysOfWeekNe = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि'];

    const nepaliMonths = [
        'बैशाख', 'जेष्ठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
        'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुण', 'चैत्र'
    ];
    const englishMonths = [
        'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
        'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
    ];

    const minBSYear = 1970;
    const maxBSYear = 2100;
    const yearRange = Array.from({length: maxBSYear - minBSYear + 1}, (_, i) => minBSYear + i);

    const handleDateClick = (day: number) => {
        setSelectedDate({year: currentBSDate.year, month: currentBSDate.month, day});
        setShowCalendar(false);
    };

    const handlePrevMonth = () => {
        setCurrentBSDate((prevDate) => {
            let newMonth = prevDate.month - 1;
            let newYear = prevDate.year;

            if (newMonth < 1) {
                newMonth = 12;
                newYear -= 1;
            }

            return {
                year: Math.max(minBSYear, newYear),
                month: newMonth,
                day: 1
            };
        });
    };

    const handleNextMonth = () => {
        setCurrentBSDate((prevDate) => {
            let newMonth = prevDate.month + 1;
            let newYear = prevDate.year;

            if (newMonth > 12) {
                newMonth = 1;
                newYear += 1;
            }

            return {
                year: Math.min(maxBSYear, newYear),
                month: newMonth,
                day: 1
            };
        });
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(event.target.value, 10);
        setCurrentBSDate((prevDate) => ({
            ...prevDate,
            year: newYear
        }));
    };

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = parseInt(event.target.value, 10);
        setCurrentBSDate((prevDate) => ({
            ...prevDate,
            month: newMonth
        }));
    };

    const handleTodayClick = () => {
        setCurrentBSDate(todayBSDate);
    };

    const changeFontToLanguage = (text: string) => {
        if (language === 'ne') {
            return text.replace(/[0-9]/g, (digit) => {
                const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
                return nepaliDigits[parseInt(digit)];
            });
        }
        return text; // Return the text as-is for English
    }
    const renderDays = () => {
        const days = [];
        const firstDay = convertDate({date: `${currentBSDate.year}-${currentBSDate.month}-01`, to: 'ad'});
        const firstDayOfMonth = moment([firstDay.year, firstDay.month - 1, firstDay.day]);
        const adjustedFirstDay = (firstDayOfMonth.day() - startWeekDay + 7) % 7;
        const monthDays = new DateClass().daysInBsMonth(currentBSDate.year, currentBSDate.month);

        for (let i = 0; i < adjustedFirstDay; i++) {
            days.push(<div key={`empty-${i}`} className="empty"></div>);
        }

        for (let day = 1; day <= monthDays; day++) {
            const isSelected = selectedDate && day === selectedDate.day && currentBSDate.month === selectedDate.month && currentBSDate.year === selectedDate.year;
            const isToday = day === todayBSDate.day && currentBSDate.month === todayBSDate.month && currentBSDate.year === todayBSDate.year;
            const dayOfWeek = (adjustedFirstDay + day - 1) % 7;
            const isWeekend = weekendDays.includes(dayOfWeek);

            days.push(
                <div
                    key={day}
                    className={`day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    {changeFontToLanguage(String(day))}
                    {isToday && <span className="today-indicator"></span>}
                </div>
            );
        }
        return days;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getAdjustedDaysOfWeek = () => {
        const daysOfWeek = language === 'ne' ? daysOfWeekNe : daysOfWeekEn;
        const adjustedDays = [...daysOfWeek.slice(startWeekDay), ...daysOfWeek.slice(0, startWeekDay)];
        return adjustedDays.map((day, index) => {
            const dayIndex = (startWeekDay + index) % 7;
            const isWeekend = weekendDays.includes(dayIndex);
            return <div key={day} className={`weekday ${isWeekend ? 'weekend' : ''}`}>{day}</div>;
        });
    };

    const months = language === 'ne' ? nepaliMonths : englishMonths;

    return (
        <div className="date-picker" ref={datePickerRef}>
            <input
                type="text"
                value={selectedDate ? `${months[selectedDate.month - 1]} ${changeFontToLanguage(String(selectedDate.day))}, ${changeFontToLanguage(String(selectedDate.year))}` : ''}
                placeholder={language === 'ne' ? "मिति चयन गर्नुहोस्" : "Select a date"}
                onClick={() => setShowCalendar(!showCalendar)}
                readOnly
            />
            {showCalendar && (
                <div className="calendar">
                    <div className="calendar-header">
                        <button onClick={handlePrevMonth}>&lt;</button>
                        <select value={currentBSDate.month} onChange={handleMonthChange}>
                            {months.map((month, index) => (
                                <option key={index} value={index + 1}>{month}</option>
                            ))}
                        </select>
                        <select value={currentBSDate.year} onChange={handleYearChange}>
                            {yearRange.map((year) => (
                                <option key={year} value={year}>{changeFontToLanguage(String(year))}</option>
                            ))}
                        </select>
                        <button onClick={handleTodayClick}><CiCalendar/></button>
                        <button onClick={handleNextMonth}>&gt;</button>
                    </div>
                    <div className="calendar-body">
                        <div className="calendar-days-header">
                            {getAdjustedDaysOfWeek()}
                        </div>
                        <div className="calendar-days">
                            {renderDays()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;
