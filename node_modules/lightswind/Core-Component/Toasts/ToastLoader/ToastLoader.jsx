import React, { useState } from 'react';

const PrimaryToast = () => {
  const [isVisible, setIsVisible] = useState(true);

  const closeToast = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div
        className="fixed top-4 right-4 bg-primarylw text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-4"
        role="alert"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <div className="flex-1">
          <p className="font-semibold text-sm">Action Successful!</p>
          <p className="text-xs">Your request was completed successfully.</p>
        </div>
        <button
          onClick={closeToast}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    )
  );
};

export default PrimaryToast;
