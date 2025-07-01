import React from "react";

const ProductDetailPage = () => {
    return (
        <div className="max-w-screen-xl mx-auto px-6 py-12 font-primarylw ">
            {/* Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Product Images */}
                <div className="flex justify-center items-center">
                    <img
                        src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Wireless Headphones"
                        className="w-full h-96 object-cover rounded-lg shadow-lg"
                    />
                </div>

                {/* Product Information */}
                <div className="space-y-6">
                    <h1 className="text-2xl md:text-4xl  md:text-4xl  font-extrabold text-gray-800 dark:text-white">
                        Wireless Headphones
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Premium sound quality with noise-cancelling technology. Enjoy your
                        music and calls with freedom.
                    </p>

                    {/* Rating Section */}
                    <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">★★★★☆</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            (4.5 out of 5 stars)
                        </span>
                    </div>

                    {/* Price */}
                    <p className="text-2xl md:text-4xl  font-bold text-gray-800 dark:text-white">
                        $299.99
                    </p>

                    {/* Add to Cart Button */}
                    <button className="hidden md:flex items-center justify-center gap-3 mt-6 w-full px-8 py-4 bg-primarylw text-white rounded-full hover:bg-primarylw-2 transition-colors duration-300 dark:bg-primarylw dark:hover:bg-primarylw-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                            />
                        </svg>
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Product Description Section */}
            <div className="mt-12">
                <h2 className="text-2xl md:text-4xl  md:text-4xl  font-extrabold text-gray-800 dark:text-white">
                    Product Description
                </h2>
                <p className="mt-4 text-md md:text-xl text-gray-600 dark:text-gray-300">
                    Experience true wireless freedom with our premium wireless headphones.
                    Featuring state-of-the-art noise-cancelling technology, these headphones
                    provide the ultimate listening experience, whether you’re working, traveling,
                    or just relaxing at home. With a comfortable fit and long battery life, these
                    headphones are perfect for all-day use.
                </p>

                <div className="mt-6 space-y-4">
                    <h3 className="text-2xl md:text-4xl  font-semibold text-gray-800 dark:text-white">
                        Key Features:
                    </h3>
                    <ul className="list-disc pl-6 text-md md:text-xl text-gray-600 dark:text-gray-300">
                        <li>Noise-cancelling technology</li>
                        <li>Wireless Bluetooth connectivity</li>
                        <li>Up to 30 hours of battery life</li>
                        <li>Comfortable over-ear design</li>
                        <li>Integrated microphone for hands-free calls</li>
                    </ul>
                </div>

                <div className="mt-6 space-y-4">
                    <h3 className="text-2xl md:text-4xl  font-semibold text-gray-800 dark:text-white">
                        Specifications:
                    </h3>
                    <ul className="list-disc pl-6 text-md md:text-xl text-gray-600 dark:text-gray-300">
                        <li>Bluetooth Version: 5.0</li>
                        <li>Battery Life: 30 hours</li>
                        <li>Weight: 0.5 lbs</li>
                        <li>Color: Black</li>
                        <li>Dimensions: 7.5 x 6.2 x 3.2 inches</li>
                    </ul>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <img
                    src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Product Image 1"
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <img
                    src="https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Product Image 2"
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <img
                    src="https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Product Image 3"
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <img
                    src="https://images.pexels.com/photos/28549934/pexels-photo-28549934/free-photo-of-modern-home-living-room-with-smart-devices.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Product Image 4"
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                />
            </div>

            {/* Sticky Sidebar for Quick Add to Cart */}
            <div className="mt-12 md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-lg px-6 py-4 flex justify-between items-center">
                <div className="text-md md:text-xl font-bold text-gray-800 dark:text-white">$299.99</div>
                <button className="px-6 py-3 bg-primarylw flex items-center justify-center gap-2 text-sm text-white rounded-full hover:bg-primarylw-2 transition-colors duration-300 dark:bg-primarylw dark:hover:bg-primarylw">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                    </svg>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductDetailPage;
