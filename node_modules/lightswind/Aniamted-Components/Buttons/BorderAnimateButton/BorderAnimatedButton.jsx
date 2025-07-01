import React from "react";

const BorderAnimatedButton = () => {
  return (
    <div className="w-full h-screen bg-gray-100 dark:bg-black grid place-items-center font-primarylw">
      <div
        className="gradient-border px-10 py-4 grid place-content-center rounded-full text-white dark:text-gray-300 text-shadow-md border-[5px] border-transparent cursor-pointer"
      >
        Animated Button
      </div>

    </div>
  );
};

export default BorderAnimatedButton;