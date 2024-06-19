import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import moment from "moment";
import { DAYS_OF_WEEK_NE, DAYS_OF_WEEK_EN } from "../constants/dates";
import useDate from "../hooks/use-date";
import { changeFontToLanguage } from "../lib/utils";
import DateClass from "../lib/utils/date-class";

interface DatePickerContextProps {
  selectedDate: { year: number; month: number; day: number } | null;
  setSelectedDate: React.Dispatch<
    React.SetStateAction<{ year: number; month: number; day: number } | null>
  >;
  currentBSDate: { year: number; month: number; day: number };
  setCurrentBSDate: React.Dispatch<
    React.SetStateAction<{ year: number; month: number; day: number }>
  >;
  todayBSDate: { year: number; month: number; day: number };
  showCalendar: boolean;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleYearChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleMonthChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleTodayClick: () => void;
  handleDateClick: (day: number) => void;
  renderDays: () => JSX.Element[];
  getAdjustedDaysOfWeek: () => JSX.Element[];
  language: "en" | "ne";
  yearRange: number[];
  datePickerRef: React.RefObject<HTMLDivElement>;
}

export const DatePickerContext = createContext<
  DatePickerContextProps | undefined
>(undefined);

export const DatePickerProvider: React.FC<{
  children: ReactNode;
  startWeekDay?: number;
  weekendDays?: number[];
  language?: "en" | "ne";
}> = ({ children, startWeekDay = 0, weekendDays = [6], language = "en" }) => {
  const { convertDate } = useDate();
  const todayBSDate = convertDate({
    date: new Date().toISOString().split("T")[0],
    to: "bs",
  });
  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);
  const [currentBSDate, setCurrentBSDate] = useState(todayBSDate);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const minBSYear = 1970;
  const maxBSYear = 2100;

  const yearRange = useMemo(() => {
    return Array.from(
      { length: maxBSYear - minBSYear + 1 },
      (_, i) => minBSYear + i
    );
  }, [minBSYear, maxBSYear]);

  const handleDateClick = useCallback(
    (day: number) => {
      setSelectedDate({
        year: currentBSDate.year,
        month: currentBSDate.month,
        day,
      });
      setShowCalendar(false);
    },
    [currentBSDate]
  );

  const handlePrevMonth = useCallback(() => {
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
        day: 1,
      };
    });
  }, []);

  const handleNextMonth = useCallback(() => {
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
        day: 1,
      };
    });
  }, []);

  const handleYearChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newYear = parseInt(event.target.value, 10);
      setCurrentBSDate((prevDate) => ({
        ...prevDate,
        year: newYear,
      }));
    },
    []
  );

  const handleMonthChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newMonth = parseInt(event.target.value, 10);
      setCurrentBSDate((prevDate) => ({
        ...prevDate,
        month: newMonth,
      }));
    },
    []
  );

  const handleTodayClick = useCallback(() => {
    setCurrentBSDate(todayBSDate);
  }, [todayBSDate]);

  const renderDays = useCallback(() => {
    const days = [];
    const firstDay = convertDate({
      date: `${currentBSDate.year}-${currentBSDate.month}-01`,
      to: "ad",
    });
    const firstDayOfMonth = moment([
      firstDay.year,
      firstDay.month - 1,
      firstDay.day,
    ]);
    const adjustedFirstDay = (firstDayOfMonth.day() - startWeekDay + 7) % 7;
    const monthDays = new DateClass().daysInBsMonth(
      currentBSDate.year,
      currentBSDate.month
    );

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    for (let day = 1; day <= monthDays; day++) {
      const isSelected =
        selectedDate &&
        day === selectedDate.day &&
        currentBSDate.month === selectedDate.month &&
        currentBSDate.year === selectedDate.year;
      const isToday =
        day === todayBSDate.day &&
        currentBSDate.month === todayBSDate.month &&
        currentBSDate.year === todayBSDate.year;
      const dayOfWeek = (adjustedFirstDay + day - 1) % 7;
      const isWeekend = weekendDays.includes(dayOfWeek);

      days.push(
        <div
          key={day}
          className={`day ${isSelected ? "selected" : ""} ${
            isToday ? "today" : ""
          } ${isWeekend ? "weekend" : ""}`}
          onClick={() => handleDateClick(day)}
        >
          {changeFontToLanguage(String(day), language)}
          {isToday && <span className="today-indicator"></span>}
        </div>
      );
    }
    return days;
  }, [
    convertDate,
    currentBSDate.year,
    currentBSDate.month,
    startWeekDay,
    selectedDate,
    todayBSDate.day,
    todayBSDate.month,
    todayBSDate.year,
    weekendDays,
    language,
    handleDateClick,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [datePickerRef]);

  const getAdjustedDaysOfWeek = useCallback(() => {
    const daysOfWeek = language === "ne" ? DAYS_OF_WEEK_NE : DAYS_OF_WEEK_EN;
    const adjustedDays = [
      ...daysOfWeek.slice(startWeekDay),
      ...daysOfWeek.slice(0, startWeekDay),
    ];
    return adjustedDays.map((day, index) => {
      const dayIndex = (startWeekDay + index) % 7;
      const isWeekend = weekendDays.includes(dayIndex);
      return (
        <div key={day} className={`weekday ${isWeekend ? "weekend" : ""}`}>
          {day}
        </div>
      );
    });
  }, [language, startWeekDay, weekendDays]);

  const contextValue = useMemo(() => ({
    selectedDate,
    setSelectedDate,
    currentBSDate,
    setCurrentBSDate,
    todayBSDate,
    showCalendar,
    setShowCalendar,
    handlePrevMonth,
    handleNextMonth,
    handleYearChange,
    handleMonthChange,
    handleTodayClick,
    handleDateClick,
    renderDays,
    getAdjustedDaysOfWeek,
    language,
    yearRange,
    datePickerRef,
  }), [
    selectedDate,
    currentBSDate,
    todayBSDate,
    showCalendar,
    handlePrevMonth,
    handleNextMonth,
    handleYearChange,
    handleMonthChange,
    handleTodayClick,
    handleDateClick,
    renderDays,
    getAdjustedDaysOfWeek,
    language,
    yearRange,
  ]);

  return (
    <DatePickerContext.Provider value={contextValue}>
      <div ref={datePickerRef}>{children}</div>
    </DatePickerContext.Provider>
  );
};
