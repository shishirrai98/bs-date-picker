import React, { lazy } from "react";
import { DatePickerProvider } from "../../contexts/date-picker-context";

const DatePickerCalendar = lazy(() => import("./calander"));
const DatePickerInput = lazy(() => import("./input"));

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
      <React.Suspense fallback={<div>Loading...</div>}>
        <DatePickerInput
          inputClassName={props.inputClassName}
          placeholder={props.placeholder}
        />
      </React.Suspense>
      <React.Suspense fallback={<div>Loading...</div>}>
        <DatePickerCalendar theme={props.theme} />
      </React.Suspense>
    </DatePickerProvider>
  );
};

export default DatePicker;
