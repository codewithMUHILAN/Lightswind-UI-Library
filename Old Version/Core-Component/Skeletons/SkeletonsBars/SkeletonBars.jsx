import React from 'react';

const SkeletonBars = () => {
    return (
        <div className="bg-white dark:bg-black flex items-center justify-center min-h-screen">
            <div className="w-64 space-y-4">
                {/* Skeleton Bar 1 */}
                <div className="h-4 rounded w-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 skeletonBarsLoaders"></div>

                {/* Skeleton Bar 2 */}
                <div className="h-4 rounded w-3/4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 skeletonBarsLoaders"></div>

                {/* Skeleton Bar 3 */}
                <div className="h-4 rounded w-1/2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 skeletonBarsLoaders"></div>

                {/* Skeleton Bar 4 */}
                <div className="h-4 rounded w-5/6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 skeletonBarsLoaders"></div>
            </div>


        </div>
    );
};

export default SkeletonBars;
