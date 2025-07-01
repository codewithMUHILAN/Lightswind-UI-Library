import React from 'react'

const BlogsCardsPage = () => {
    return (
        <div className=" bg-white dark:bg-black">
            <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16 font-primarylw">
                <div className="border-b border-gray-300 dark:border-gray-700 mb-5 flex justify-between text-sm">
                    <div
                        className="text-primarylw flex items-center pb-2 pr-2 border-b-2 border-blue-600 dark:border-blue-600 uppercase">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                        </svg>

                        <a href="javascript:void(0)" className="ml-1 font-semibold inline-block">Artificial Intelligence Blog</a>
                    </div>
                    <a href="# " className="text-primarylw-2 dark:text-primarylw-2">See All</a>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10">

                    {/* <!-- CARD 1 --> */}
                    <div
                        className="rounded overflow-hidden shadow-lg flex flex-col text-black dark:text-white border border-gray-200 dark:border-gray-800 ">
                        <a href="javascript:void(0)"></a>
                        <div className="relative">
                            <a href="#!">
                                <img className="w-full"
                                    src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600"
                                    alt="AI Technology Blog" />
                                <div
                                    className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                                </div>
                            </a>
                            <a href="javascript:void(0)">
                                <div
                                    className="text-xs absolute top-0 right-0 bg-primarylw px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-primarylw transition duration-500 ease-in-out">
                                    AI in Tech
                                </div>
                            </a>
                        </div>
                        <div className="px-6 py-4 mb-auto">
                            <a href="javascript:void(0)"
                                className="font-medium text-lg inline-block hover:text-primarylw transition duration-500 ease-in-out inline-block mb-2">How
                                AI is Revolutionizing the Tech Industry</a>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                AI is transforming industries, from healthcare to finance, with its ability to process large
                                amounts of data and learn from patterns.
                            </p>
                        </div>
                        <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-200 dark:bg-gray-800">
                            <span href="javascript:void(0)" className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" className="size-6 text-black dark:text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                                <span className="ml-1  text-black dark:text-white">2 hours ago</span>
                            </span>

                            <span href="javascript:void(0)" className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                                <svg className="h-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
                                    </path>
                                </svg>
                                <span className="ml-1  text-black dark:text-white">45 Comments</span>
                            </span>
                        </div>
                    </div>

                    {/* <!-- CARD 2 --> */}
                    <div
                        className="rounded overflow-hidden shadow-lg flex flex-col text-black dark:text-white border border-gray-200 dark:border-gray-800">
                        <a href="javascript:void(0)"></a>
                        <div className="relative">
                            <a href="#!">
                                <img className="w-full"
                                    src="https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg?auto=compress&cs=tinysrgb&w=600"
                                    alt="AI in Healthcare" />
                                <div
                                    className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                                </div>
                            </a>
                            <a href="javascript:void(0)">
                                <div
                                    className="text-xs absolute top-0 right-0 bg-primarylw px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-primarylw transition duration-500 ease-in-out">
                                    AI in Healthcare
                                </div>
                            </a>
                        </div>
                        <div className="px-6 py-4 mb-auto">
                            <a href="javascript:void(0)"
                                className="font-medium text-lg inline-block hover:text-primarylw transition duration-500 ease-in-out inline-block mb-2">AI
                                and the Future of Healthcare</a>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Discover how AI-powered tools are being used for diagnostic purposes, enhancing patient
                                care,
                                and revolutionizing healthcare systems worldwide.
                            </p>
                        </div>
                        <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-200 dark:bg-gray-800">
                            <span href="javascript:void(0)" className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" className="size-6 text-black dark:text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span className="ml-1 text-black dark:text-white">1 day ago</span>
                            </span>

                            <span href="javascript:void(0)" className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                                <svg className="h-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
                                    </path>
                                </svg>
                                <span className="ml-1 text-black dark:text-white">25 Comments</span>
                            </span>
                        </div>
                    </div>

                    {/* <!-- CARD 3 --> */}
                    <div
                        className="rounded overflow-hidden shadow-lg flex flex-col text-black dark:text-white border border-gray-200 dark:border-gray-800">
                        <a href="javascript:void(0)"></a>
                        <div className="relative">
                            <a href="#!">
                                <img className="w-full"
                                    src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600"
                                    alt="AI in Business" />
                                <div
                                    className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                                </div>
                            </a>
                            <a href="javascript:void(0)">
                                <div
                                    className="text-xs absolute top-0 right-0 bg-primarylw px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-primarylw transition duration-500 ease-in-out">
                                    AI in Business
                                </div>
                            </a>
                        </div>
                        <div className="px-6 py-4 mb-auto">
                            <a href="javascript:void(0)"
                                className="font-medium text-lg inline-block hover:text-primarylw transition duration-500 ease-in-out inline-block mb-2">How
                                AI is Transforming Business Models</a>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Learn how AI-driven automation and predictive analytics are helping businesses increase
                                efficiency and profitability.
                            </p>
                        </div>
                        <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-200 dark:bg-gray-800">
                            <span href="javascript:void(0)" className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" className="size-6 text-black dark:text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span className="ml-1 text-black dark:text-white">3 days ago</span>
                            </span>

                            <span href="javascript:void(0)" className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                                <svg className="h-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
                                    </path>
                                </svg>
                                <span className="ml-1 text-black dark:text-white">33 Comments</span>
                            </span>
                        </div>
                    </div>

                    {/* <!-- CARD 4 --> */}
                    <div
                        className="rounded overflow-hidden shadow-lg flex flex-col text-black dark:text-white border border-gray-200 dark:border-gray-800">
                        <a href="javascript:void(0)"></a>
                        <div className="relative">
                            <a href="javascript:void(0)">
                                <img className="w-full"
                                    src="https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg?auto=compress&cs=tinysrgb&w=600"
                                    alt="AI in Finance" />
                                <div
                                    className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                                </div>
                            </a>
                            <a href="#!">
                                <div
                                    className="text-xs absolute top-0 right-0 bg-primarylw px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-primarylw transition duration-500 ease-in-out">
                                    AI in Finance
                                </div>
                            </a>
                        </div>
                        <div className="px-6 py-4 mb-auto">
                            <a href="javascript:void(0)"
                                className="font-medium text-lg inline-block hover:text-primarylw transition duration-500 ease-in-out inline-block mb-2">AI
                                and Its Impact on the Financial Sector</a>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Explore how AI is reshaping the finance industry with predictive analytics, fraud detection,
                                and
                                smarter investment strategies.
                            </p>
                        </div>
                        <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-200 dark:bg-gray-800">
                            <span href="javascript:void(0)" className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" className="size-6 text-black dark:text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span className="ml-1 text-black dark:text-white">5 days ago</span>
                            </span>

                            <span href="javascript:void(0)" className="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                                <svg className="h-5 text-black dark:text-white" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
                                    </path>
                                </svg>
                                <span className="ml-1 text-black dark:text-white">12 Comments</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogsCardsPage