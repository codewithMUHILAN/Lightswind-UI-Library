"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
const TabsContext = React.createContext({
    value: "",
    onValueChange: () => { },
    updateIndicator: () => { },
    indicatorStyle: {},
    registerTabTrigger: () => { },
    registerTabsList: () => { },
});
const Tabs = React.forwardRef(({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "");
    const [indicatorStyle, setIndicatorStyle] = React.useState({});
    const tabsListRef = React.useRef(null);
    const tabTriggerRefs = React.useRef(new Map());
    const controlled = value !== undefined;
    const currentValue = controlled ? value : internalValue;
    const registerTabsList = React.useCallback((element) => {
        tabsListRef.current = element;
    }, []);
    const registerTabTrigger = React.useCallback((value, element) => {
        if (element) {
            tabTriggerRefs.current.set(value, element);
        }
        else {
            tabTriggerRefs.current.delete(value);
        }
    }, []);
    const updateIndicator = React.useCallback(() => {
        if (tabsListRef.current && currentValue) {
            const activeTab = tabTriggerRefs.current.get(currentValue);
            if (activeTab) {
                const tabRect = activeTab.getBoundingClientRect();
                const listRect = tabsListRef.current.getBoundingClientRect();
                setIndicatorStyle({
                    left: `${tabRect.left - listRect.left}px`,
                    width: `${tabRect.width}px`,
                });
            }
        }
    }, [currentValue]);
    React.useEffect(() => {
        updateIndicator();
        window.addEventListener("resize", updateIndicator);
        return () => window.removeEventListener("resize", updateIndicator);
    }, [updateIndicator]);
    const handleValueChange = React.useCallback((newValue) => {
        if (!controlled)
            setInternalValue(newValue);
        onValueChange?.(newValue);
    }, [controlled, onValueChange]);
    return (_jsx(TabsContext.Provider, { value: {
            value: currentValue,
            onValueChange: handleValueChange,
            updateIndicator,
            indicatorStyle,
            registerTabTrigger,
            registerTabsList,
        }, children: _jsx("div", { ref: ref, className: cn("w-full", className), ...props, children: children }) }));
});
Tabs.displayName = "Tabs";
const TabsList = React.forwardRef(({ className, ...props }, ref) => {
    const { indicatorStyle, registerTabsList } = React.useContext(TabsContext);
    return (_jsxs("div", { ref: (el) => {
            if (typeof ref === "function")
                ref(el);
            else if (ref)
                ref.current = el;
            registerTabsList(el);
        }, className: cn(`relative inline-flex h-8 items-center justify-center rounded-full bg-muted text-primary`, className), ...props, children: [_jsx(motion.div, { layout: true, className: "tabs-bg-indicator absolute top-0 left-0 h-full rounded-full bg-gradient-tabs", style: {
                    ...indicatorStyle,
                    position: "absolute",
                    top: 0,
                    borderRadius: "9999px",
                    height: "100%",
                    zIndex: 0,
                }, transition: { type: "spring", stiffness: 300, damping: 30 } }), props.children] }));
});
TabsList.displayName = "TabsList";
const TabsTrigger = React.forwardRef(({ className, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange, registerTabTrigger, updateIndicator } = React.useContext(TabsContext);
    const isActive = selectedValue === value;
    const triggerRef = React.useRef(null);
    React.useEffect(() => {
        registerTabTrigger(value, triggerRef.current);
        return () => registerTabTrigger(value, null);
    }, [value, registerTabTrigger]);
    React.useEffect(() => {
        if (isActive)
            updateIndicator();
    }, [isActive, updateIndicator]);
    return (_jsx("button", { ref: (el) => {
            if (typeof ref === "function")
                ref(el);
            else if (ref)
                ref.current = el;
            triggerRef.current = el;
        }, type: "button", role: "tab", "aria-selected": isActive, "data-state": isActive ? "active" : "inactive", "data-value": value, className: cn(`relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-full
         px-3 py-0.5 md:py-1.5 text-xs lg:text-sm font-medium transition-all 
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
         focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`, isActive ? "text-white dark:text-black" : "", className), onClick: () => onValueChange(value), ...props }));
});
TabsTrigger.displayName = "TabsTrigger";
const TabsContent = React.forwardRef(({ className, value, ...props }, ref) => {
    const { value: selectedValue, updateIndicator } = React.useContext(TabsContext);
    const isActive = selectedValue === value;
    const contentRef = React.useRef(null);
    // Trigger updateIndicator when content resizes
    React.useEffect(() => {
        if (!isActive || !contentRef.current)
            return;
        const observer = new ResizeObserver(() => {
            updateIndicator();
        });
        observer.observe(contentRef.current);
        return () => observer.disconnect();
    }, [isActive, updateIndicator]);
    return (_jsx(AnimatePresence, { mode: "wait", children: isActive && (_jsx("div", { ref: (el) => {
                contentRef.current = el;
                if (typeof ref === "function")
                    ref(el);
                else if (ref)
                    ref.current = el;
            }, role: "tabpanel", "data-state": "active", "data-value": value, className: cn(`mt-2 ring-offset-background focus-visible:outline-none  
             focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
             mx-auto w-full`, className), style: {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
            }, ...props }, value)) }));
});
TabsContent.displayName = "TabsContent";
export { Tabs, TabsList, TabsTrigger, TabsContent };
