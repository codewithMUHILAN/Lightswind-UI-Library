import React, { useState } from "react";

const ToggleThemeSidebar = () => {
    const [isSidebarExpanded, setSidebarExpanded] = useState(false);
    const [isSidebarDarkMode, setSidebarDarkMode] = useState(false);

    const toggleSidebar = () => {
        setSidebarExpanded((prev) => !prev);
    };

    const toggleSidebarTheme = () => {
        setSidebarDarkMode((prev) => !prev);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <div
            className={`flex items-center justify-center w-screen h-[700px] p-10 space-x-6 ${isSidebarDarkMode ? "bg-gray-100" : "bg-gray-800"
                }`}
        >
            <div
                className={`relative flex flex-col items-center overflow-hidden rounded-md h-full transition-all duration-300 ${isSidebarExpanded ? "w-60" : "w-16"
                    } ${isSidebarDarkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-black"}`}
            >
                <button
                    className="flex items-center justify-center w-12 h-12 mt-2 mx-auto border border-gray-500 hover:bg-gray-600 rounded focus:outline-none"
                    onClick={toggleSidebar}
                >
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>

                <div className="w-full px-2">
                    <nav className="flex flex-col items-center w-full">
                        {[
                            {
                                icon: (
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                ),
                                label: "Dashboard",
                            },
                            {
                                icon: (
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                ), label: "Search"
                            },
                            {
                                icon: (
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                ), label: "Insights"
                            },
                            {
                                icon: (
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                ), label: "Docs"
                            },
                        ].map(({ icon, label }) => (
                            <a
                                key={label}
                                href="#"
                                className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300 dark:hover:bg-gray-600"
                            >
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {/* <use href={`#${icon}`} /> */}
                                    $ {icon}
                                </svg>
                                {isSidebarExpanded && <span className="ml-2 text-sm font-medium">{label}</span>}
                            </a>
                        ))}
                    </nav>

                    <div className="flex flex-col items-center w-full mt-2 border-t border-gray-700 dark:border-gray-600">
                        {[
                            {
                                icon: (
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                ),
                                label: "Products",
                            },
                            {
                                icon: (
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                ),
                                label: "Settings",
                            },
                            {
                                icon: (
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                ),
                                label: "Messages",
                            },
                        ].map(({ icon, label }) => (
                            <a
                                key={label}
                                href="#"
                                className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300 dark:hover:bg-gray-600"
                            >
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {/* <use href={`#${icon}`} /> */}
                                    $ {icon}
                                </svg>
                                {isSidebarExpanded && <span className="ml-2 text-sm font-medium">{label}</span>}
                            </a>
                        ))}
                    </div>
                </div>

                <button
                    onClick={toggleSidebarTheme}
                    className="absolute bottom-20 p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        {isSidebarDarkMode ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                            />
                        )}
                    </svg>
                </button>

                <a class="flex items-center justify-center w-full h-16 mt-auto  hover:text-gray-300 
dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-300" href="#">
                    <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

export default ToggleThemeSidebar;
