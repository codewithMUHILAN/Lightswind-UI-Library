import React from "react";

const EcommerceFooter = () => {

  return (
    <footer
      className="dark:bg-gray-900 dark:text-white bg-gray-200 text-gray-900 py-12 font-primarylw w-screen  transition duration-300"
    >
      <div className="container mx-auto px-6">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="javascript:void(0)"
                  className="hover:text-blue-400 "
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="hover:text-blue-400 "
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="hover:text-blue-400 "
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="hover:text-blue-400 "
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Customer Service</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="javascript:void(0)"
                  className="hover:text-blue-400 "
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="hover:text-blue-400 "
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="hover:text-blue-400 "
                >
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="hover:text-blue-400 "
                >
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Contact Us</h3>
            <p className="mb-4">
              Have questions? Reach out to us at:
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:support@yourcompany.com"
                className="hover:text-blue-400 "
              >
                support@yourcompany.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+123456789"
                className="hover:text-blue-400 "
              >
                +1 (234) 567-89
              </a>
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="javascript:void(0)"
                className="hover:text-blue-400 "
              >
                <svg class="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd" />
                </svg>
              </a>
              <a
                href="javascript:void(0)"
                className="hover:text-blue-400 "
              >
                <svg class="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M22 5.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.343 8.343 0 0 1-2.605.981A4.13 4.13 0 0 0 15.85 4a4.068 4.068 0 0 0-4.1 4.038c0 .31.035.618.105.919A11.705 11.705 0 0 1 3.4 4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 6.1 13.635a4.192 4.192 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 2 18.184 11.732 11.732 0 0 0 8.291 20 11.502 11.502 0 0 0 19.964 8.5c0-.177 0-.349-.012-.523A8.143 8.143 0 0 0 22 5.892Z" clip-rule="evenodd" />
                </svg>
              </a>
              <a
                href="javascript:void(0)"
                className="hover:text-blue-400 "
              >
                <svg class="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd" />
                </svg>
              </a>
              <a
                href="javascript:void(0)"
                className="hover:text-blue-400 "
              >
                <svg class="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clip-rule="evenodd" />
                  <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Newsletter</h3>
            <p className="mb-4">
              Sign up to receive updates on the latest products and offers.
            </p>
            <form className="flex flex-col sm:flex-row flex-wrap gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 p-3 rounded-lg bg-gray-800 text-white dark:bg-gray-100 text-black border border-gray-200 dakr:border-gray-600
                focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="flex-shrink-0 px-6 py-3 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md "
              >
                Subscribe
              </button>
            </form>
            <div className="mt-6 flex space-x-4">
              <a
                href="javascript:void(0)"
                className="hover:text-blue-400 "
              >
                <svg class="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.537 12.625a4.421 4.421 0 0 0 2.684 4.047 10.96 10.96 0 0 1-1.384 2.845c-.834 1.218-1.7 2.432-3.062 2.457-1.34.025-1.77-.794-3.3-.794-1.531 0-2.01.769-3.275.82-1.316.049-2.317-1.318-3.158-2.532-1.72-2.484-3.032-7.017-1.27-10.077A4.9 4.9 0 0 1 8.91 6.884c1.292-.025 2.51.869 3.3.869.789 0 2.27-1.075 3.828-.917a4.67 4.67 0 0 1 3.66 1.984 4.524 4.524 0 0 0-2.16 3.805m-2.52-7.432A4.4 4.4 0 0 0 16.06 2a4.482 4.482 0 0 0-2.945 1.516 4.185 4.185 0 0 0-1.061 3.093 3.708 3.708 0 0 0 2.967-1.416Z" />
                </svg>
              </a>
              <a
                href="javascript:void(0)"
                className="hover:text-blue-400 "
              >
                <svg class="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.6 16.733c.234.269.548.456.895.534a1.4 1.4 0 0 0 1.75-.762c.172-.615-.446-1.287-1.242-1.481-.796-.194-1.41-.861-1.241-1.481a1.4 1.4 0 0 1 1.75-.762c.343.077.654.26.888.524m-1.358 4.017v.617m0-5.939v.725M4 15v4m3-6v6M6 8.5 10.5 5 14 7.5 18 4m0 0h-3.5M18 4v3m2 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" />
                </svg>

              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-800 dark:border-gray-200 pt-8 text-center text-sm">
          <p>&copy; 2025 lightswind UI. All rights reserved.</p>
          <div className="flex justify-center space-x-8 mt-4">
            <a
              href="javascript:void(0)"
              className="hover:text-blue-400 "
            >
              FAQ
            </a>
            <a
              href="javascript:void(0)"
              className="hover:text-blue-400 "
            >
              Shipping
            </a>
            <a
              href="javascript:void(0)"
              className="hover:text-blue-400 "
            >
              Returns
            </a>
            <a
              href="javascript:void(0)"
              className="hover:text-blue-400 "
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer >
  );
};

export default EcommerceFooter;
