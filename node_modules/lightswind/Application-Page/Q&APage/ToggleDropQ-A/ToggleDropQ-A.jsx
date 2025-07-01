import React from 'react'

const ToggleDropQA = () => {
  return (
    <div
      class="relative w-full bg-white dark:bg-black px-2 py-10 mt-4 shadow-lg ring-1 ring-gray-400 dark:ring-gray-600 
        sm:mx-auto sm:max-w-2xl sm:rounded-xl sm:px-10 font-primarylw">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100 md:text-4xl">Frequently
          Asked Questions</h2>
        <p class="mt-4 text-sm text-gray-600 dark:text-gray-400 md:text-xl">
          Get quick answers to common queries about our services.
        </p>
      </div>

      <div class="mt-10">
        <div class="max-w-xl mx-auto divide-y divide-gray-200">
          <details
            class="group py-5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 transition duration-200">
            <summary
              class="flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-700 dark:text-gray-300">
              <span>What is Lightswind, and how does it work?</span>
              <span class="transition-transform transform group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p class="mt-3 text-gray-600 dark:text-gray-200 leading-relaxed">
              Lightswind is a UI framework designed to create stunning interfaces with minimal effort. It
              streamlines development by offering pre-built components and an intuitive design language.
            </p>
          </details>

          <details
            class="group py-5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 transition duration-200">
            <summary
              class="flex cursor-pointer items-center justify-between text-lg font-semibold 
                        text-gray-700 dark:text-gray-300">
              <span>Can I customize Lightswind components?</span>
              <span class="transition-transform transform group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p class="mt-3 text-gray-600 dark:text-gray-200 leading-relaxed">
              Absolutely! Lightswind components are fully customizable, allowing you to tailor them to match
              your brand's style and preferences seamlessly.
            </p>
          </details>

          <details
            class="group py-5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 transition duration-200">
            <summary
              class="flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-700 dark:text-gray-300">
              <span>Is there a free version of Lightswind?</span>
              <span class="transition-transform transform group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p class="mt-3 text-gray-600 dark:text-gray-200 leading-relaxed">
              Yes! Lightswind offers a free version with a selection of core components. For access to
              advanced features and premium designs, consider the Pro plan.
            </p>
          </details>

          <details
            class="group py-5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 transition duration-200">
            <summary
              class="flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-700 dark:text-gray-300">
              <span>How do I integrate Lightswind with my project?</span>
              <span class="transition-transform transform group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p class="mt-3 text-gray-600 dark:text-gray-200 leading-relaxed">
              Integrating Lightswind is simple. Add the framework to your project via npm or CDN, and start
              using its pre-designed components right away.
            </p>
          </details>

          <details
            class="group py-5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 transition duration-200">
            <summary
              class="flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-700 dark:text-gray-300">
              <span>What support options are available?</span>
              <span class="transition-transform transform group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <p class="mt-3 text-gray-600 dark:text-gray-200 leading-relaxed">
              Lightswind offers comprehensive documentation, community forums, and premium support options to
              ensure you have everything you need for success.
            </p>
          </details>
        </div>
      </div>
    </div>
  )
}

export default ToggleDropQA