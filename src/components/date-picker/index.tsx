import React from "react";
import { NEPALI_MONTHS, ENGLISH_MONTHS } from "../../constants/dates";
import { DatePickerProvider } from "../../contexts/date-picker-context";
import { changeFontToLanguage } from "../../lib/utils";
import { useDatePicker } from "../../hooks/use-date-picker";
import PrevIcon from "../../icons/PrevIcon";
import NextIcon from "../../icons/NextIcon";
import CalenderIcon from "../../icons/CalenderIcon";

const DatePicker: React.FC<{
  startWeekDay?: number;
  weekendDays?: number[];
  language: "en" | "ne";
  inputClassName?: string;
  placeholder?: string;
  label?: string;
  theme?: string;
}> = (props) => {
  return (
    <DatePickerProvider {...props}>
      {props.label && <label>{props.label}</label>}
      <DatePickerInput
        inputClassName={props.inputClassName}
        placeholder={props.placeholder}
      />
      <DatePickerCalendar theme={props.theme} />
    </DatePickerProvider>
  );
};

const DatePickerInput: React.FC<{
  inputClassName?: string;
  placeholder?: string;
}> = ({ inputClassName, placeholder }) => {
  const { selectedDate, showCalendar, setShowCalendar, language } =
    useDatePicker();
  const months = language === "ne" ? NEPALI_MONTHS : ENGLISH_MONTHS;

  return (
    <input
      type="text"
      className={inputClassName}
      value={
        selectedDate
          ? `${months[selectedDate.month - 1]} ${changeFontToLanguage(
              String(selectedDate.day),
              language
            )}, ${changeFontToLanguage(String(selectedDate.year), language)}`
          : ""
      }
      placeholder={
        placeholder ||
        (language === "ne" ? "मिति चयन गर्नुहोस्" : "Select a date")
      }
      onClick={() => setShowCalendar(!showCalendar)}
      readOnly
    />
  );
};

const DatePickerCalendar: React.FC<{ theme?: string }> = ({ theme }) => {
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
    <div className={`calendar ${theme}`}>
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>
          <PrevIcon />
        </button>
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
          <CalenderIcon />
        </button>
        <button onClick={handleNextMonth}>
          <NextIcon />
        </button>
      </div>
      <div className="calendar-body">
        <div className="calendar-days-header">{getAdjustedDaysOfWeek()}</div>
        <div className="calendar-days">{renderDays()}</div>
      </div>
    </div>
  );
};

export default DatePicker;
