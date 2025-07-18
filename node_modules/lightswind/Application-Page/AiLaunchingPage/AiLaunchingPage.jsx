import React from 'react'

const AiLaunchingPage = () => {
    const toggleMobileMenu = () => {
        const menu = document.getElementById('mobile-menu');
        const menuButton = document.getElementById('mobile-menu-button');

        // Toggle the visibility of the menu
        menu.classList.toggle('hidden');

        // Change the hamburger icon to 'X' when the menu is open
        if (menu.classList.contains('hidden')) {
            menuButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
        } else {
            menuButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>';
        }        
    };

    return (
        <div className="bg-white text-gray-700 dark:bg-black dark:text-gray-100 h-screen ">
            {/* Section 1 */}
            <section className="w-full text-gray-700 bg-white font-primarylw dark:bg-black dark:text-gray-100">
                <div className="container flex flex-col flex-wrap items-center justify-between py-5 mx-auto md:flex-row max-w-7xl">
                    <div className="relative flex justify-between items-center w-full">
                        {/* Logo */}
                        <a href="#_" className="flex items-center mb-5 font-medium text-gray-900 dark:text-gray-200 lg:w-auto lg:items-center lg:justify-center md:mb-0">
                            <span className="text-xl font-bold leading-none text-gray-900 dark:text-white">AI<span className="text-primarylw dark:text-primarylw">X</span></span>
                        </a>

                        {/* Navigation Menu (Desktop) */}
                        <nav className="hidden md:flex flex-wrap items-center mb-5 text-base md:mb-0 md:pl-8 md:ml-8 md:border-x md:border-gray-200 dark:border-gray-700">
                            <a href="#_" className="mr-5 font-medium text-gray-600 hover:text-primarylw dark:text-gray-200 hover:dark:text-primarylw">Home</a>
                            <a href="#_" className="mr-5 font-medium text-gray-600 hover:text-primarylw dark:text-gray-200 hover:dark:text-primarylw">Features</a>
                            <a href="#_" className="mr-5 font-medium text-gray-600 hover:text-primarylw dark:text-gray-200 hover:dark:text-primarylw">Pricing</a>
                            <a href="#_" className="mr-5 font-medium text-gray-600 hover:text-primarylw dark:text-gray-200 hover:dark:text-primarylw">Blog</a>
                        </nav>

                        {/* Mobile Menu Button (Hamburger) */}
                        <button id="mobile-menu-button" className="md:hidden flex items-center text-gray-600 focus:outline-none ml-auto" onClick={toggleMobileMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>

                        {/* Right Section (Sign In / Get Started) */}
                        <div className="inline-flex items-center space-x-6 lg:justify-end hidden md:flex">
                            <a href="#_" className="text-base font-medium text-gray-600 hover:text-primarylw dark:text-gray-200 hover:dark:text-primarylw transition duration-150 ease-in-out">Sign in</a>
                            <a href="#_" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primarylw border border-transparent rounded-md shadow-md hover:bg-primarylw-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primarylw">
                                Get Started
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Menu Dropdown */}
            <div id="mobile-menu" className="hidden bg-white text-gray-700 shadow-md md:hidden dark:bg-black dark:text-gray-100">
                <div className="px-6 py-4">
                    <a href="#_" className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-primarylw dark:text-gray-200 hover:dark:text-primarylw">Home</a>
                    <a href="#_" className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-primarylw dark:text-gray-200 hover:dark:text-primarylw">Features</a>
                    <a href="#_" className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-primarylw dark:text-gray-200 hover:dark:text-primarylw">Pricing</a>
                    <a href="#_" className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-primarylw dark:text-gray-200 hover:dark:text-primarylw">Blog</a>

                    {/* Sign In and Get Started buttons inside the dropdown for mobile */}
                    <a href="#_" className="block px-4 py-2 mt-4 text-base font-medium text-white bg-primarylw rounded-md hover:bg-primarylw-2">
                        Sign in
                    </a>
                    <a href="#_" className="block px-4 py-2 mt-2 text-base font-medium text-white bg-primarylw rounded-md hover:bg-primarylw-2">
                        Get Started
                    </a>
                </div>
            </div>

            {/* Section 2 */}
            <section className="px-2 pt-0 md:pt-20 bg-white md:px-0 font-primarylw dark:bg-black dark:text-gray-100">
                <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
                    <div className="flex flex-wrap items-center sm:-mx-3">
                        <div className="w-full md:w-1/2 md:px-3">
                            <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-7xl md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                                    <span className="block xl:inline">Introducing AIX</span>
                                    <span className="block text-primarylw xl:inline">The Future of Artificial Intelligence.</span>
                                </h1>
                                <p className="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl">Revolutionize your business with AI-driven solutions that deliver results faster than ever. AIX empowers you to innovate, automate, and scale with cutting-edge technology.</p>
                                <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                                    <a href="#_" className="flex items-center w-full px-6 py-3 mb-3 text-sm md:text-lg text-white bg-primarylw rounded-md sm:mb-0 hover:bg-primarylw-2 sm:w-auto">
                                        Try AIX Now
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </a>
                                    <a href="#_" className="flex items-center px-6 py-3 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 text-sm md:text-lg hover:text-gray-600 dark:bg-gray-700 dark:text-gray-200 hover:dark:bg-gray-600 hover:dark:text-gray-300">
                                        Learn More About AIX
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <div className="w-full h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
                                <img src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="AI Image" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AiLaunchingPage