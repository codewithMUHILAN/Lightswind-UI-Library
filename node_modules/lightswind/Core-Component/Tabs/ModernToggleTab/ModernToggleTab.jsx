import React, { useState } from 'react';

const ToggleIconNavbar = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (index) => {
        setActiveIndex(index);
    };

    const icons = ['home', 'bookmark', 'plus', 'user', 'settings'];

    const leftPosition = (activeIndex * 20 + 10) + '%';

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <nav className="relative flex items-center justify-between w-96 h-20 bg-black rounded-lg shadow-lg">
                <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded transition-all duration-500"
                    style={{ left: leftPosition }}
                ></div>
                <ul className="flex items-center justify-between w-full px-6">
                    {icons.map(function (icon, index) {
                        return (
                            <li key={icon}>
                                <a
                                    href="#"
                                    className={
                                        "flex items-center justify-center w-6 h-6 text-white opacity-60 hover:opacity-100 transition-opacity duration-200 " +
                                        (activeIndex === index ? "opacity-100 scale-125" : "")
                                    }
                                    onClick={function (e) {
                                        e.preventDefault();
                                        handleClick(index);
                                    }}
                                >
                                    <svg className="w-6 h-6" fill="currentColor">
                                        <use xlinkHref={"#" + icon + "Icon"} />
                                    </svg>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
                <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="homeIcon">
                    <path
                        d="M13.1428571,14.5 C13.6571429,14.5 14,14.175507 14,13.6887676 L14,6.38767551 C14,6.14430577 13.9142857,5.90093604 13.6571429,5.73868955 L8.51428571,1.6825273 C8.17142857,1.43915757 7.74285714,1.43915757 7.4,1.6825273 L2.25714286,5.73868955 C2.08571429,5.90093604 2,6.14430577 2,6.38767551 L2,13.6887676 C2,14.175507 2.34285714,14.5 2.85714286,14.5 L13.1428571,14.5 Z M5.42857143,12.8775351 L3.71428571,12.8775351 L3.71428571,6.79329173 L8,3.38611544 L12.2857143,6.79329173 L12.2857143,12.8775351 L10.5714286,12.8775351 L5.42857143,12.8775351 Z">
                    </path>
                </symbol>
                <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="bookmarkIcon">
                    <path
                        d="M7.5125,14.3196446 C6.8625,13.7292662 1.5,9.09057902 1.5,5.54830881 C1.5,3.27113511 3.2875,1.5 5.4,1.5 C6.375,1.5 7.26875,1.92169883 8,2.5120772 C8.73125,1.83735907 9.625,1.5 10.6,1.5 C12.79375,1.5 14.5,3.35547487 14.5,5.54830881 C14.5,9.09057902 9.1375,13.7292662 8.4875,14.2353048 C8.24375,14.5726639 7.75625,14.5726639 7.5125,14.3196446 Z M5.4,3.18679534 C4.18125,3.18679534 3.125,4.28321231 3.125,5.54830881 C3.125,7.40378368 5.96875,10.6086948 8,12.4641697 C9.70625,10.8617141 12.875,7.57246322 12.875,5.54830881 C12.875,4.19887254 11.81875,3.18679534 10.6,3.18679534 C9.86875,3.18679534 9.1375,3.60849417 8.73125,4.28321231 C8.40625,4.78925091 7.675,4.78925091 7.35,4.28321231 C6.8625,3.60849417 6.2125,3.18679534 5.4,3.18679534 Z">
                    </path>
                </symbol>
                <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 568" id="settings-icon">
                    <path
                        d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" />
                </symbol>
                <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="plusIcon">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 2C6.48 2 2 6.48001 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48001 17.52 2 12 2ZM11 7V11H7V13H11V17H13V13H17V11H13V7H11ZM4 12C4 16.41 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4C7.59 4 4 7.59 4 12Z" />
                </symbol>
                <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="userIcon">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M7 3H17C18.1 3 19 3.89999 19 5V21L12 18L5 21V5C5 3.89999 5.90002 3 7 3ZM12 15.82L17 18V5H7V18L12 15.82Z" />
                </symbol>
                <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 570" id="settingsIcon">
                    <path
                        d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z" />
                </symbol>
            </svg>
        </div>
    );
};

export default ToggleIconNavbar;
