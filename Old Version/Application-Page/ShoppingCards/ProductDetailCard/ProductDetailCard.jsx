import React, { useState } from "react";

const ProductDetailCard = () => {
    const [quantity, setQuantity] = useState(1);

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    return (
        <>


            {/* unhide this before using this component */}
            {/*           <style>
                {`
                #quantityInput::-webkit-outer-spin-button,
            #quantityInput::-webkit-inner-spin-button {
                -webkit - appearance: none;
            margin: 0;
              }

            #quantityInput[type="number"] {
                -moz - appearance: textfield;
            }
            `}
        </style >*/
            }


            <div className="flex-col md:flex-row justify-between flex gap-8 items-start py-12 font-primarylw">
                <div className="flex bg-white rounded-lg shadow-lg dark:bg-black flex-col md:flex-row border border-gray-400 dark:border-gray-500 mx-auto max-w-3xl">
                    {/* Product Image Section */}
                    <div className="relative w-full md:w-1/2 flex justify-center items-center">
                        <img
                            src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600"
                            alt="shopping image"
                            className="object-cover w-full h-48 md:h-full rounded-t-lg md:rounded-l-lg md:rounded-t-none transition-transform transform hover:scale-105 duration-300 ease-in-out"
                        />
                    </div>
                    {/* Product Details Section */}
                    <form className="flex-auto p-8 md:p-8 space-y-6">
                        <div className="flex flex-col flex-wrap items-start justify-between mb-4 gap-1">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                                Sneakers Shoes
                            </h1>
                            <div className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-300">
                                Price - $175.00
                            </div>
                        </div>
                        <div className="mb-4 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-300">
                            <p>In stock</p>
                        </div>
                        {/* Size Selector */}
                        <div className="flex items-baseline text-xs md:text-sm space-x-4 mt-4 mb-6 text-gray-700 dark:text-gray-300">
                            <div className="flex space-x-2">
                                {["xs", "s", "m", "l", "xl"].map((size) => (
                                    <label
                                        key={size}
                                        className="flex gap-1 items-center justify-center cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            className="w-4 h-4 md:w-6 md:h-6 accent-blue-600 bg-gray-100 rounded-full dark:bg-gray-600"
                                            name="size"
                                            value={size}
                                        />
                                        {size.toUpperCase()}
                                    </label>
                                ))}
                            </div>
                        </div>
                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-4 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                            <span className="text-xs md:text-sm">Quantity:</span>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className="px-3 py-1 bg-gray-200 rounded-lg dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                    onClick={decreaseQuantity}
                                >
                                    -
                                </button>
                                <input
                                    id="quantityInput"
                                    type="number"
                                    value={quantity}
                                    readOnly
                                    style={{
                                        WebkitAppearance: "none",
                                        margin: "0"
                                    }}
                                    className="flex items-center justify-center w-10 py-2 px-3 mx-2 text-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg"
                                />
                                <button
                                    type="button"
                                    className="px-3 py-1 bg-gray-200 rounded-lg dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                    onClick={increaseQuantity}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        {/* Add to Cart & Buy Now Buttons */}
                        <div className="flex flex-col items-center justify-between items-center space-y-4 max-w-60 text-xs md:text-sm">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 py-2 px-6 bg-primarylw-2 dark:bg-primarylw hover:bg-primarylw-3 dark:hover:bg-primarylw-4 focus:ring-primarylw-2 dark:focus:ring-primarylw-4 focus:ring-offset-blue-500 text-white w-full transition ease-in-out duration-300 rounded-lg shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                id="addToCartBtn"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                                    />
                                </svg>
                                Add to Cart
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 py-2 px-6 bg-primarylw-2 dark:bg-primarylw hover:bg-primarylw-3 dark:hover:bg-primarylw-4 focus:ring-primarylw-2 dark:focus:ring-primarylw-4 focus:ring-offset-blue-500 text-white w-full transition ease-in-out duration-300 rounded-lg shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                                    />
                                </svg>
                                Buy Now
                            </button>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-300">
                            Free shipping on all continental US orders.
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ProductDetailCard