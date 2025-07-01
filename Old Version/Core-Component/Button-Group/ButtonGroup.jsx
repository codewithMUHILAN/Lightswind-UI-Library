import React from "react";

const ButtonGroup = () => {
  return (
    <div className="flex justify-center items-center space-x-4 py-8">
      <button className="group relative inline-block px-8 py-3 text-white bg-indigo-600 rounded-md shadow-md overflow-hidden hover:bg-indigo-700 transition-all duration-300">
        <span className="absolute inset-0 w-full h-full bg-indigo-800 transform -translate-x-full group-hover:translate-x-0 transition-all duration-500 ease-in-out"></span>
        <span className="relative z-10">Button 1</span>
      </button>

      <button className="group relative inline-block px-8 py-3 text-white bg-primarylw-2 rounded-md shadow-md overflow-hidden hover:bg-blue-700 transition-all duration-300">
        <span className="absolute inset-0 w-full h-full bg-primarylw transform -translate-x-full group-hover:translate-x-0 transition-all duration-500 ease-in-out"></span>
        <span className="relative z-10">Button 2</span>
      </button>

      <button className="group relative inline-block px-8 py-3 text-white bg-green-600 rounded-md shadow-md overflow-hidden hover:bg-green-700 transition-all duration-300">
        <span className="absolute inset-0 w-full h-full bg-green-800 transform -translate-x-full group-hover:translate-x-0 transition-all duration-500 ease-in-out"></span>
        <span className="relative z-10">Button 3</span>
      </button>
    </div>
  );
};

export default ButtonGroup;
