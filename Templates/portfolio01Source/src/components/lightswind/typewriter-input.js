"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { Input } from './input';
export const TypewriterInput = ({ value = '', onChange, placeholder = 'Type something...', name, id, enableAnimation = true, animationDuration = 200, scaleFactor = 50, animationDelay = 300, inputBackground = '#ffffff', textColor = '#000000', caretColor = '#555555', fontWeight = 'black', fontSize = 'sm', borderRadius = 'md', shadowIntensity = 'md', disabled = false, readOnly = false, width = '200px', className, inputClassName, textClassName, enableShakeAnimation = true, style, ariaLabel, onFocus, onBlur, onEnter, ...props }) => {
    var [isAnimating, setIsAnimating] = useState(false);
    var [showCaret, setShowCaret] = useState(true);
    var [internalValue, setInternalValue] = useState(value);
    var prevValueRef = useRef(value);
    var timeoutRef = useRef();
    // Update internal value when prop changes
    useEffect(function () {
        setInternalValue(value);
    }, [value]);
    // Handle animation when value changes
    useEffect(function () {
        if (!enableAnimation)
            return;
        var prevValue = prevValueRef.current;
        var currentValue = internalValue;
        if (currentValue.length > prevValue.length && currentValue.slice(-1) !== ' ') {
            setShowCaret(false);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(function () {
                setIsAnimating(true);
                setTimeout(function () {
                    setIsAnimating(false);
                    setShowCaret(true);
                }, animationDuration);
            }, 50);
        }
        prevValueRef.current = currentValue;
    }, [internalValue, enableAnimation, animationDuration]);
    var handleInputChange = function (e) {
        var newValue = e.target.value;
        setInternalValue(newValue);
        onChange?.(newValue);
    };
    var handleKeyDown = function (e) {
        if (e.key === 'Enter') {
            onEnter?.();
        }
    };
    var characters = internalValue.split('');
    var fontWeightClasses = {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        black: 'font-black'
    };
    var fontSizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
    };
    var borderRadiusClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
    };
    var shadowClasses = {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl'
    };
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: "\n" +
                    "          .typewriter-container {\n" +
                    "            position: relative;\n" +
                    "            width: " + width + ";\n" +
                    "          }\n" +
                    "          \n" +
                    "          .typewriter-input {\n" +
                    "            color: transparent !important;\n" +
                    "            caret-color: " + (showCaret ? caretColor : 'transparent') + ";\n" +
                    "            background-color: " + inputBackground + ";\n" +
                    "          }\n" +
                    "          \n" +
                    "          .typewriter-input::placeholder {\n" +
                    "            color: rgba(0, 0, 0, 0.3);\n" +
                    "            font-weight: 700;\n" +
                    "          }\n" +
                    "          \n" +
                    "          .typewriter-input:focus {\n" +
                    "            box-shadow: rgba(0, 0, 0, 0.1) 0 5px 20px;\n" +
                    "            border: 0.5px solid #000000;\n" +
                    "          }\n" +
                    "          \n" +
                    "          .typewriter-label {\n" +
                    "            position: absolute;\n" +
                    "            top: 50%;\n" +
                    "            left: 12px;\n" +
                    "            transform: translateY(-50%);\n" +
                    "            pointer-events: none;\n" +
                    "            letter-spacing: 0;\n" +
                    "            color: " + textColor + ";\n" +
                    "          }\n" +
                    "          \n" +
                    "          .typewriter-char {\n" +
                    "            display: inline-block;\n" +
                    "            font-family: inherit;\n" +
                    "          }\n" +
                    "          \n" +
                    "          .typewriter-char--animate {\n" +
                    "            animation: typewriter-print " + animationDuration + "ms 1 ease-in-out;\n" +
                    "          }\n" +
                    "          \n" +
                    "          .typewriter-container--shake {\n" +
                    "            animation: typewriter-shake " + animationDuration + "ms 1 ease-in-out;\n" +
                    "          }\n" +
                    "          \n" +
                    "          @keyframes typewriter-print {\n" +
                    "            from {\n" +
                    "              transform: scale(" + scaleFactor + ");\n" +
                    "              position: absolute;\n" +
                    "            }\n" +
                    "            99% {\n" +
                    "              position: absolute;\n" +
                    "            }\n" +
                    "            to {\n" +
                    "              transform: scale(1);\n" +
                    "              position: relative;\n" +
                    "            }\n" +
                    "          }\n" +
                    "          \n" +
                    "          @keyframes typewriter-shake {\n" +
                    "            from, to {\n" +
                    "              transform: scale(1);\n" +
                    "            }\n" +
                    "            50% {\n" +
                    "              transform: scale(0.97);\n" +
                    "            }\n" +
                    "          }\n" +
                    "        " }), _jsxs("div", { className: cn("typewriter-container", {
                    "typewriter-container--shake": isAnimating && enableShakeAnimation
                }, className), style: style, children: [_jsx(Input, { type: "text", value: internalValue, onChange: handleInputChange, onKeyDown: handleKeyDown, onFocus: onFocus, onBlur: onBlur, placeholder: placeholder, name: name, id: id, disabled: disabled, readOnly: readOnly, autoComplete: "off", "aria-label": ariaLabel, className: cn("typewriter-input", fontWeightClasses[fontWeight], fontSizeClasses[fontSize], borderRadiusClasses[borderRadius], shadowClasses[shadowIntensity], inputClassName), ...props }), _jsx("label", { htmlFor: id || "typewriter-" + name, className: cn("typewriter-label", fontWeightClasses[fontWeight], fontSizeClasses[fontSize], textClassName), children: characters.map(function (char, index) {
                            return (_jsx("span", { className: cn("typewriter-char", {
                                    "typewriter-char--animate": isAnimating && index === characters.length - 1
                                }), children: char }, char + "-" + index));
                        }) })] })] }));
};
export default TypewriterInput;
