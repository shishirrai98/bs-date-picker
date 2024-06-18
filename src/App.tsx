import DatePicker from "./components/date-picker";

function App() {
  return (
    <div className="date-picker">
      <DatePicker
        language="en"
        inputClassName={""}
        label="Select Birth Date"
        theme="red-theme"
      />
    </div>
  );
}

export default App;
