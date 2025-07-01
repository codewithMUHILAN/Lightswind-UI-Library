import React, { useState } from "react";

const AppointmentForm = () => {
    const [formMessage, setFormMessage] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormMessage(true);
        setTimeout(() => {
            setFormMessage(false);
            e.target.reset();
        }, 3000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-2 md:px-12 py-12 text-gray-800 dark:text-gray-200 font-primarylw">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white text-center py-4">
                Book Appointment
            </h1>

            <div className="mx-auto w-full max-w-[550px] bg-white dark:bg-gray-900 shadow-lg rounded-lg px-4 md:px-8 py-4 md:py-8">
                <form id="appointmentForm" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label
                            htmlFor="name"
                            className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Full Name"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-6 text-base font-medium text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="phone"
                            className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200"
                        >
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            placeholder="Enter your phone number"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-6 text-base font-medium text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            pattern="[0-9]{10}"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-6 text-base font-medium text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="-mx-3 flex flex-wrap">
                        <div className="w-full px-3 sm:w-1/2 mb-5">
                            <label
                                htmlFor="date"
                                className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200"
                            >
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                id="date"
                                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-6 text-base font-medium text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="w-full px-3 sm:w-1/2 mb-5">
                            <label
                                htmlFor="time"
                                className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200"
                            >
                                Time
                            </label>
                            <input
                                type="time"
                                name="time"
                                id="time"
                                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-6 text-base font-medium text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="mb-5 block text-base font-semibold text-gray-800 dark:text-gray-200 sm:text-xl">
                            Address Details
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="area"
                                id="area"
                                placeholder="Enter area"
                                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-6 text-base font-medium text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="text"
                                name="city"
                                id="city"
                                placeholder="Enter city"
                                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-6 text-base font-medium text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="text"
                                name="state"
                                id="state"
                                placeholder="Enter state"
                                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-6 text-base font-medium text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="text"
                                name="post-code"
                                id="post-code"
                                placeholder="Post Code"
                                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-6 text-base font-medium text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 w-full rounded-md bg-blue-600 hover:bg-blue-700 py-3 px-8 text-center text-base font-semibold text-white outline-none transition-all duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            Book Appointment
                        </button>
                    </div>

                    {formMessage && (
                        <div className="mt-4 text-center text-sm font-medium text-green-500">
                            Your appointment has been booked successfully!
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AppointmentForm;
