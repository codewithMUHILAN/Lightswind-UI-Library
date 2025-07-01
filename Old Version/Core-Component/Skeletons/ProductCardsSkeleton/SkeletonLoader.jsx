import React from 'react';

const ProductCardSkeleton = () => {


    return (
        <div className="bg-white dark:bg-black flex items-center justify-center min-h-screen">
            <style>{skeletonLoaderAnimation}</style> {/* Embedding the keyframe animation */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Product Card 1 */}
                <div className="w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
                    <div className="w-full h-40 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded-md"></div>
                    <div className="mt-4 space-y-2">
                        <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded w-3/4"></div>
                    </div>
                    <div className="mt-4 h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded w-1/2"></div>
                    <div className="mt-6">
                        <div className="h-10 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded-lg"></div>
                    </div>
                </div>

                {/* Product Card 2 */}
                <div className="w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
                    <div className="w-full h-40 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded-md"></div>
                    <div className="mt-4 space-y-2">
                        <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded w-3/4"></div>
                    </div>
                    <div className="mt-4 h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded w-1/2"></div>
                    <div className="mt-6">
                        <div className="h-10 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded-lg"></div>
                    </div>
                </div>

                {/* Product Card 3 */}
                <div className="w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
                    <div className="w-full h-40 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded-md"></div>
                    <div className="mt-4 space-y-2">
                        <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded w-3/4"></div>
                    </div>
                    <div className="mt-4 h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded w-1/2"></div>
                    <div className="mt-6">
                        <div className="h-10 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-skeletonLoader rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCardSkeleton;
