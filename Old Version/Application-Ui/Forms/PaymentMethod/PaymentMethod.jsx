import React, { useState } from 'react';

const PaymentMethod = () => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [monthOptions] = useState([
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]);

    // Generate years dynamically
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear + i);


    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
    };



    return (
        <div className="p-4 font-primarylw">
            <div className="rounded-xl border shadow">
                <div className="flex flex-col space-y-1.5 p-6">
                    <div className="font-semibold tracking-tight">
                        Payment Method
                    </div>
                    <div className="text-sm">
                        Add a new payment method to your account.
                    </div>
                </div>
                <div className="p-6 pt-0 grid gap-6">

                    {/* Payment Methods */}
                    <div className="grid grid-cols-3 gap-4">
                        {['card', 'googlepay', 'apple'].map((method) => (
                            <div key={method} className="relative">
                                <label
                                    className={`text-sm font-medium leading-none flex flex-col items-center justify-between rounded-md border-2 p-4 ${selectedMethod === method
                                        ? 'border-primarylw'
                                        : 'border-gray-300'
                                        } bg-transparent hover:bg-gray-100 cursor-pointer`}
                                    onClick={() => handleMethodSelect(method)}
                                >
                                    {/* Method Icon */}
                                    {method === 'card' && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className={`size-6 mb-2 ${selectedMethod === method ? 'text-primarylw' : 'text-gray-800'}`}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                                            />
                                        </svg>
                                    )}
                                    {method === 'googlepay' && (
                                        <svg
                                            className={`w-6 h-6 mb-2 ${selectedMethod === method ? 'text-primarylw' : 'text-gray-800'}`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                    {method === 'apple' && (
                                        <svg
                                            className={`w-6 h-6 mb-2 ${selectedMethod === method ? 'text-primarylw' : 'text-gray-800'}`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M17.537 12.625a4.421 4.421 0 0 0 2.684 4.047 10.96 10.96 0 0 1-1.384 2.845c-.834 1.218-1.7 2.432-3.062 2.457-1.34.025-1.77-.794-3.3-.794-1.531 0-2.01.769-3.275.82-1.316.049-2.317-1.318-3.158-2.532-1.72-2.484-3.032-7.017-1.27-10.077A4.9 4.9 0 0 1 8.91 6.884c1.292-.025 2.51.869 3.3.869.789 0 2.27-1.075 3.828-.917a4.67 4.67 0 0 1 3.66 1.984 4.524 4.524 0 0 0-2.16 3.805m-2.52-7.432A4.4 4.4 0 0 0 16.06 2a4.482 4.482 0 0 0-2.945 1.516 4.185 4.185 0 0 0-1.061 3.093 3.708 3.708 0 0 0 2.967-1.416Z" />
                                        </svg>
                                    )}
                                    {/* Method Name */}
                                    {method.charAt(0).toUpperCase() + method.slice(1)}
                                </label>
                                {/* Tick Icon for Selected Method */}
                                {selectedMethod === method && (
                                    <div className="absolute top-2 right-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-primarylw">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>


                    <div className="grid gap-2">
                        <label className="text-sm font-medium" htmlFor="name">
                            Name
                        </label>
                        <input className="h-9 w-full rounded-md border border-black bg-transparent px-3 py-1 text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-primarylw" id="name" placeholder="First Last" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium" htmlFor="city">
                            City
                        </label>
                        <input className="h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-primarylw" id="city" placeholder="" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium" htmlFor="number">
                            Card number
                        </label>
                        <input className="h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-primarylw" id="number" placeholder="" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Input Fields */}
                        <div className="grid gap-2">
                            <label className="text-sm font-medium" htmlFor="month">Month</label>
                            <select
                                id="month"
                                className="h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm focus:ring-primarylw"
                            >
                                {monthOptions.map((month, index) => (
                                    <option key={index} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium" htmlFor="year">
                                Year
                            </label>
                            <select
                                id="year"
                                className="h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-primarylw"
                            >
                                {yearOptions.map((year, index) => (
                                    <option key={index} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium" htmlFor="cvc">
                                CVC
                            </label>
                            <input className="h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-primarylw" id="cvc" placeholder="CVC" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center p-6 pt-0">
                    <button className="h-9 w-full rounded-md bg-primarylw text-white shadow hover:bg-primarylw">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;
