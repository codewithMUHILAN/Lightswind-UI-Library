import React, { useState } from 'react';

const PrimaryAlert = () => {
    const [alert, setAlert] = useState({
        type: 'success',
        message: 'This is a success alert!',
        isVisible: true,
    });

    const handleClose = () => setAlert({ ...alert, isVisible: false });

    return (
        <div className="max-w-xl mx-auto mt-12 space-y-4">
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => setAlert({ type: 'success', message: 'Operation successful!', isVisible: true })}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg transition duration-200"
                >
                    Success Alert
                </button>
                <button
                    onClick={() => setAlert({ type: 'error', message: 'Something went wrong!', isVisible: true })}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg transition duration-200"
                >
                    Error Alert
                </button>
                <button
                    onClick={() => setAlert({ type: 'warning', message: 'Please be cautious!', isVisible: true })}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-lg transition duration-200"
                >
                    Warning Alert
                </button>
                <button
                    onClick={() => setAlert({ type: 'info', message: 'For your information!', isVisible: true })}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg transition duration-200"
                >
                    Info Alert
                </button>
            </div>

            {alert.isVisible && alert.type === 'success' && (
                <div className="flex items-center bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out">
                    <div className="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-sm">{alert.message}</p>
                    </div>
                    <button className="ml-4" onClick={handleClose}>
                        &times;
                    </button>
                </div>
            )}

            {alert.isVisible && alert.type === 'error' && (
                <div className="flex items-center bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out">
                    <div className="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-sm">{alert.message}</p>
                    </div>
                    <button className="ml-4" onClick={handleClose}>
                        &times;
                    </button>
                </div>
            )}

            {alert.isVisible && alert.type === 'warning' && (
                <div className="flex items-center bg-yellow-50 text-yellow-700 border border-yellow-200 p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out">
                    <div className="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-sm">{alert.message}</p>
                    </div>
                    <button className="ml-4" onClick={handleClose}>
                        &times;
                    </button>
                </div>
            )}

            {alert.isVisible && alert.type === 'info' && (
                <div className="flex items-center bg-blue-50 text-blue-700 border border-blue-200 p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out">
                    <div className="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-sm">{alert.message}</p>
                    </div>
                    <button className="ml-4" onClick={handleClose}>
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};

export default PrimaryAlert;
