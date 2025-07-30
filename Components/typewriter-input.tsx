"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { Input } from './input';

export interface TypewriterInputProps {
  /** The value of the input */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Input name attribute */
  name?: string;
  /** Input id attribute */
  id?: string;
  /** Enable typewriter animation */
  enableAnimation?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Scale factor for character animation */
  scaleFactor?: number;
  /** Animation delay between characters */
  animationDelay?: number;
  /** Input background color */
  inputBackground?: string;
  /** Text color */
  textColor?: string;
  /** Caret color */
  caretColor?: string;
  /** Font weight */
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  /** Font size */
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  /** Border radius */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Shadow intensity */
  shadowIntensity?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Disable input */
  disabled?: boolean;
  /** Make input readonly */
  readOnly?: boolean;
  /** Input width */
  width?: string;
  /** Custom className for container */
  className?: string;
  /** Custom className for input */
  inputClassName?: string;
  /** Custom className for animated text */
  textClassName?: string;
  /** Enable shake animation on focus */
  enableShakeAnimation?: boolean;
  /** Custom styles */
  style?: React.CSSProperties;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Callback when input is focused */
  onFocus?: () => void;
  /** Callback when input loses focus */
  onBlur?: () => void;
  /** Callback when Enter key is pressed */
  onEnter?: () => void;
}

export const TypewriterInput: React.FC<TypewriterInputProps> = ({
  value = '',
  onChange,
  placeholder = 'Type something...',
  name,
  id,
  enableAnimation = true,
  animationDuration = 200,
  scaleFactor = 50,
  animationDelay = 300,
  inputBackground = '#ffffff',
  textColor = '#000000',
  caretColor = '#555555',
  fontWeight = 'black',
  fontSize = 'sm',
  borderRadius = 'md',
  shadowIntensity = 'md',
  disabled = false,
  readOnly = false,
  width = '200px',
  className,
  inputClassName,
  textClassName,
  enableShakeAnimation = true,
  style,
  ariaLabel,
  onFocus,
  onBlur,
  onEnter,
  ...props
}) => {
  var [isAnimating, setIsAnimating] = useState(false);
  var [showCaret, setShowCaret] = useState(true);
  var [internalValue, setInternalValue] = useState(value);
  var prevValueRef = useRef(value);
  var timeoutRef = useRef<NodeJS.Timeout>();

  // Update internal value when prop changes
  useEffect(function () {
    setInternalValue(value);
  }, [value]);

  // Handle animation when value changes
  useEffect(function () {
    if (!enableAnimation) return;

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

  var handleInputChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    var newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  var handleKeyDown = function (e: React.KeyboardEvent<HTMLInputElement>) {
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

  return (
    <>
      <style>
        {"\n" +
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
          "        "}
      </style>

      <div
        className={cn(
          "typewriter-container",
          {
            "typewriter-container--shake": isAnimating && enableShakeAnimation
          },
          className
        )}
        style={style}
      >
        <Input
          type="text"
          value={internalValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          name={name}
          id={id}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete="off"
          aria-label={ariaLabel}
          className={cn(
            "typewriter-input",
            fontWeightClasses[fontWeight],
            fontSizeClasses[fontSize],
            borderRadiusClasses[borderRadius],
            shadowClasses[shadowIntensity],
            inputClassName
          )}
          {...props}
        />

        <label
          htmlFor={id || "typewriter-" + name}
          className={cn(
            "typewriter-label",
            fontWeightClasses[fontWeight],
            fontSizeClasses[fontSize],
            textClassName
          )}
        >
          {characters.map(function (char, index) {
            return (
              <span
                key={char + "-" + index}
                className={cn(
                  "typewriter-char",
                  {
                    "typewriter-char--animate": isAnimating && index === characters.length - 1
                  }
                )}
              >
                {char}
              </span>
            );
          })}
        </label>
      </div>
    </>
  );
};

export default TypewriterInput;