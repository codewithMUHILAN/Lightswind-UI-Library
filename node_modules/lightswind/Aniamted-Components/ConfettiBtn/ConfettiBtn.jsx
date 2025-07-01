import React, { useEffect } from "react";

const ConfettiButton = () => {
  useEffect(() => {
    // Dynamically load the confetti script
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js";
    script.async = true;
    script.onload = () => {
      // Once the script is loaded, attach the confetti function to window
      window.confetti = window.confetti || function () {};
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleClick = () => {
    if (window.confetti) {
      window.confetti({
        particleCount: 250,
        spread: 70,
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <a
        href="javascript:void(0)"
        id="confettiButton"
        onClick={handleClick}
        className="font-bold bg-primarylw text-white hover:bg-primarylw-2 hover:text-white p-4 px-12 md:text-1xl rounded-full cursor-pointer active:scale-125 transform transition-all duration-150"
      >
        <span>Confetti</span>
        <span>🎉</span>
      </a>
    </div>
  );
};

export default ConfettiButton;
