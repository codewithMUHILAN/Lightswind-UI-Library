import React from 'react';

const ProgressBars = () => {
  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen font-sans">
      <div className="w-full px-6 lg:w-4/12">
        {/* Progress Bar 1 */}
        <div className="mb-8">
          <div className="bg-gray-200 w-full h-4 rounded-full">
            <div className="bg-primarylw h-full w-[50%] rounded-full text-white text-xs font-semibold flex items-center justify-center">
              50%
            </div>
          </div>
        </div>

        {/* Progress Bar 2 */}
        <div className="mb-8">
          <div className="bg-gray-200 w-full h-4 rounded-full">
            <div className="bg-green-600 h-full w-[75%] rounded-full text-white text-xs font-semibold flex items-center justify-center">
              75%
            </div>
          </div>
        </div>

        {/* Progress Bar 3 */}
        <div className="mb-8">
          <div className="bg-gray-200 w-full h-4 rounded-full">
            <div className="bg-yellow-500 h-full w-[90%] rounded-full text-white text-xs font-semibold flex items-center justify-center">
              90%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBars;
