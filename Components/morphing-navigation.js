"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../lib/utils';
export const MorphingNavigation = ({ links, scrollThreshold = 100, enablePageBlur = true, theme = 'glass', backgroundColor, textColor, borderColor, initialTop = 70, compactTop = 20, animationDuration = 1, className, onLinkClick, onMenuToggle, enableSmoothTransitions = true, customHamburgerIcon, disableAutoMorph = false, }) => {
    const [isSticky, setIsSticky] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const headerRef = useRef(null);
    const navRef = useRef(null);
    // Theme styles
    const getThemeStyles = useCallback(() => {
        switch (theme) {
            case 'dark':
                return {
                    nav: 'bg-black/80 border-gray-800',
                    text: 'text-white',
                    button: 'bg-black/50 border-gray-700',
                };
            case 'light':
                return {
                    nav: 'bg-white/80 border-gray-200',
                    text: 'text-gray-900',
                    button: 'bg-white/50 border-gray-300',
                };
            case 'custom':
                return {
                    nav: backgroundColor ? '' : 'bg-white/5 border-white/10',
                    text: textColor ? '' : 'text-white',
                    button: 'bg-black/30 border-white/10',
                };
            case 'glass':
            default:
                return {
                    nav: 'bg-white/5 border-white/10',
                    text: 'text-white',
                    button: 'bg-black/30 border-white/10',
                };
        }
    }, [theme, backgroundColor, textColor]);
    const themeStyles = getThemeStyles();
    // Handle scroll events
    useEffect(() => {
        if (disableAutoMorph)
            return;
        const handleScroll = () => {
            setIsMenuOpen(false);
            const shouldBeSticky = window.scrollY >= scrollThreshold;
            setIsSticky(shouldBeSticky);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollThreshold, disableAutoMorph]);
    // Handle menu toggle
    const handleMenuToggle = () => {
        const newIsOpen = !isMenuOpen;
        setIsMenuOpen(newIsOpen);
        setIsSticky(false);
        onMenuToggle?.(newIsOpen);
    };
    // Handle link click
    const handleLinkClick = (link, event) => {
        event.preventDefault();
        setIsMenuOpen(false);
        onLinkClick?.(link);
        if (enableSmoothTransitions) {
            const targetElement = document.querySelector(link.href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }
    };
    // Handle outside click to close menu
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (navRef.current &&
                !navRef.current.contains(event.target) &&
                isMenuOpen) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, [isMenuOpen]);
    // Custom styles
    const customStyles = {
        backgroundColor: theme === 'custom' && backgroundColor ? backgroundColor : undefined,
        color: theme === 'custom' && textColor ? textColor : undefined,
        borderColor: theme === 'custom' && borderColor ? borderColor : undefined,
    };
    return (_jsxs(_Fragment, { children: [enablePageBlur && isMenuOpen && (_jsx("div", { className: "fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-1000 ease-in-out z-40", style: {
                    opacity: isMenuOpen ? 1 : 0,
                    visibility: isMenuOpen ? 'visible' : 'hidden',
                } })), _jsx("header", { ref: headerRef, className: cn('fixed z-50 transition-all duration-1000 ease-in-out', className), style: {
                    animationDuration: animationDuration + "s", // String concatenation
                }, children: _jsxs("nav", { ref: navRef, className: cn('flex justify-center items-center fixed left-0 right-0 mx-auto backdrop-blur-md border transition-all duration-1000 ease-in-out', themeStyles.nav, themeStyles.text, {
                        // Expanded state
                        'h-[100px] w-[500px] px-5 rounded-full': !isSticky,
                        // Compact state
                        'h-[90px] w-[90px] px-0 rounded-full': isSticky,
                    }), style: {
                        top: (isSticky ? compactTop : initialTop) + "px", // String concatenation
                        transitionDelay: isSticky ? '0.5s' : '0.2s',
                        ...customStyles,
                    }, children: [links.map((link) => (_jsxs("a", { href: link.href, onClick: function (e) {
                                return handleLinkClick(link, e);
                            }, className: cn('font-bold block leading-none text-sm tracking-[2px] lowercase transition-all duration-300 ease-in-out', themeStyles.text, {
                                'px-5 py-2.5 opacity-100 scale-100': !isSticky,
                                'px-0 py-0 opacity-0 scale-[0.3] pointer-events-none': isSticky,
                            }), style: {
                                transitionDelay: isSticky ? '0.2s' : '0.6s',
                                letterSpacing: isSticky ? '0px' : '2px',
                            }, children: [link.icon && (_jsx("span", { className: "inline-block mr-2", children: link.icon })), link.label] }, link.id))), _jsx("button", { onClick: handleMenuToggle, className: cn('absolute left-0 right-0 top-0 bottom-0 m-auto w-[60px] h-[60px] rounded-full outline-none border cursor-pointer backdrop-blur-md transition-all duration-300 ease-in-out', themeStyles.button, {
                                'scale-0': !isSticky,
                                'scale-100': isSticky,
                                'border-white/50': isSticky && theme === 'glass',
                            }), style: {
                                transitionDelay: isSticky ? '0.6s' : '0.2s',
                            }, "aria-label": "Toggle menu", children: customHamburgerIcon || (_jsxs("div", { className: "flex flex-col items-center justify-center h-full", children: [_jsx("span", { className: cn('block h-0.5 bg-current transition-all duration-600 ease-in-out', {
                                            'w-[40%] scale-x-0': !isSticky,
                                            'w-[40%] scale-x-100': isSticky,
                                            'my-1': !isMenuOpen,
                                            'my-2.5': isMenuOpen,
                                        }), style: {
                                            transitionDelay: isSticky ? '0.8s' : '0s',
                                        } }), _jsx("span", { className: cn('block h-0.5 bg-current transition-all duration-600 ease-in-out', {
                                            'w-[40%] scale-x-0': !isSticky,
                                            'w-[40%] scale-x-100': isSticky,
                                            'my-1': !isMenuOpen,
                                            'my-2.5': isMenuOpen,
                                        }), style: {
                                            transitionDelay: isSticky ? '0.8s' : '0s',
                                        } })] })) })] }) }), isMenuOpen && (_jsx("div", { className: "fixed inset-0 z-40 flex items-center justify-center", children: _jsx("div", { className: cn('p-8 rounded-2xl backdrop-blur-md border transition-all duration-500', themeStyles.nav, themeStyles.text), style: customStyles, children: _jsx("div", { className: "flex flex-col space-y-4", children: links.map((link) => (_jsxs("a", { href: link.href, onClick: function (e) {
                                return handleLinkClick(link, e);
                            }, className: cn('font-bold text-lg tracking-wide lowercase hover:scale-105 transition-transform duration-200', themeStyles.text), children: [link.icon && (_jsx("span", { className: "inline-block mr-3", children: link.icon })), link.label] }, link.id))) }) }) }))] }));
};
export default MorphingNavigation;
