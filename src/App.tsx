import { useState } from "react";
import DatePicker from "./components/date-picker";

function App() {
  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);

  const handleDateChange = (date: { year: number; month: number; day: number } | null) => {
    setSelectedDate(date);
  };

  return (
    <div className="date-picker">
      <DatePicker
        language="en"
        inputClassName={""}
        label="Select Birth Date"
        theme="blue-theme"
        onChange={handleDateChange}
      />
      {selectedDate && (
        <div>
          Selected Date: {selectedDate.month}/{selectedDate.day}/{selectedDate.year}
        </div>
      )}
    </div>
  );
}

export default App;
