import React from 'react'

const AnimatedHoverButton = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black">
            <button
                className="gradientButton relative border-none py-4 px-12 text-lg text-white rounded-lg min-w-[120px] font-bold cursor-pointer">
                Get Started
            </button>
            <style jsx>{`
                :root {
                    --ahb-x: 11.14%;
                    --ahb-y: 140%;
                    --ahbspread-x: 150%;
                    --ahbspread-y: 180.06%;
                    --ahbcolor-1: #000;
                    --ahbcolor-2: #08012C;
                    --ahbcolor-3: #00fffc;
                    --ahbcolor-4: #00d8d4;
                    --ahbcolor-5: #13a3a1;
                    --ahbstop-1: 37.35%;
                    --ahbstop-2: 61.36%;
                    --ahbstop-3: 78.42%;
                    --ahbstop-4: 89.52%;
                    --ahbstop-5: 100%;
                }

                @property --ahb-x {
                    syntax: "<percentage>";
                    initial-value: 11.14%;
                    inherits: false;
                }

                @property --ahb-y {
                    syntax: "<percentage>";
                    initial-value: 140%;
                    inherits: false;
                }

                @property --ahbspread-x {
                    syntax: "<percentage>";
                    initial-value: 150%;
                    inherits: false;
                }

                @property --ahbspread-y {
                    syntax: "<percentage>";
                    initial-value: 180.06%;
                    inherits: false;
                }

                @property --ahbcolor-1 {
                    syntax: "<ahbcolor>";
                    initial-value: #000;
                    inherits: false;
                }

                @property --ahbcolor-2 {
                    syntax: "<ahbcolor>";
                    initial-value: #08012C;
                    inherits: false;
                }

                @property --ahbcolor-3 {
                    syntax: "<ahbcolor>";
                    initial-value: #00fffc;
                    inherits: false;
                }

                @property --ahbcolor-4 {
                    syntax: "<ahbcolor>";
                    initial-value: #00d8d4;
                    inherits: false;
                }

                @property --ahbcolor-5 {
                    syntax: "<ahbcolor>";
                    initial-value: #13a3a1;
                    inherits: false;
                }

                @property --ahbstop-1 {
                    syntax: "<percentage>";
                    initial-value: 37.35%;
                    inherits: false;
                }

                @property --ahbstop-2 {
                    syntax: "<percentage>";
                    initial-value: 61.36%;
                    inherits: false;
                }

                @property --ahbstop-3 {
                    syntax: "<percentage>";
                    initial-value: 78.42%;
                    inherits: false;
                }

                @property --ahbstop-4 {
                    syntax: "<percentage>";
                    initial-value: 89.52%;
                    inherits: false;
                }

                @property --ahbstop-5 {
                    syntax: "<percentage>";
                    initial-value: 100%;
                    inherits: false;
                }

                .gradientButton {
                    line-height: 1;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    background: radial-gradient(var(--ahbspread-x) var(--ahbspread-y) at var(--ahb-x) var(--ahb-y), var(--ahbcolor-1) var(--ahbstop-1), var(--ahbcolor-2) var(--ahbstop-2), var(--ahbcolor-3) var(--ahbstop-3), var(--ahbcolor-4) var(--ahbstop-4), var(--ahbcolor-5) var(--ahbstop-5));
                    text-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.75);
                    box-shadow: 0 0 0 1px inset rgba(255, 255, 255, 0.1);
                    outline: none;
                    -webkit-tap-highlight-color: transparent;
                    transition: --ahb-x 0.5s, --ahb-y 0.5s, --ahbspread-x 0.5s, --ahbspread-y 0.5s, --ahbcolor-1 0.5s, --ahbcolor-2 0.5s, --ahbcolor-3 0.5s, --ahbcolor-4 0.5s, --ahbcolor-5 0.5s, --ahbstop-1 0.5s, --ahbstop-2 0.5s, --ahbstop-3 0.5s, --ahbstop-4 0.5s, --ahbstop-5 0.5s;
                }

                .gradientButton:hover {
                    --ahb-x: 0%;
                    --ahb-y: 91.51%;
                    --ahbspread-x: 120.24%;
                    --ahbspread-y: 103.18%;
                    --ahbcolor-1: #00fffc;
                    --ahbcolor-2: #8dfffd;
                    --ahbcolor-3: #018b89;
                    --ahbcolor-4: #00fffc;
                    --ahbcolor-5: #000;
                    --ahbstop-1: 0%;
                    --ahbstop-2: 8.8%;
                    --ahbstop-3: 21.44%;
                    --ahbstop-4: 71.34%;
                    --ahbstop-5: 85.76%;
                }
            `}</style>
        </div>
    )
}

export default AnimatedHoverButton
