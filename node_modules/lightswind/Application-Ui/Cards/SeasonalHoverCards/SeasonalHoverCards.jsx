import React from 'react'

const SeasonalHoverCards = () => {
    return (
            <section className="flex items-center justify-center min-h-screen">
                <div className="flex flex-wrap md:flex-nowrap gap-4 w-full px-4">

                    <div
                        className="group relative flex flex-col justify-end p-6 w-full md:w-1/3 h-[350px] lg:h-[450px]  bg-black rounded-lg overflow-hidden shadow-lg transition-all duration-500 hover:w-2/3">
                        <img src="https://images.pexels.com/photos/712395/pexels-photo-712395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            className="absolute inset-0 w-full h-full object-cover object-center" alt="Summer" />
                        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                        <div className="relative md:absolute md:bottom-[7rem] md:bottom-20  z-10 space-y-2">
                            <h2 className="text-xl font-bold text-white">Summer</h2>
                            <p className="text-sm text-gray-300">Hot Envo + Vacations</p>
                        </div>
                        <div
                            className="mt-4 transform translate-y-6 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                            <p className="text-lg text-white">"Summer: a season of sunshine, adventures, and memories waiting to be
                                made."</p>
                        </div>
                    </div>

                    <div
                        className="group relative flex flex-col justify-end p-6 w-full md:w-1/3 h-[350px] lg:h-[450px] bg-black rounded-lg overflow-hidden shadow-lg transition-all duration-500 hover:w-2/3">
                        <img src="https://images.pexels.com/photos/1978126/pexels-photo-1978126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            className="absolute inset-0 w-full h-full object-cover object-center" alt="Winter" />
                        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                        <div className="relative md:absolute md:bottom-[7rem] md:bottom-20  z-10 space-y-2">
                            <h2 className="text-xl font-bold text-white">Winter</h2>
                            <p className="text-sm text-gray-300">Cold Envo + Vacations</p>
                        </div>
                        <div
                            className="mt-4 transform translate-y-6 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                            <p className="text-lg text-white">"Winter, a season of crisp air, cozy nights by the fire, and the magic
                                of snow-covered landscapes."</p>
                        </div>
                    </div>

                    <div
                        className="group relative flex flex-col justify-end p-6 w-full md:w-1/3 h-[350px] lg:h-[450px]  bg-black rounded-lg overflow-hidden shadow-lg transition-all duration-500 hover:w-2/3">
                        <img src="https://images.pexels.com/photos/9095426/pexels-photo-9095426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            className="absolute inset-0 w-full h-full object-cover object-center" alt="Monsoon" />
                        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                        <div className="relative md:absolute md:bottom-[7rem] md:bottom-20  z-10 space-y-2">
                            <h2 className="text-xl font-bold text-white">Monsoon</h2>
                            <p className="text-sm text-gray-300">Rainy Envo + Seasoning</p>
                        </div>
                        <div
                            className="mt-4 transform translate-y-6 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                            <p className="text-lg text-white">"Monsoon, a time of refreshing rains, lush greenery, and the earth's
                                rejuvenation."</p>
                        </div>
                    </div>

                </div>
            </section>
    )
}

export default SeasonalHoverCards