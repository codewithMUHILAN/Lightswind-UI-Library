import React, { useState, useEffect } from "react";

const DatePicker = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState("");
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false); // Toggle between dark and light themes

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDay = firstDayOfMonth(month, year);
        const totalDays = daysInMonth(month, year);

        const calendarCells = [];

        for (let i = 0; i < firstDay; i++) {
            calendarCells.push(<div key={"empty-" + i} />);
        }

        for (let day = 1; day <= totalDays; day++) {
            calendarCells.push(
                <div
                    key={day}
                    className={
                        "cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all " +
                        (darkMode
                            ? "hover:bg-gray-700 text-gray-300 hover:text-gray-100"
                            : "hover:bg-blue-500 text-gray-700 hover:text-white")
                    }
                    onClick={() => handleDateSelect(day, month, year)}
                >
                    {day}
                </div>
            );
        }

        return calendarCells;
    };


    const handleDateSelect = (day, month, year) => {
        const date = new Date(year, month, day).toLocaleDateString();
        setSelectedDate(date);
        setIsDatePickerOpen(false);
    };

    const handlePrevMonth = () => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    useEffect(() => {
        const closeDatePicker = (e) => {
            if (!e.target.closest(".datepicker-wrapper")) {
                setIsDatePickerOpen(false);
            }
        };
        window.addEventListener("click", closeDatePicker);
        return () => {
            window.removeEventListener("click", closeDatePicker);
        };
    }, []);

    return (
        <div
            className=" min-h-screen flex justify-center items-center font-primarylw">
            <div className="absolute top-4 right-4">

            </div>
            <div className="relative datepicker-wrapper w-full max-w-sm">
                <input
                    type="text"
                    value={selectedDate}
                    onClick={() => setIsDatePickerOpen((prev) => !prev)}
                    readOnly
                    placeholder="Select Date"
                    className={
                        "w-full px-4 py-3 pl-10 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 " +
                        (darkMode
                            ? "bg-gray-800 border-gray-600 text-gray-300 focus:ring-gray-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500")
                    }
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className={
                        "absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 " +
                        (darkMode ? "text-gray-400" : "text-gray-500")
                    }
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                </svg>

                {isDatePickerOpen && (
                    <div
                        className={
                            "absolute datepicker p-4 mt-2 rounded-lg shadow-lg border " +
                            (darkMode
                                ? "bg-gray-800 border-gray-600 text-gray-300"
                                : "bg-white border-gray-300 text-gray-900")
                        }
                    >
                        <div className="flex justify-between items-center mb-3">
                            <button
                                className={
                                    "text-sm transition " +
                                    (darkMode
                                        ? "text-gray-400 hover:text-gray-200"
                                        : "text-gray-600 hover:text-gray-800")
                                }
                                onClick={handlePrevMonth}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                                </svg>
                            </button>
                            <div className="font-semibold text-lg">
                                {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
                            </div>
                            <button
                                className={
                                    "text-sm transition " +
                                    (darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800")
                                }
                                onClick={handleNextMonth}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium">
                            <div>Sun</div>
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 mt-2">{renderCalendar()}</div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default DatePicker;
