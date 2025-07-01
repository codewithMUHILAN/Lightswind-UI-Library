import React, { useState } from 'react';

const UserProfileToast = () => {
  // State to manage the visibility of the toast
  const [isVisible, setIsVisible] = useState(true);

  // Function to handle closing the toast
  const closeToast = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <section className="fixed top-0 right-0 z-50 w-full max-w-lg sm:max-w-sm sm:right-4 sm:top-4">
        <div className="w-full bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-all">
          <div className="flex items-center p-4">
            {/* Profile Image */}
            <div className="flex-shrink-0 mr-4">
              <img
                src="https://codewithmuhilan.com/Extra-Assets/lightwind-logo.png"
                alt="user image"
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>
            {/* Toast Content */}
            <div className="flex-1">
              <h6 className="text-lg font-semibold text-gray-800 dark:text-white">Nelly Miller</h6>
              <p className="text-sm text-gray-600 dark:text-gray-400">Purchased polo t-shirt for man</p>
              <span className="text-xs text-gray-500 dark:text-gray-500">2 min ago</span>
            </div>
            {/* Close Button */}
            <button
              onClick={closeToast}
              className="ml-4 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 4.742a1 1 0 0 0-1.414 0L8 6.586 5.672 4.257a1 1 0 1 0-1.414 1.414L6.586 8l-2.328 2.328a1 1 0 1 0 1.414 1.414L8 9.414l2.328 2.328a1 1 0 1 0 1.414-1.414L9.414 8l2.328-2.328a1 1 0 0 0 0-1.414z" />
              </svg>
            </button>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-2 flex justify-end">
            <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              View Product
            </button>
          </div>
        </div>
      </section>
    )
  );
};

export default UserProfileToast;
