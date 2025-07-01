import React from 'react';

const CreateAccountForm = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-gray-900 font-primarylw">
            <div className="max-w-screen-xl mx-6 sm:mx-10 bg-white dark:bg-black border dark:border-gray-800 shadow-2xl rounded-lg overflow-hidden flex flex-col lg:flex-row">
                {/* Left Section */}
                <div className="flex-1 p-6 sm:p-12 lg:p-16">
                    <div className="text-center">
                        <img src="https://lightswind.com/lighstwind-logo.png" alt="Logo" className="w-12 mx-auto" />
                    </div>
                    <div className="mt-12">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center">Create Your Account</h1>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                            Join us today! It takes only a few steps.
                        </p>
                        <div className="mt-8 space-y-4">
                            <button className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg shadow-md flex items-center justify-center hover:bg-blue-600 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 48 48">
                                    <path fill="#fbc02d"
                                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z">
                                    </path>
                                    <path fill="#e53935"
                                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z">
                                    </path>
                                    <path fill="#4caf50"
                                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z">
                                    </path>
                                    <path fill="#1565c0"
                                        d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z">
                                    </path>
                                </svg>
                                <span className="ml-3">Sign up with Google</span>
                            </button>
                            <button className="w-full py-3 px-6 bg-gray-800 text-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-900 transition">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 32 32">
                                    <path fillRule="evenodd" d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z" />
                                </svg>
                                <span className="ml-3">Sign up with GitHub</span>
                            </button>
                        </div>
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-black px-4">
                                Or sign up with your email
                            </div>
                        </div>
                        <form className="space-y-4">
                            <input className="w-full px-8 py-4 rounded-lg bg-gray-100 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-400 dark:bg-black" type="email" placeholder="Email" />
                            <input className="w-full px-8 py-4 rounded-lg bg-gray-100 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 placeholder-gray-500 focus:outline-none focus:border-gray-400 dark:bg-black mt-5" type="password" placeholder="Password" />
                            <button type="submit" className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">Sign Up</button>
                        </form>
                        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
                            By signing up, you agree to our
                            <a href="javascript:void(0)" className="text-blue-500 hover:underline">Terms</a> and
                            <a href="javascript:void(0)" className="text-blue-500 hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
                {/* Right Section */}
                <div className="hidden lg:flex flex-1 bg-indigo-100 items-center justify-center">
                    <img src="https://firebasestorage.googleapis.com/v0/b/codewithmuhilandb.appspot.com/o/uploads%2FBasicLoginFormBg.png?alt=media&token=329d0c0d-71ec-4311-8d80-d21d20c0653f" alt="Illustration" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
    );
};

export default CreateAccountForm;
