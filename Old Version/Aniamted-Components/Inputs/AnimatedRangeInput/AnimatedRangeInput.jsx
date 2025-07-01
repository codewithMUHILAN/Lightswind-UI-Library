import React, { useState } from 'react';

const AnimatedRangeInput = () => {
  const [percentage1, setPercentage1] = useState(50);
  const [percentage2, setPercentage2] = useState(50);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-400 dark:bg-gray-800">
      <div className="slider-wrapper relative w-40 h-10 font-primarylw">
        <label className="animatedRangeInput relative cursor-pointer inline-flex flex-row-reverse items-center w-full">
          <input
            type="range"
            min="0"
            max="100"
            value={percentage1}
            step="1"
            className="cursor-pointer animatedRangeInputLevel appearance-none w-full h-[50px] bg-[#525252] dark:bg-[#444444] overflow-hidden rounded-[9px] transition-[height_0.1s] cursor-inherit transform rotate-[270deg]"
            id="animatedRangeInput-range-slider"
            onChange={(e) => setPercentage1(e.target.value)}
          />
          {/* Live percentage display */}
          <span
            id="percentage"
            className=" percentage absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-black z-10"
          >
            {percentage1}%
          </span>
          <svg
            className="inline-block align-top text-black dark:text-gray-200 w-[25px] h-auto absolute left-4 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="512"
            height="512"
            x="0"
            y="0"
            viewBox="0 0 24 24"
            style={{ enableBackground: 'new 0 0 512 512' }}
            xmlSpace="preserve"
          >
            <g>
              <path
                d="M18.36 19.36a1 1 0 0 1-.705-1.71C19.167 16.148 20 14.142 20 12s-.833-4.148-2.345-5.65a1 1 0 1 1 1.41-1.419C20.958 6.812 22 9.322 22 12s-1.042 5.188-2.935 7.069a.997.997 0 0 1-.705.291z"
                fill="currentColor"
                data-original="#000000"
              ></path>
              <path
                d="M15.53 16.53a.999.999 0 0 1-.703-1.711C15.572 14.082 16 13.054 16 12s-.428-2.082-1.173-2.819a1 1 0 1 1 1.406-1.422A6 6 0 0 1 18 12a6 6 0 0 1-1.767 4.241.996.996 0 0 1-.703.289zM12 22a1 1 0 0 1-.707-.293L6.586 17H4c-1.103 0-2-.897-2-2V9c0-1.103.897-2 2-2h2.586l4.707-4.707A.998.998 0 0 1 13 3v18a1 1 0 0 1-1 1z"
                fill="currentColor"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </label>
      </div>

      <div className="slider-wrapper relative w-40 h-20 mt-10">
        <label className="animatedRangeInput relative cursor-pointer inline-flex flex-row-reverse items-center w-full">
          <input
            type="range"
            min="0"
            max="100"
            value={percentage2}
            step="1"
            className="cursor-pointer animatedRangeInputLevel appearance-none w-full h-[50px] bg-[#525252] dark:bg-[#444444] overflow-hidden rounded-[9px] transition-[height_0.1s] cursor-inherit transform rotate-[270deg]"
            id="animatedRangeInput-range-slider-2"
            onChange={(e) => setPercentage2(e.target.value)}
          />
          {/* Live percentage display */}
          <span
            id="percentage-2"
            className="percentage absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-black z-10"
          >
            {percentage2}%
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="inline-block align-top  text-black dark:text-gray-200 w-[25px] h-auto absolute left-4 pointer-events-none size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
          </svg>
        </label>
      </div>
    </div>
  );
};

export default AnimatedRangeInput;
