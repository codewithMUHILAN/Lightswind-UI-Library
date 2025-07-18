import React from 'react'

const PortfolioHero = () => {
    return (
        <div className="bg-white dark:bg-black text-black dark:text-white relative flex items-start justify-center h-screen font-primarylw px-5 py-10 md:px-20 md:py-22">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 md:px-10">
                {/* Left Section */}
                <div className="text-center md:text-left">
                    <h1 className="text-2xl lg:text-5xl font-bold text-black dark:text-white mb-4">
                        <span className="text-primarylw">Hi,</span> I'm a Full Stack Developer
                    </h1>
                    <p className="text-xs md:text-sm lg:md:text-lg text-black dark:text-white mb-8">
                        I specialize in building scalable and performant web applications. With a deep understanding of both
                        front-end and back-end technologies, I create seamless user experiences and high-quality solutions
                        for businesses. Let's turn your ideas into reality.
                    </p>
                    <div className="flex justify-center md:justify-start gap-6">
                        {/* Follow Button */}
                        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primarylw text-white font-semibold hover:bg-primarylw-2 transition-all duration-300 transform hover:scale-105">
                            Follow
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </button>

                        {/* Resume Button */}
                        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-primarylw hover:text-white font-semibold hover:bg-darklw transition-all duration-300 transform hover:scale-105">
                            Resume
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Right Section: Profile Image */}
                <div className="flex justify-center lg:justify-end">
                    <img src="https://cdn.buymeacoffee.com/uploads/profile_pictures/2023/11/PIXxBAJGpUj1wI7F.png@300w_0e.webp"
                        alt="Profile"
                        className="rounded-full w-28 h-28 md:w-64 md:h-64 lg:w-96 lg:h-96  shadow-lg transform hover:scale-105 transition-all duration-300" />
                </div>
            </div>

            {/* Skills Section */}
            <div className="absolute bottom-10 w-full text-center">
                <h2 className="text-xl text-black dark:text-white font-semibold mb-4">Technologies I work with:</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    <span className="bg-white text-black rounded-full py-2 px-6 shadow-md font-medium text-sm">React</span>
                    <span className="bg-white text-black rounded-full py-2 px-6 shadow-md font-medium text-sm">Node.js</span>
                    <span className="bg-white text-black rounded-full py-2 px-6 shadow-md font-medium text-sm">Tailwind CSS</span>
                    <span className="bg-white text-black rounded-full py-2 px-6 shadow-md font-medium text-sm">GraphQL</span>
                </div>
            </div>
        </div>
    )
}

export default PortfolioHero