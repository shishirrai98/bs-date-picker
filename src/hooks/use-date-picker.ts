import { useContext } from "react";
import { DatePickerContext } from "../contexts/date-picker-context";

export const useDatePicker = () => {
    const context = useContext(DatePickerContext);
    if (!context) {
      throw new Error('useDatePicker must be used within a DatePickerProvider');
    }
    return context;
  };
  