import React from 'react'

const WarningAlert = () => {
    return (
        <div>
            <div className="flex items-center bg-yellow-50 text-yellow-700 border border-yellow-200 p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out">
                <div className="mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm">This is a Warning Alert from Lightswind Ui</p>
                </div>
                <button className="ml-4" >
                    &times;
                </button>
            </div>
        </div>
    )
}

export default WarningAlert