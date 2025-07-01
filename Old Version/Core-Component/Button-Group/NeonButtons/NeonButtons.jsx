import React from 'react';

const NeonButtons = () => {
  return (
    <div className="flex flex-wrap justify-center items-center">
      <a href="javascript:void(0)"
        className="relative inline-block px-6 py-3 m-10 text-[#00fffc] uppercase text-lg tracking-wide overflow-hidden transition-all duration-500 hover:bg-[#00fffc] hover:text-black hover:shadow-[0_0_5px_#00fffc,0_0_25px_#00fffc,0_0_50px_#00fffc,0_0_200px_#00fffc] neon-pulse-animation neon-bounce-animation">
        <span
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent to-[#00fffc]"></span>
        <span
          className="absolute top-[-100%] right-0 w-[2px] h-full bg-gradient-to-b from-transparent to-[#00fffc]"></span>
        <span
          className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-transparent to-[#00fffc]"></span>
        <span
          className="absolute bottom-[-100%] left-0 w-[2px] h-full bg-gradient-to-t from-transparent to-[#00fffc]"></span>
        Neon Button
      </a>

      <a href="javascript:void(0)"
        className="relative inline-block px-6 py-3 m-10 text-[#0BFF27] uppercase text-lg tracking-wide overflow-hidden transition-all duration-500 hover:bg-[#0BFF27] hover:text-black hover:shadow-[0_0_5px_#4caf50,0_0_25px_#4caf50,0_0_50px_#4caf50,0_0_200px_#4caf50] neon-pulse-animation neon-bounce-animation">
        <span
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent to-[#0BFF27]"></span>
        <span
          className="absolute top-[-100%] right-0 w-[2px] h-full bg-gradient-to-b from-transparent to-[#0BFF27]"></span>
        <span
          className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-transparent to-[#0BFF27]"></span>
        <span
          className="absolute bottom-[-100%] left-0 w-[2px] h-full bg-gradient-to-t from-transparent to-[#0BFF27]"></span>
        Neon Button
      </a>

      <a href="javascript:void(0)"
        className="relative inline-block px-6 py-3 m-10 text-[#FF4C9D] uppercase text-lg tracking-wide overflow-hidden transition-all duration-500 hover:bg-[#FF4C9D] hover:text-black hover:shadow-[0_0_5px_#ec4899,0_0_25px_#ec4899,0_0_50px_#ec4899,0_0_200px_#ec4899] neon-pulse-animation neon-bounce-animation">
        <span
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent to-[#FF4C9D]"></span>
        <span
          className="absolute top-[-100%] right-0 w-[2px] h-full bg-gradient-to-b from-transparent to-[#FF4C9D]"></span>
        <span
          className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-transparent to-[#FF4C9D]"></span>
        <span
          className="absolute bottom-[-100%] left-0 w-[2px] h-full bg-gradient-to-t from-transparent to-[#FF4C9D]"></span>
        Neon Button
      </a>
    </div>
  );
};

export default NeonButtons;
