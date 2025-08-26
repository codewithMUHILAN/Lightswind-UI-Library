import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { enUS } from "date-fns/locale";
import { addDays } from "date-fns";
// Import Select components from Lightswind UI
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "lightswind";
const Calendar = () => {
    const [mode, setMode] = useState("single");
    const today = new Date();
    const nextMonth = addDays(today, 30); // Using addDays for consistency with original code
    const [singleDate, setSingleDate] = useState(today);
    const [multipleDates, setMultipleDates] = useState([today]);
    const [range, setRange] = useState({
        from: today,
        to: addDays(today, 7),
    });
    const handleModeChange = (value) => {
        setMode(value);
    };
    const disabledDays = [
        new Date(2025, 6, 25), // July 25, 2025
        new Date(2025, 6, 26), // July 26, 2025
        {
            from: new Date(2025, 6, 28), // July 28, 2025
            to: new Date(2025, 6, 30), // July 30, 2025
        },
        (date) => date.getDay() === 0 || date.getDay() === 6, // disable weekends (Sunday and Saturday)
    ];
    const commonDayPickerProps = {
        className: "rounded-lg border p-4",
        weekStartsOn: 1, // Monday
        locale: enUS,
        defaultMonth: today,
        fromDate: today,
        toDate: nextMonth,
        disabled: disabledDays,
        showOutsideDays: true,
        initialFocus: true,
    };
    return (_jsxs("div", { className: "min-h-screen bg-background py-8 px-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-6", children: [_jsx("label", { className: "text-gray-700 dark:text-gray-300 font-medium", children: "Selection Mode:" }), _jsxs(Select, { value: mode, onValueChange: handleModeChange, children: [_jsx(SelectTrigger, { className: "w-[180px] dark:bg-gray-700 dark:text-white border rounded-md px-3 py-2", children: _jsx(SelectValue, { placeholder: "Select mode" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "single", children: "Single" }), _jsx(SelectItem, { value: "multiple", children: "Multiple" }), _jsx(SelectItem, { value: "range", children: "Range" })] })] })] }), mode === "single" && (_jsx(DayPicker, { mode: "single", selected: singleDate, onSelect: setSingleDate, ...commonDayPickerProps })), mode === "multiple" && (_jsx(DayPicker, { mode: "multiple", selected: multipleDates, onSelect: setMultipleDates, ...commonDayPickerProps })), mode === "range" && (_jsx(DayPicker, { mode: "range", selected: range, onSelect: setRange, required: false, ...commonDayPickerProps })), _jsxs("div", { className: "mt-6 text-center text-gray-800 dark:text-gray-200", children: [mode === "single" && singleDate && (_jsxs("p", { children: ["Selected:", " ", _jsx("strong", { children: singleDate.toLocaleDateString("en-US") })] })), mode === "multiple" && multipleDates && (_jsxs("p", { children: ["Selected:", " ", multipleDates.map((date) => (_jsx("span", { className: "mx-1", children: date.toLocaleDateString("en-US") }, date.toString())))] })), mode === "range" && range && (_jsxs("p", { children: ["From:", " ", _jsx("strong", { children: range.from?.toLocaleDateString("en-US") || "—" }), " ", "to:", " ", _jsx("strong", { children: range.to?.toLocaleDateString("en-US") || "—" })] }))] })] }));
};
export default Calendar;
