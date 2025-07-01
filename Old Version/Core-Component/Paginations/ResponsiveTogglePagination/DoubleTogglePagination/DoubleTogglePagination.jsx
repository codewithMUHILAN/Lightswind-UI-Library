import React, { useState, useEffect } from 'react';

const DoubleTogglePagination = ({ totalPages = 20 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [startIndex, setStartIndex] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth <= 768 ? 3 : 5);

    useEffect(() => {
        const handleResize = () => {
            const isMobileView = window.innerWidth <= 768;
            setItemsPerPage(isMobileView ? 3 : 5);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderPagination = () => {
        const pages = [];
        for (let i = startIndex; i < startIndex + itemsPerPage && i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={
                        "px-4 py-2 text-sm font-medium border rounded-lg transition transform duration-200 " +
                        (i === currentPage
                            ? "bg-primarylw text-white border-primarylw scale-110 shadow-lg"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-primarylw-2 hover:text-white"
                        )
                    }
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const updatePagination = () => {
        if (currentPage < startIndex) {
            setStartIndex(currentPage);
        } else if (currentPage >= startIndex + itemsPerPage) {
            setStartIndex(currentPage - itemsPerPage + 1);
        }
    };

    useEffect(() => {
        updatePagination();
    }, [currentPage, itemsPerPage]);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleDoublePrevious = () => {
        setStartIndex(Math.max(1, startIndex - itemsPerPage));
        setCurrentPage(Math.max(1, startIndex - itemsPerPage));
    };

    const handleDoubleNext = () => {
        const nextStartIndex = Math.min(totalPages - itemsPerPage + 1, startIndex + itemsPerPage);
        setStartIndex(nextStartIndex);
        setCurrentPage(nextStartIndex);
    };

    return (
        <div className="flex justify-center items-center mt-20">
            <nav aria-label="Page navigation" className="inline-flex items-center space-x-2">

                {/* Double Left Button (<<) */}
                <button
                    onClick={handleDoublePrevious}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-primarylw-2 hover:text-white focus:outline-none focus:ring-2 focus:ring-primarylw-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={startIndex === 1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                    </svg>
                </button>

                {/* Previous Button (<) */}
                <button
                    onClick={handlePrevious}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-primarylw-2 hover:text-white focus:outline-none focus:ring-2 focus:ring-primarylw-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 1}
                >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>

                {/* Pagination Buttons */}
                <ul className="inline-flex items-center space-x-2">
                    {renderPagination()}
                </ul>

                {/* Next Button (>) */}
                <button
                    onClick={handleNext}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-primarylw-2 hover:text-white focus:outline-none focus:ring-2 focus:ring-primarylw-2 focus:ring-opacity-50"
                    disabled={currentPage === totalPages}
                >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>

                {/* Double Right Button (>>) */}
                <button
                    onClick={handleDoubleNext}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-primarylw-2 hover:text-white focus:outline-none focus:ring-2 focus:ring-primarylw-2 focus:ring-opacity-50"
                    disabled={startIndex + itemsPerPage > totalPages}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

            </nav>
        </div>
    );
};

export default DoubleTogglePagination;
