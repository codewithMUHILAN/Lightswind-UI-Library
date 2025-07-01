import React, { useEffect, useState } from "react";


const PortfolioPage = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [typingText, setTypingText] = useState("");
    const textArray = [
        "FullStack Developer,",
        "Frontend Developer,",
        "Backend Developer,",
        "Mobile Apps Developer.",
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    useEffect(() => {
        const typeEffect = () => {
            const currentText = textArray[textIndex];
            if (isDeleting) {
                setTypingText(currentText.substring(0, charIndex--));
            } else {
                setTypingText(currentText.substring(0, charIndex++));
            }

            let typingSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typingSpeed = 1000; // Pause before deleting
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % textArray.length;
                typingSpeed = 500; // Pause before typing new text
            }

            setTimeout(typeEffect, typingSpeed);
        };

        typeEffect();
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };


    return (
        <div className="w-full h-screen bg-gray-200 dark:bg-gray-900 font-primarylw overflow-y-scroll scrollbar-hide">
            <header className="lg:px-16 px-4 flex flex-wrap items-center py-4 shadow-lg bg-gray-200 dark:bg-gray-900">
                <div className="flex-1 flex justify-between items-center">
                    <h2 className="text-4xl font-sans text-black dark:text-white">Muhilan</h2>
                </div>
                <label
                    htmlFor="menu-toggle"
                    className="cursor-pointer md:hidden block"
                    onClick={toggleMenu}
                >
                    <svg
                        className="fill-current text-black dark:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 20 20"
                    >
                        <title>menu</title>
                        <path
                            d={
                                menuOpen
                                    ? "M14.348 14.849l-4.349-4.349-4.349 4.349-1.415-1.415 4.349-4.349-4.349-4.349 1.415-1.415 4.349 4.349 4.349-4.349 1.415 1.415-4.349 4.349 4.349 4.349z"
                                    : "M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"
                            }
                        />
                    </svg>
                </label>
                <input className="hidden" type="checkbox" id="menu-toggle" />

                <div
                    id="menu"
                    className={
                        menuOpen ? "block bg-gray-300 dark:bg-gray-800" : "hidden" +
                            " md:flex md:items-center md:w-auto w-full absolute md:static top-16 left-0 " +
                            "md:bg-transparent transition-all z-50 duration-300 ease-in-out"
                    }
                >

                    <nav>
                        <ul className="md:flex items-center justify-between text-base text-gray-700 dark:text-gray-100 md:pt-0">
                            <li>
                                <a className="md:p-4 py-3 px-4 block text-primarylw" href="#">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a className="md:p-4 py-3 px-4 block" href="#">
                                    About Me
                                </a>
                            </li>
                            <li>
                                <a className="md:p-4 py-3 px-4 block" href="#">
                                    Education
                                </a>
                            </li>
                            <li>
                                <a className="md:p-4 py-3 px-4 block" href="#">
                                    Experience
                                </a>
                            </li>
                            <li>
                                <a className="md:p-4 py-3 px-4 block" href="#">
                                    Projects
                                </a>
                            </li>
                            <li>
                                <a className="md:p-4 py-3 px-4 block md:mb-0 mb-2" href="#">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <div className="h-full w-full mx-auto relative pb-20 xl:px-16 px-8 flex md:flex-row flex-col gap-4 justify-center items-center">
                <div className="w-full relative">
                    <img
                        className="shadow-2xl shadow-blue-500 animate-[spin_12s_linear_infinite] absolute left-0 right-0 rounded-full lg:max-w-[70%] max-w-[60%] mx-auto"
                        src="https://cdn.buymeacoffee.com/uploads/profile_pictures/2023/11/PIXxBAJGpUj1wI7F.png@300w_0e.webp"
                        alt="My Image"
                    />
                    <img
                        className="relative z-10 rounded-full lg:max-w-[70%] max-w-[60%] mx-auto outline outline-[.7rem] outline-offset-[.1rem] outline-blue-400/30"
                        src="https://cdn.buymeacoffee.com/uploads/profile_pictures/2023/11/PIXxBAJGpUj1wI7F.png@300w_0e.webp"
                        alt="My Image"
                    />
                </div>
                <div className="w-full flex flex-col justify-center gap-4 md:text-left text-center text-gray-800 dark:text-white md:mt-0 sm:mt-8 mt-4">
                    <h1 className="md:text-4xl sm:text-3xl text-2xl font-semibold">
                        Hello, My name is Muhilan
                    </h1>
                    <h3 className="capitalize text-primarylw">
                        I'm{" "}
                        <span className="typing text-primarylw dark:text-primarylw-2">
                            {typingText}
                        </span>
                    </h3>
                    <p>
                        Experienced full-stack developer with 4+ years of expertise in
                        Laravel, NestJS, Nuxt.js, Next.js, Android, and some Flutter
                        experience.
                    </p>
                    <div className="sm:mt-4 mt-2">
                        <button className="px-6 py-3 rounded-xl bg-primarylw text-white rounded-sm">
                            Get In Touch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioPage