import React from "react";

const BasicTooltip = () => {
    return (
        <div className="bg-white dark:bg-black pt-20 pb-10 lg:pt-[120px] lg:pb-20">
            <div className="container mx-auto py-12">
                <div className="-mx-4 flex flex-wrap justify-center">
                    <div className="w-full px-4 sm:w-1/2 lg:w-1/4">
                        <div className="mb-14">
                            <div className="group relative inline-block">
                                <a href="javascript:void(0)" className="bg-primarylw dark:bg-darklw inline-flex rounded-full py-2 px-8 font-medium text-white">
                                    Tooltip on top
                                </a>
                                <div className="bg-darklw dark:bg-white absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded-full py-1.5 px-3.5 
                text-sm text-white dark:text-black opacity-0 group-hover:opacity-100">
                                    <span className="bg-darklw dark:bg-white absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45"></span>
                                    Tooltip Text
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full px-4 sm:w-1/2 lg:w-1/4">
                        <div className="mb-14">
                            <div className="group relative inline-block">
                                <a href="javascript:void(0)" className="bg-primarylw dark:bg-darklw inline-flex rounded-full py-2 px-8 font-medium text-white">
                                    Tooltip on right
                                </a>
                                <div className="bg-darklw dark:bg-white absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full py-1.5 px-3.5 text-sm text-white dark:text-black opacity-0 group-hover:opacity-100">
                                    <span className="bg-darklw dark:bg-white absolute left-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45"></span>
                                    Tooltip Text
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full px-4 sm:w-1/2 lg:w-1/4">
                        <div className="mb-14">
                            <div className="group relative inline-block">
                                <a href="javascript:void(0)" className="bg-primarylw dark:bg-darklw inline-flex rounded-full py-2 px-8 font-medium text-white">
                                    Tooltip on bottom
                                </a>
                                <div className="bg-darklw dark:bg-white absolute top-full left-1/2 z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded-full py-1.5 px-3.5 text-sm text-white dark:text-black opacity-0 group-hover:opacity-100">
                                    <span className="bg-darklw dark:bg-white absolute top-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45"></span>
                                    Tooltip Text
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full px-4 sm:w-1/2 lg:w-1/4">
                        <div className="mb-14 text-right sm:text-left">
                            <div className="group relative inline-block">
                                <a href="javascript:void(0)" className="bg-primarylw dark:bg-darklw inline-flex rounded-full py-2 px-8 font-medium text-white">
                                    Tooltip on left
                                </a>
                                <div className="bg-darklw dark:bg-white absolute right-full top-1/2 z-20 mr-3 
                                -translate-y-1/2 whitespace-nowrap rounded-full py-1.5 px-3.5 text-sm 
                                text-white dark:text-black opacity-0 group-hover:opacity-100">
                                    <span className="bg-darklw dark:bg-white absolute right-[-3px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45"></span>
                                    Tooltip Text
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicTooltip;
