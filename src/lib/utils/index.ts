import { NEPALI_DIGITS } from "../../constants/dates";
import DateClass from "./date-class";

export const BSToAD = (date: string): string => {
  return new DateClass().setDate(date, "BS").toAD();
};

export const ADToBS = (date: Date | string): string => {
  return new DateClass().setDate(date, "AD").toBS();
};

export const changeFontToLanguage = (text: string, language: string) => {
  if (language === "ne") {
    return text.replace(/[0-9]/g, (digit) => {
      return NEPALI_DIGITS[parseInt(digit)];
    });
  }
  return text;
};
