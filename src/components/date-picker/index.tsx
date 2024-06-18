import React from "react";
import { CiCalendar } from "react-icons/ci";
import { NEPALI_MONTHS, ENGLISH_MONTHS } from "../../constants/dates";
import { DatePickerProvider } from "../../contexts/date-picker-context";
import { changeFontToLanguage } from "../../lib/utils";
import { useDatePicker } from "../../hooks/use-date-picker";

const DatePicker: React.FC<{
  startWeekDay?: number;
  weekendDays?: number[];
  language?: "en" | "ne";
}> = (props) => {
  return (
    <DatePickerProvider {...props}>
      <DatePickerInput />
      <DatePickerCalendar />
    </DatePickerProvider>
  );
};

const DatePickerInput: React.FC = () => {
  const { selectedDate, showCalendar, setShowCalendar, language } =
    useDatePicker();
  const months = language === "ne" ? NEPALI_MONTHS : ENGLISH_MONTHS;

  return (
    <input
      type="text"
      value={
        selectedDate
          ? `${months[selectedDate.month - 1]} ${changeFontToLanguage(
              String(selectedDate.day),
              language
            )}, ${changeFontToLanguage(String(selectedDate.year), language)}`
          : ""
      }
      placeholder={language === "ne" ? "मिति चयन गर्नुहोस्" : "Select a date"}
      onClick={() => setShowCalendar(!showCalendar)}
      readOnly
    />
  );
};

const DatePickerCalendar: React.FC = () => {
  const {
    showCalendar,
    handlePrevMonth,
    handleNextMonth,
    handleYearChange,
    handleMonthChange,
    handleTodayClick,
    currentBSDate,
    yearRange,
    getAdjustedDaysOfWeek,
    renderDays,
    language,
  } = useDatePicker();
  const months = language === "ne" ? NEPALI_MONTHS : ENGLISH_MONTHS;

  if (!showCalendar) return null;

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <select value={currentBSDate.month} onChange={handleMonthChange}>
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
        <select value={currentBSDate.year} onChange={handleYearChange}>
          {yearRange.map((year) => (
            <option key={year} value={year}>
              {changeFontToLanguage(String(year), language)}
            </option>
          ))}
        </select>
        <button onClick={handleTodayClick}>
          <CiCalendar />
        </button>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-body">
        <div className="calendar-days-header">{getAdjustedDaysOfWeek()}</div>
        <div className="calendar-days">{renderDays()}</div>
      </div>
    </div>
  );
};

export default DatePicker;
