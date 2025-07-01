import React, { useState } from "react";

const BasicInputField = () => {

    const [color, setColor] = useState("#000000");

    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    return (
        <div className="font-sans bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto p-8 bg-white  form-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Full Name Input */}
                    <div>
                        <label htmlFor="full-name" className="text-gray-800 text-lg font-semibold mb-2">Full Name</label>
                        <input
                            type="text"
                            id="full-name"
                            placeholder="John Doe"
                            className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primarylw focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email-input" className="text-gray-800 text-lg font-semibold mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email-input"
                            placeholder="you@example.com"
                            className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primarylw focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                        />
                    </div>

                    {/* Password Input with Visibility Toggle */}
                    <div>
                        <label htmlFor="password-input" className="text-gray-800 text-lg font-semibold mb-2">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                id="password-input"
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primarylw focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                            />
                            <button className="absolute right-3 top-3 text-gray-600 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Date of Birth Input */}
                    <div>
                        <label htmlFor="dob-input" className="text-gray-800 text-lg font-semibold mb-2">Date of Birth</label>
                        <input
                            type="date"
                            id="dob-input"
                            className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primarylw focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                        />
                    </div>

                    {/* Phone Number Input */}
                    <div>
                        <label htmlFor="phone-input" className="text-gray-800 text-lg font-semibold mb-2">Phone Number</label>
                        <input
                            type="tel"
                            id="phone-input"
                            placeholder="+1 (555) 555-5555"
                            className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primarylw focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                        />
                    </div>

                    {/* Select Country Input */}
                    <div>
                        <label htmlFor="country-select" className="text-gray-800 text-lg font-semibold mb-2">Select Country</label>
                        <select
                            id="country-select"
                            className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primarylw focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                        >
                            <option value="us">United States</option>
                            <option value="ca">Canada</option>
                            <option value="uk">United Kingdom</option>
                            <option value="au">Australia</option>
                        </select>
                    </div>

                    {/* Range Input */}
                    <div>
                        <label htmlFor="range-input" className="text-gray-800 text-lg font-semibold mb-2">Range</label>
                        <input
                            type="range"
                            id="range-input"
                            min="1"
                            max="100"
                            step="1"
                            className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primarylw focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                        />
                    </div>

                    {/* Switch Input */}
                    <div>
                        <label htmlFor="switch-toggle" className="text-gray-800 text-lg font-semibold mb-2">Enable Notifications</label>
                        <input type="checkbox" id="switch-toggle" className="hidden" />
                        <label htmlFor="switch-toggle" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <div className="block bg-gray-400 w-14 h-8 rounded-full"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-all duration-300 ease-in-out"></div>
                            </div>
                        </label>
                    </div>

                    {/* File Upload Input */}
                    <div>
                        <label htmlFor="file-upload" className="text-gray-800 text-lg font-semibold mb-2">Upload File</label>
                        <div className="relative">
                            <input
                                type="file"
                                id="file-upload"
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primarylw focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                            />
                            <button className="absolute right-3 top-3 text-gray-600 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Textarea Input */}
                    <div>
                        <label htmlFor="message-input" className="text-gray-800 text-lg font-semibold mb-2">Message</label>
                        <textarea
                            id="message-input"
                            rows="4"
                            placeholder="Type your message here"
                            className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primarylw focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 focus:scale-105"
                        />
                    </div>

                    {/* Color Picker Input */}
                    <div>
                        <label htmlFor="color-picker" className="text-gray-800 text-lg font-semibold mb-2">Color Picker</label>
                        <input
                            type="color"
                            id="color-picker"
                            value={color}
                            onChange={handleColorChange}
                            className="w-16 h-16 border-2 border-gray-300 bg-white cursor-pointer rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primarylw"
                        />
                        <p className="text-gray-700 mt-2">Selected Color: {color}</p>
                    </div>

                </div>

                <div className="mt-10 flex justify-center">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-primarylw text-white rounded-lg focus:outline-none hover:bg-primarylw-2 transition duration-300 ease-in-out transform hover:scale-105"
                        disabled
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}


export default BasicInputField;
