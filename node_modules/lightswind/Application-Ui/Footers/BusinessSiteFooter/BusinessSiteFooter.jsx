import React from 'react'

const BusinessSiteFooter = () => {
    return (
        <div className=" md:absolute md:bottom-0 w-full  bg-white dark:bg-black ">
            <section
                className="pt-16 pb-7 font-primarylw border border-gray-200 dark:border-gray-800 w-full bg-white dark:bg-black text-black dark:text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-24 pb-14 border-b-2 border-gray-300 dark:border-gray-700">
                        <div className="block w-full lg:max-w-full max-lg:mx-auto">
                            <div className="flex flex-col gap-8 w-full lg:max-w-xs ">
                                {/* <!-- Logo Section --> */}
                                <div className="flex items-center space-x-2 w-full justify-center md:justify-start">
                                    <img src="https://lightswind.com/lighstwind-logo.png" alt="Logo" class="w-8 md:w-12 h-8 md:h-12" />
                                    <h1 class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white hidden md:flex">LightShop
                                    </h1>

                                </div>
                                <p className="text-base font-normal text-black dark:text-white max-[470px]:text-center">
                                    Trusted by over 5 million customers across 100+ countries. Stay connected with us on
                                    social media for the latest updates and exclusive offers.
                                </p>

                                <div
                                    className="flex flex-col min-[470px]:flex-row max-[470px]:gap-4 items-center max-[470px]:justify-center">
                                    <div className="flex items-center">
                                        <img src="https://i.pravatar.cc/100?img=1" alt=""
                                            className="relative w-10 rounded-full" />
                                        <img src="https://i.pravatar.cc/100?img=2" alt=""
                                            className="relative -translate-x-2 z-10  w-10 rounded-full" />
                                        <img src="https://i.pravatar.cc/100?img=3" alt=""
                                            className="relative -translate-x-4 z-20  w-10 rounded-full" />
                                    </div>
                                    <p className="text-black dark:text-white text-base font-normal"><span
                                        className="text-black dark:text-white font-medium">1K
                                    </span>Members
                                        Join</p>
                                </div>
                            </div>
                        </div>
                        <div
                            className="w-full mx-auto flex flex-col min-[470px]:flex-row max-[470px]:items-center min-[470px]:justify-between gap-6 sm:gap-10 xl:gap-24">
                            <div className="">
                                <h6 className="text-lg font-medium text-black dark:text-white mb-7 max-[470px]:text-center">
                                    Company</h6>
                                <ul className="flex flex-col max-[470px]:items-center gap-6">
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">About
                                        Us</a>
                                    </li>
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Our
                                        Team</a>
                                    </li>
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Careers</a>
                                    </li>
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Press
                                        & Media</a></li>
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Contact
                                        Us</a></li>
                                </ul>
                            </div>
                            <div className="">
                                <h6 className="text-lg font-medium text-black dark:text-white max-[470px]:text-center mb-7">
                                    Solutions</h6>
                                <ul className="flex flex-col max-[470px]:items-center gap-6">
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Enterprise
                                        Solutions</a></li>
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Small
                                        Business Solutions</a></li>
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Industry
                                        Solutions</a></li>
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Custom
                                        Development</a></li>
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Case
                                        Studies</a></li>
                                </ul>
                            </div>
                            <div className="">
                                <h6 className="text-lg font-medium text-black dark:text-white max-[470px]:text-center mb-7">
                                    Resources</h6>
                                <ul className="flex flex-col max-[470px]:items-center gap-6">
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Blog</a>
                                    </li>
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Whitepapers</a>
                                    </li>
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Webinars</a>
                                    </li>
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Ebooks</a>
                                    </li>
                                    <li><a href="javascript:;"
                                        className="text-base font-normal max-lg:text-center text-gray-600 dark:text-gray-400 whitespace-nowrap transition-all duration-300 hover:text-indigo-600 focus-within:outline-0 focus-within:text-indigo-600">Customer
                                        Stories</a></li>
                                </ul>
                            </div>

                        </div>
                    </div>
                    <div
                        className="flex flex-col-reverse gap-5 md:flex-row items-center first-letter:items-center justify-between pt-7">
                        <p className="font-normal text-sm text-gray-600 dark:text-gray-400">©<a
                            href="https://pagedone.io/">Lighswind</a>2025, All
                            rights reserved.</p>
                        <ul className="flex items-center gap-9">
                            <li><a href="javascript:;"
                                className="text-gray-600 dark:text-gray-400 text-sm font-normal transition-all duration-300 hover:text-indigo-600 focus-within:text-indigo-600 focus-within:outline-0">Terms</a>
                            </li>
                            <li><a href="javascript:;"
                                className="text-gray-600 dark:text-gray-400 text-sm font-normal transition-all duration-300 hover:text-indigo-600 focus-within:text-indigo-600 focus-within:outline-0">Privacy</a>
                            </li>
                            <li><a href="javascript:;"
                                className="text-gray-600 dark:text-gray-400 text-sm font-normal transition-all duration-300 hover:text-indigo-600 focus-within:text-indigo-600 focus-within:outline-0">Cookies</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BusinessSiteFooter