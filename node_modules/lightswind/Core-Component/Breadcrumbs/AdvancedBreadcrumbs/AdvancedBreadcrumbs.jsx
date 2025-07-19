import React from "react";

const AdvancedBreadcrumbs = () => {
    return (
        <nav className="p-4 ">
            <ol className="flex items-center space-x-2 text-gray-600">
                <li className="group flex items-center">
                    <a
                        href="/"
                        className="relative text-sm   p-2 font-medium text-gray-500 hover:text-indigo-600 transition-all duration-300"
                    >
                        <span
                            className="absolute inset-0 scale-0 bg-indigo-100  p-2 rounded-full group-hover:scale-100 group-hover:opacity-100 transition-transform duration-300 ease-in-out"
                        ></span>
                        <span className="relative z-10 flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                />
                            </svg>
                            Home
                        </span>
                    </a>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-300"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15l7.5-7.5M8.25 7.5l7.5 7.5"
                        />
                    </svg>
                </li>

                <li className="group flex items-center">
                    <a
                        href="/products"
                        className="relative text-sm  p-2 font-medium text-gray-500 hover:text-indigo-600 transition-all duration-300"
                    >
                        <span
                            className="absolute inset-0 p-2 scale-0 bg-indigo-100 rounded-full group-hover:scale-100 group-hover:opacity-100 transition-transform duration-300 ease-in-out"
                        ></span>
                        <span className="relative z-10">Products</span>
                    </a>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-300"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15l7.5-7.5M8.25 7.5l7.5 7.5"
                        />
                    </svg>
                </li>

                <li className="relative">
                    <span className="text-sm font-semibold text-indigo-600">
                        Product Details
                    </span>

                </li>
            </ol>
        </nav>
    );
};

export default AdvancedBreadcrumbs;
