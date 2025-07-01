import React from 'react'

const InfoAlert = () => {
    return (
        <div className="flex items-center bg-blue-50 text-blue-700 border border-blue-200 p-4 rounded-xl shadow-md transition-all duration-300 ease-in-out">
            <div className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
            </div>
            <div className="flex-1">
                <p className="font-medium text-sm">This is a Info Alert from Lightswind Ui</p>
            </div>
            <button className="ml-4" >
                &times;
            </button>
        </div>
    )
}

export default InfoAlert