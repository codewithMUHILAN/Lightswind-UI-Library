import React from 'react'

const PrimaryBreadCrumbs = () => {
    return (
        <nav className="flex py-4 px-6 rounded-md">
            <ol className="flex items-center space-x-2 font-semibold text-gray-600 dark:text-gray-200">
                <li>
                    <a
                        href="/"
                        className="flex items-center hover:text-primarylw transition-colors duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 mr-1"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            />
                        </svg>
                        Home
                    </a>
                </li>
                <li>
                    <span className="text-gray-400 dark:text-gray-500">/</span> {/* Dark mode for separator */}
                </li>
                <li>
                    <a
                        href="/products"
                        className="hover:text-primarylw transition-colors duration-300"
                    >
                        Products
                    </a>
                </li>
                <li>
                    <span className="text-gray-400 dark:text-gray-500">/</span> {/* Dark mode for separator */}
                </li>
                <li className="text-gray-500 dark:text-gray-300"> {/* Dark mode for current page text */}
                    Current Page
                </li>
            </ol>
        </nav>
    )
}

export default PrimaryBreadCrumbs
