import React, { useEffect, useRef } from 'react';

const DynamicNav = () => {
  const highlightRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const links = linksRef.current;
    const highlight = highlightRef.current;

    const handleHover = (e) => {
      const link = e.currentTarget.parentNode;
      const { left, width } = link.getBoundingClientRect();
      const navRect = e.currentTarget.closest('nav').getBoundingClientRect();

      // Move highlight using string concatenation
      highlight.style.transform = 'translateX(' + (left - navRect.left) + 'px)';
      highlight.style.width = width + 'px';

      // Reset all links' color (keep original hover color)
      links.forEach((link) => link.classList.remove('dynamicNav-highlighted'));

      // Optional: Change hovered link's text size for effect, but not color
      e.currentTarget.style.transform = 'scale(1.1)';
    };

    const handleClick = (e) => {
      e.preventDefault();
      links.forEach((link) => link.parentNode.classList.remove('dynamicNav-active-link'));
      e.currentTarget.parentNode.classList.add('dynamicNav-active-link');
    };

    links.forEach((link) => {
      link.addEventListener('mousemove', handleHover);
      link.addEventListener('click', handleClick);
    });

    // Set initial position using string concatenation
    const { left, width } = links[0].parentNode.getBoundingClientRect();
    const navRect = links[0].closest('nav').getBoundingClientRect();
    highlight.style.transform = 'translateX(' + (left - navRect.left) + 'px)';
    highlight.style.width = width + 'px';

    // Highlight the first link initially
    links[0].classList.add('dynamicNav-highlighted');

    return () => {
      links.forEach((link) => {
        link.removeEventListener('mousemove', handleHover);
        link.removeEventListener('click', handleClick);
      });
    };
  }, []);

  return (
    <main className="w-full max-w-2xl">

      {/* Navigation */}
      <nav className="relative bg-black border border-gray-700 rounded-full shadow-lg backdrop-blur-md dynamicNav-nav-bg px-2">

        {/* Background highlight */}
        <div
          id="highlight"
          ref={highlightRef}
          class="absolute top-0 left-0 h-full w-24 bg-black rounded-full dynamicNav-highlight-glow dynamicNav-highlight-transition cursor-pointer z-0"          ></div>

        <ul className="flex justify-between items-center gap-4 py-2 z-1">
          {/* Navigation Links */}
          <li className="flex-1 rounded-full">
            <a
              href="#home"
              ref={(el) => (linksRef.current[0] = el)}
              className="flex gap-2 items-center justify-center h-8 md:h-12 text-sm md:text-lg rounded-full font-medium dynamicNav-nav-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span class="hidden sm:flex">
                Home
              </span>
            </a>
          </li>
          <li className="flex-1 rounded-full">
            <a
              href="#shop"
              ref={(el) => (linksRef.current[1] = el)}
              className="flex gap-2 items-center justify-center h-8 md:h-12 text-sm md:text-lg rounded-full font-medium dynamicNav-nav-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
              <span class="hidden sm:flex">
                Shop
              </span>
            </a>
          </li>
          <li className="flex-1 rounded-full">
            <a
              href="#about"
              ref={(el) => (linksRef.current[2] = el)}
              className="flex gap-2 items-center justify-center h-8 md:h-12 text-sm md:text-lg rounded-full font-medium dynamicNav-nav-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <span class="hidden sm:flex">
                About
              </span>
            </a>
          </li>
          <li className="flex-1 rounded-full">
            <a
              href="#contact"
              ref={(el) => (linksRef.current[3] = el)}
              className="flex gap-2 items-center justify-center h-8 md:h-12 text-sm md:text-lg rounded-full font-medium dynamicNav-nav-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
              <span class="hidden sm:flex">
                Contact
              </span>
            </a>
          </li>
        </ul>

      </nav>
    </main>
  );
};

export default DynamicNav;