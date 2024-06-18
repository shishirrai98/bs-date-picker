import { ADToBS, BSToAD } from "../lib/utils";

const useDate = () => {
  const convertDate = ({
    date,
    to = "bs",
  }: {
    date: string;
    to?: "ad" | "bs";
  }) => {
    let convertedDate: string;
    if (to === "bs") {
      convertedDate = ADToBS(date);
    } else {
      convertedDate = BSToAD(date);
    }
    const [year, month, day] = convertedDate.split("-").map(Number);
    return {
      year: year,
      month: month,
      day: day,
    };
  };

  return {
    convertDate,
  };
};

export default useDate;
