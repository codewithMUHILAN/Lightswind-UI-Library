import React, { useState } from 'react';

const LoginPopoverModel = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    return (
        <div
            tabIndex="-1"
            className="bg-white dark:bg-black overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 h-full items-center justify-center flex font-primarylw"
        >
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                <div className="relative bg-white dark:bg-black rounded-lg shadow border border-gray-500 dark:border-gray-300 dark:border-gray-700">

                    <button
                        type="button"
                        className="absolute top-3 right-2.5 text-gray-800 dark:text-gray-200 bg-transparent hover:bg-gray-800 dark:hover:bg-gray-200 hover:text-gray-200 dark:hover:text-gray-800 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center popup-close"
                    >
                        <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="sr-only">Close popup</span>
                    </button>

                    <div className="p-5">
                        <div className="text-center">
                            <p className="mb-3 text-xl md:text-2xl font-semibold leading-5 text-gray-800 dark:text-gray-200">
                                Login to your account
                            </p>
                            <p className="mt-2 text-xs md:text-sm leading-4 text-gray-500 dark:text-gray-500">
                                You must be logged in to perform this action.
                            </p>
                        </div>

                        <div className="mt-7 flex flex-col gap-2">
                            {/* GitHub Login Button */}
                            <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border 
                border-gray-600 dark:border-gray-400 bg-white dark:bg-black p-2 text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 outline-none focus:ring-2 
                focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 32 32">
                                    <path
                                        fillRule="evenodd"
                                        d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z"
                                    />
                                </svg>
                                Continue with GitHub
                            </button>

                            {/* Google Login Button */}
                            <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border 
                border-gray-600 dark:border-gray-400 bg-white dark:bg-black p-2 text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 outline-none focus:ring-2 
                focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 48 48">
                                    <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </svg>
                                Continue with Google
                            </button>

                            {/* LinkedIn Login Button */}
                            <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-gray-600 dark:border-gray-400 
                            bg-white dark:bg-black p-2 text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 48 48">
                                    <path fill="#0077B5" d="M38.61,0H9.39C4.2,0,0,4.2,0,9.39v29.22C0,43.8,4.2,48,9.39,48h29.22c5.19,0,9.39-4.2,9.39-9.39V9.39C48,4.2,43.8,0,38.61,0z M15.75,36.08h-5.26v-16.6h5.26V36.08z M13.87,17.73c-1.59,0-2.88-1.29-2.88-2.88c0-1.59,1.29-2.88,2.88-2.88c1.59,0,2.88,1.29,2.88,2.88C16.75,16.44,15.46,17.73,13.87,17.73z M38.61,36.08h-5.26v-8.7c0-4.51-5.29-4.17-5.29,0v8.7H24v-16.6h4.93v2.31c2.07-3.01,9.64-3.45,9.64,4.99V36.08z" />
                                </svg>
                                Continue with LinkedIn
                            </button>
                        </div>

                        <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600 dark:text-slate-400">
                            <div className="h-px w-full bg-slate-700 dark:bg-slate-400"></div>
                            OR
                            <div className="h-px w-full bg-slate-700 dark:bg-slate-400"></div>
                        </div>

                        <form className="w-full">
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 px-3 py-2 shadow-sm outline-none text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-black focus:ring-offset-1"
                                placeholder="Email Address"
                                value={email}
                                onChange={handleEmailChange}
                            />

                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="mt-2 block w-full rounded-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 px-3 py-2 shadow-sm outline-none text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-black focus:ring-offset-1"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                            />

                            <p className="mb-3 mt-2 text-sm text-gray-500">
                                <a href="javascript:void(0)" className="text-blue-800 dark:text-blue-600 hover:text-blue-600 dark:hover:text-blue-300">
                                    Reset your password?
                                </a>
                            </p>

                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-lg bg-black dark:bg-white p-2 py-3 text-sm font-medium text-white dark:text-black outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-1 disabled:bg-gray-400"
                            >
                                Continue
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?
                            <a href="javascript:void(0)" className="font-medium text-blue-800 dark:text-blue-600 hover:text-blue-600 dark:hover:text-blue-300">
                                Sign up
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPopoverModel;