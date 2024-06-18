import { NEPALI_MONTHS, ENGLISH_MONTHS } from "../../constants/dates";
import { useDatePicker } from "../../hooks/use-date-picker";
import { changeFontToLanguage } from "../../lib/utils";

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

export default DatePickerInput;
