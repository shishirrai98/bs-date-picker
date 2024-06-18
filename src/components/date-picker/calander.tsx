import { NEPALI_MONTHS, ENGLISH_MONTHS } from "../../constants/dates";
import { useDatePicker } from "../../hooks/use-date-picker";
import CalenderIcon from "../../icons/CalenderIcon";
import NextIcon from "../../icons/NextIcon";
import PrevIcon from "../../icons/PrevIcon";
import { changeFontToLanguage } from "../../lib/utils";

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
        <div>
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
        </div>

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

export default DatePickerCalendar;
