import React, { useEffect, useState } from "react";

const StickyBar = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const targetTime = new Date().getTime() + 2 * 60 * 60 * 1000;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const remainingTime = targetTime - now;

      if (remainingTime <= 0) {
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const hours = Math.floor(
        (remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const minutes = Math.floor(
        (remainingTime % (60 * 60 * 1000)) / (60 * 1000)
      );
      const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

      setTimeLeft({
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  return (
    <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg font-primarylw">
      <div className="relative px-6 py-3 sm:py-4 lg:py-5">
        <div className="flex items-center justify-between pr-10">
          <p className="text-xs font-medium text-white sm:text-sm lg:text-base">
            Save 50%! on every purchase, Offer ends in
          </p>

          <div
            id="countdown"
            className="countdown flex items-center gap-1 text-xs font-medium text-white sm:gap-2 sm:text-sm"
          >
            <span className="rounded-md bg-white/20 px-2 py-1 sm:px-3 sm:py-2">
              {timeLeft.hours}
            </span>
            <span>:</span>
            <span className="rounded-md bg-white/20 px-2 py-1 sm:px-3 sm:py-2">
              {timeLeft.minutes}
            </span>
            <span>:</span>
            <span className="rounded-md bg-white/20 px-2 py-1 sm:px-3 sm:py-2">
              {timeLeft.seconds}
            </span>
          </div>

          <a
            href="javascript:void(0)"
            className="hidden text-xs font-medium text-white underline sm:block sm:text-sm lg:text-base hover:text-white/90"
          >
            Shop Now →
          </a>
        </div>

        <button className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white z-10">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.14288 1.14285L8.00003 8M8.00003 8L14.8572 14.8571M8.00003 8L14.8572 1.14285M8.00003 8L1.14288 14.8571"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default StickyBar;


// export default StickyBar