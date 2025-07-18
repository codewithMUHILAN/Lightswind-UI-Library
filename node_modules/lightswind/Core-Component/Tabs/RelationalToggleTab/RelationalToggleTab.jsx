import React, { useState } from 'react';

const RelationalToggleTab = () => {
    const [activeTab, setActiveTab] = useState('Home');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className='w-[50%]'>
            {/* Toggle Buttons */}
            <div className="relative flex items-center justify-between w-[80vw] md:w-full gap-2 
            rounded-full border border-gray-400 bg-black h-11 md:h-20 px-2 shadow-md dark:bg-gray-900 dark:border-gray-600">
                {/* Background for the active tab */}
                <div
                    className="absolute h-10 md:h-16 rounded-full bg-primarylw dark:bg-primarydark duration-300"
                    style={{
                        left: activeTab === 'Home' ? '0' : activeTab === 'About' ? '25%' : activeTab === 'Contact' ? '50%' : '75%',
                        width: '25%',
                    }}
                />
                <button
                    className="z-10 flex items-center justify-center w-1/4 h-12 md:h-20 text-lg font-semibold text-white dark:text-gray-300 relative transition-colors duration-300"
                    style={{ color: activeTab === 'Home' ? 'white' : 'gray' }}
                    onClick={() => handleTabClick('Home')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mr-2 md:mr-2 text-2xl md:text-3xl size-7">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span className="hidden md:inline ">Home</span> {/* Hide text on mobile */}
                </button>
                <button
                    className="z-10 flex items-center justify-center w-1/4 h-12 md:h-20 text-lg font-semibold relative transition-colors duration-300"
                    style={{ color: activeTab === 'About' ? 'white' : 'gray' }}
                    onClick={() => handleTabClick('About')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mr-2 md:mr-2 text-2xl md:text-3xl size-7">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <span className="hidden md:inline">About</span> {/* Hide text on mobile */}
                </button>
                <button
                    className="z-10 flex items-center justify-center w-1/4 h-12 md:h-20 text-lg font-semibold relative transition-colors duration-300"
                    style={{ color: activeTab === 'Contact' ? 'white' : 'gray' }}
                    onClick={() => handleTabClick('Contact')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mr-2 md:mr-2 text-2xl md:text-3xl size-7">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
                    </svg>
                    <span className="hidden md:inline">Contact</span> {/* Hide text on mobile */}
                </button>
                <button
                    className="z-10 flex items-center justify-center w-1/4 h-12 md:h-20 text-lg font-semibold relative transition-colors duration-300"
                    style={{ color: activeTab === 'Help' ? 'white' : 'gray' }}
                    onClick={() => handleTabClick('Help')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="mr-2 md:mr-2 text-2xl md:text-3xl size-7">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="hidden md:inline">Help</span> {/* Hide text on mobile */}
                </button>
            </div>
        </div>
    );
};

export default RelationalToggleTab;
