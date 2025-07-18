import React from 'react';

const PrimaryDarkGroupBtn = () => {
  return (
    <>
      {/* ====== Primary Button Group */}
      <section className="py-20 lg:py-[100px] bg-gray-100 dark:bg-black">
        <div className="container">
          <div className="flex justify-center space-x-0">
            <button className="px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-3 text-xs sm:text-sm md:text-base font-bold font-primarylw text-black dark:text-white  border rounded-l-lg  border-gray-300 dark:border-gray-700  hover:bg-primarylw dark:hover:bg-primarylw hover:text-white dark:hover:text-white">
              Button 1
            </button>
            <button className="px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-3 text-xs sm:text-sm md:text-base font-bold font-primarylw text-black dark:text-white  border-t border-b  border-gray-300 dark:border-gray-700  hover:bg-primarylw dark:hover:bg-primarylw hover:text-white dark:hover:text-white">
              Button 2
            </button>
            <button className="px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-3 text-xs sm:text-sm md:text-base font-bold font-primarylw text-black dark:text-white  border rounded-r-lg  border-gray-300 dark:border-gray-700  hover:bg-primarylw dark:hover:bg-primarylw hover:text-white dark:hover:text-white">
              Button 3
            </button>
          </div>
        </div>
      </section>

      {/* ====== Dark Button Group */}
      <section className="py-20 lg:py-[100px] bg-gray-100 dark:bg-black">
        <div className="container">
          <div className="flex justify-center space-x-0">
            <button className="px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-3 text-xs sm:text-sm md:text-base font-bold font-primarylw text-black dark:text-white  border rounded-l-lg  border-gray-300 dark:border-gray-700  hover:bg-darklw dark:hover:bg-darklw hover:text-white dark:hover:text-white">
              Button 1
            </button>
            <button className="px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-3 text-xs sm:text-sm md:text-base font-bold font-primarylw text-black dark:text-white  border-t border-b  border-gray-300 dark:border-gray-700  hover:bg-darklw dark:hover:bg-darklw hover:text-white dark:hover:text-white">
              Button 2
            </button>
            <button className="px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-3 text-xs sm:text-sm md:text-base font-bold font-primarylw text-black dark:text-white  border rounded-r-lg  border-gray-300 dark:border-gray-700  hover:bg-darklw dark:hover:bg-darklw hover:text-white dark:hover:text-white">
              Button 3
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrimaryDarkGroupBtn;


// export default PrimaryDarkGroupBtn;
