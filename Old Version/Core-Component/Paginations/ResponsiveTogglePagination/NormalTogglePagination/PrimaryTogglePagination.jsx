import React, { useState, useEffect } from 'react';

const PrimaryTogglePagination = () => {
  const totalPages = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth <= 768 ? 3 : 5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(5);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderPagination = () => {
    const pageButtons = [];
    for (let i = startIndex; i < startIndex + itemsPerPage && i <= totalPages; i++) {
      const isActive = i === currentPage;
      const buttonClass = isActive
        ? 'px-4 py-2 text-sm font-medium border rounded-lg transition duration-200 transform bg-primarylw text-white border-primarylw scale-110 shadow-lg'
        : 'px-4 py-2 text-sm font-medium border rounded-lg transition duration-200 transform bg-white text-gray-700 border-gray-300 hover:bg-primarylw-2 hover:text-white';

      pageButtons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={buttonClass}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  };

  const updatePagination = () => {
    if (currentPage < startIndex) {
      setStartIndex(currentPage);
    } else if (currentPage >= startIndex + itemsPerPage) {
      setStartIndex(currentPage - itemsPerPage + 1);
    }
  };

  const prevButtonDisabled = currentPage === 1;
  const nextButtonDisabled = currentPage === totalPages;

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      updatePagination();
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      updatePagination();
    }
  };

  useEffect(() => {
    updatePagination();
  }, [currentPage, itemsPerPage]);

  return (
    <div className="flex justify-center items-center mt-20">
      <nav aria-label="Page navigation" className="inline-flex items-center space-x-2">
        <button
          onClick={handlePrevClick}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-primarylw-2 hover:text-white focus:outline-none focus:ring-2 focus:ring-primarylw-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={prevButtonDisabled}
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <ul id="paginationContainer" className="inline-flex items-center space-x-2">
          {renderPagination()}
        </ul>

        <button
          onClick={handleNextClick}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-primarylw-2 hover:text-white focus:outline-none focus:ring-2 focus:ring-primarylw-2 focus:ring-opacity-50"
          disabled={nextButtonDisabled}
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default PrimaryTogglePagination;
