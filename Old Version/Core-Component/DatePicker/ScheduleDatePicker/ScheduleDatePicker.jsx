import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const ScheduleDatePicker = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isReminderOpen, setIsReminderOpen] = useState(false);
    const [time, setTime] = useState("12:00 PM");
    const [title, setTitle] = useState("");
    const [scheduledDates, setScheduledDates] = useState([]); // Store scheduled dates with time and title
    const [showDetails, setShowDetails] = useState(null); // Show details for clicked scheduled date

    // Helper functions for calendar rendering
    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDay = firstDayOfMonth(month, year);
        const totalDays = daysInMonth(month, year);

        const calendarCells = [];
        for (let i = 0; i < firstDay; i++) {
            calendarCells.push(<div key={`empty-${i}`} />);
        }

        for (let day = 1; day <= totalDays; day++) {
            const dateStr = new Date(year, month, day).toLocaleDateString();
            const isScheduled = scheduledDates.some(
                (event) => event.date === dateStr
            );

            calendarCells.push(
                <div
                    key={day}
                    className={`cursor-pointer flex items-center justify-center w-12 h-12 rounded-lg transition-all relative ${isScheduled
                        ? "bg-green-500 text-white"
                        : "hover:bg-blue-500 text-gray-700 hover:text-white"
                        }`}
                    onClick={() => handleDateSelect(day, month, year)}
                >
                    {isScheduled && (
                        <div className="absolute top-0 right-0 text-xl text-white">
                            <FaCheckCircle />
                        </div>
                    )}
                    {day}
                </div>
            );
        }

        return calendarCells;
    };

    // Handle date selection and open reminder popover
    const handleDateSelect = (day, month, year) => {
        const date = new Date(year, month, day).toLocaleDateString();
        setSelectedDate(date);

        const existingEvent = scheduledDates.find(
            (event) => event.date === date
        );
        if (existingEvent) {
            setShowDetails(existingEvent); // Show existing event details
        } else {
            setIsReminderOpen(true); // Open reminder popover if no event
        }
    };

    // Handle submitting the scheduled event
    const handleSubmit = () => {
        if (!selectedDate || !time || !title) {
            alert("Please fill all fields.");
            return;
        }

        const newEvent = {
            date: selectedDate,
            time,
            title,
        };

        setScheduledDates((prev) => [...prev, newEvent]);
        setIsReminderOpen(false); // Close the popover after submission
        setTime("12:00 PM"); // Reset time input
        setTitle(""); // Reset title input
    };

    // Handle closing the reminder popover
    const handleClosePopover = () => {
        setIsReminderOpen(false);
    };

    // Handle closing the scheduled event details
    const handleCloseDetails = () => {
        setShowDetails(null);
    };

    // Render previous and next month buttons
    const handlePrevMonth = () => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    return (
        <div className="min-h-screen flex justify-center items-center font-primarylw bg-gray-100 text-gray-900">
            <div className="relative w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center mb-4">Set Appointment</h2>

                {/* Date Picker Input */}
                <input
                    type="text"
                    value={selectedDate || ""}
                    onClick={() => setIsReminderOpen(true)}
                    readOnly
                    placeholder="Select Date"
                    className="w-full px-4 py-3 pl-10 pr-12 border rounded-lg shadow-sm focus:outline-none"
                />

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5"
                    />
                </svg>

                {/* Calendar with selected dates highlighted */}
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-3">
                        <button
                            className="text-sm text-gray-600"
                            onClick={handlePrevMonth}
                        >
                            Prev
                        </button>
                        <div className="font-semibold text-lg">
                            {currentDate.toLocaleString("default", { month: "long" })}{" "}
                            {currentDate.getFullYear()}
                        </div>
                        <button
                            className="text-sm text-gray-600"
                            onClick={handleNextMonth}
                        >
                            Next
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

                {/* Popover for setting reminder */}
                {isReminderOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="relative w-96 p-6 bg-white rounded-lg shadow-lg">
                            <button
                                onClick={handleClosePopover}
                                className="absolute top-2 right-2 text-gray-500"
                            >
                                <FaTimes />
                            </button>
                            <h3 className="text-xl font-semibold mb-4">Set Reminder</h3>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg shadow-sm mb-4"
                            />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter event title"
                                className="w-full px-4 py-2 border rounded-lg shadow-sm mb-4"
                            />
                            <button
                                onClick={handleSubmit}
                                className="w-full py-3 rounded-lg bg-blue-500 text-white"
                            >
                                Set Reminder
                            </button>
                        </div>
                    </div>
                )}

                {/* Display details for selected scheduled date */}
                {showDetails && (
                    <div className=" relative mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
                        <button
                            onClick={handleCloseDetails}
                            className="absolute top-2 right-2 text-gray-500"
                        >
                            <FaTimes />
                        </button>
                        <h3 className="text-lg font-semibold">Scheduled Event</h3>
                        <p className="text-sm text-gray-700">Date: {showDetails.date}</p>
                        <p className="text-sm text-gray-700">Time: {showDetails.time}</p>
                        <p className="text-sm text-gray-700">Title: {showDetails.title}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduleDatePicker;
