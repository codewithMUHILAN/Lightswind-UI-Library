import { useState } from 'react';

const GlassmorphismLoginForm = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const checkInput = (input) => {
        const label = input.previousElementSibling;
        if (input.value !== '') {
            label.classList.add('-top-0', '-translate-y-8', 'transition-all', 'duration-300');
        } else {
            label.classList.remove('-top-0', '-translate-y-8', 'transition-all', 'duration-300');
        }
    };

    return (
        <div
            className="font-primarylw w-screen max-h-screen bg-black"
        >
            <section className="flex justify-center items-center min-h-screen px-4 ">
                <div
                    className="absolute inset-0 grid overflow-hidden"
                    style={{ filter: "blur(12vw)" }}
                >
                    {/* First Shape */}
                    <div
                        className="absolute inset-0  max-h-screen"
                        style={{
                            clipPath:
                                "polygon(50.9% 37.2%, 43.5% 34.7%, 33.6% 26.1%, 39.2% 10.8%, 26.2% 0.0%, 4.8% 6.4%, 0.0% 30.4%, 20.7% 37.2%, 33.4% 26.3%, 43.2% 34.9%, 45.0% 35.6%, 43.6% 46.4%, 37.8% 59.5%, 21.8% 63.2%, 11.7% 76.1%, 22.9% 91.3%, 47.4% 91.3%, 54.0% 79.0%, 38.0% 59.6%, 43.9% 46.4%, 45.2% 35.5%, 50.9% 37.6%, 56.1% 36.8%, 59.8% 47.6%, 70.3% 61.9%, 87.7% 56.0%, 96.4% 37.4%, 88.6% 15.1%, 63.7% 16.7%, 55.2% 33.6%, 55.9% 36.6%, 50.9% 37.2%)",
                            background: "linear-gradient(hotpink, red, orange, yellow, hotpink)",
                            animation: "GradientAnimatedBgTurn 8000ms linear infinite",
                            opacity: 0.66,
                        }}
                    ></div>

                    {/* Second Shape */}
                    <div
                        className="absolute inset-0  max-h-screen"
                        style={{
                            clipPath:
                                "polygon(50.9% 37.2%, 43.5% 34.7%, 33.6% 26.1%, 39.2% 10.8%, 26.2% 0.0%, 4.8% 6.4%, 0.0% 30.4%, 20.7% 37.2%, 33.4% 26.3%, 43.2% 34.9%, 45.0% 35.6%, 43.6% 46.4%, 37.8% 59.5%, 21.8% 63.2%, 11.7% 76.1%, 22.9% 91.3%, 47.4% 91.3%, 54.0% 79.0%, 38.0% 59.6%, 43.9% 46.4%, 45.2% 35.5%, 50.9% 37.6%, 56.1% 36.8%, 59.8% 47.6%, 70.3% 61.9%, 87.7% 56.0%, 96.4% 37.4%, 88.6% 15.1%, 63.7% 16.7%, 55.2% 33.6%, 55.9% 36.6%, 50.9% 37.2%)",
                            background: "linear-gradient(cyan, blue, green, purple, cyan)",
                            animation: "GradientAnimatedBgTurn 6000ms linear infinite",
                            transform: "rotate(180deg)",
                        }}
                    ></div>
                </div>

                <div className="login-box relative w-full sm:w-[400px] bg-transparent border-2 border-white/50 rounded-2xl flex flex-col justify-center items-center backdrop-blur-[15px] backdrop-filter  p-6">
                    <form action="" className="w-full">
                        <h2 className="text-2xl lg:text-3xl text-white text-center mb-6">Login Here</h2>

                        {/* Email input */}
                        <div className="input-box relative w-full mb-7 border-b-2 border-white">
                            <span className="icon absolute right-2 text-white text-xl leading-[57px]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-5 md:size-6 mt-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                    />
                                </svg>
                            </span>
                            <label className="icon absolute left-2 text-white text-lg leading-[57px]">Email</label>
                            <input
                                type="email"
                                id="email"
                                required
                                className="w-full h-12 bg-transparent border-none outline-none text-white text-lg pl-2 pr-10 peer focus:outline-none focus:ring-0 focus:border-none"
                                onInput={(e) => checkInput(e.target)}
                            />
                        </div>

                        {/* Password input with eye toggle */}
                        <div className="input-box relative w-full mb-7 border-b-2 border-white">
                            <span
                                id="eye-icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xl cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                        stroke="currentColor" className="size-5 md:size-6 mt-4" id="eye-icon-visible">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                        stroke="currentColor" className="size-5 md:size-6 mt-4" id="lock-icon">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                )}
                            </span>
                            <label className="icon absolute left-2 text-white text-lg leading-[57px]">Password</label>
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                required
                                className="w-full h-12 bg-transparent border-none outline-none text-white text-lg pl-2 pr-10 peer focus:outline-none focus:ring-0 focus:border-none"
                                onInput={(e) => checkInput(e.target)}
                            />
                        </div>
                        {/* Remember me and Forgot password */}
                        <div className="remember-forgot flex justify-between text-white text-xs my-3">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" /> Remember me
                            </label>
                            <a href="javascript:void(0)" className="hover:underline">Forgot Password?</a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full h-10 lg:h-12  mt-4 bg-white text-black font-semibold text-lg rounded-full cursor-pointer hover:bg-gray-200"
                        >
                            Login
                        </button>

                        {/* Register Link */}
                        <div className="register-link text-white text-xs text-center mt-6">
                            <p>
                                Don't have an account? <a href="javascript:void(0)" className="font-bold hover:underline">Register</a>
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default GlassmorphismLoginForm;
