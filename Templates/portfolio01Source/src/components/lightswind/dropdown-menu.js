import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
import { cva } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
const DropdownMenuContext = React.createContext(undefined);
const DropdownMenu = ({ children, defaultOpen = false, open: controlledOpen, onOpenChange, hoverMode = false, }) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const triggerRef = React.useRef(null);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;
    const setOpen = React.useCallback((value) => {
        if (!isControlled) {
            setUncontrolledOpen(value);
        }
        if (onOpenChange) {
            const newValue = typeof value === "function" ? value(open) : value;
            onOpenChange(newValue);
        }
    }, [isControlled, onOpenChange, open]);
    return (_jsx(DropdownMenuContext.Provider, { value: { open, setOpen, hoverMode, triggerRef }, children: children }));
};
const DropdownMenuTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) {
        throw new Error("DropdownMenuTrigger must be used within a DropdownMenu");
    }
    const { setOpen, hoverMode, triggerRef } = context;
    const handleClick = (e) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
        if (props.onClick) {
            props.onClick(e);
        }
    };
    // New ref for managing hover timeout specifically within the trigger
    const triggerHoverTimeoutRef = React.useRef(null);
    React.useImperativeHandle(ref, () => {
        // Ensure triggerRef.current is not null before returning
        // This should now correctly refer to the DOM element after the ref callback runs
        if (!triggerRef.current) {
            // Fallback or throw an error if triggerRef.current is not set
            console.warn("DropdownMenuTrigger ref is null. Ensure children forward their ref when asChild is true.");
            return document.createElement("button"); // Return a dummy element to satisfy the type
        }
        return triggerRef.current;
    }, []);
    const handleMouseEnter = (e) => {
        if (hoverMode) {
            if (triggerHoverTimeoutRef.current) {
                clearTimeout(triggerHoverTimeoutRef.current);
            }
            triggerHoverTimeoutRef.current = setTimeout(() => {
                setOpen(true);
            }, 100);
            if (triggerRef.current) {
                triggerRef.current._hoverTimeoutRef =
                    triggerHoverTimeoutRef.current;
            }
        }
        if (props.onMouseEnter) {
            props.onMouseEnter(e);
        }
    };
    const handleMouseLeaveTrigger = (e) => {
        if (hoverMode) {
            if (triggerHoverTimeoutRef.current) {
                clearTimeout(triggerHoverTimeoutRef.current);
            }
        }
        if (props.onMouseLeave) {
            props.onMouseLeave(e);
        }
    };
    const { onClick, onMouseEnter, onMouseLeave, ...otherProps } = props;
    if (asChild) {
        const child = React.Children.only(children);
        if (!React.isValidElement(child)) {
            throw new Error("DropdownMenuTrigger when asChild is true must have a single valid React element child.");
        }
        return React.cloneElement(child, {
            ...child.props,
            ref: (node) => {
                // Update the internal triggerRef
                triggerRef.current = node;
                // Handle the forwarded ref from forwardRef
                if (typeof ref === "function") {
                    ref(node);
                }
                else if (ref) {
                    ref.current =
                        node;
                }
                // Handle the original ref of the child element
                const childRef = child.ref;
                if (childRef) {
                    if (typeof childRef === "function") {
                        childRef(node);
                    }
                    else if (childRef.hasOwnProperty("current")) {
                        childRef.current =
                            node;
                    }
                }
            },
            onClick: (e) => {
                handleClick(e);
                if (child.props.onClick)
                    child.props.onClick(e);
            },
            onMouseEnter: (e) => {
                handleMouseEnter(e);
                if (child.props.onMouseEnter)
                    child.props.onMouseEnter(e);
            },
            onMouseLeave: (e) => {
                handleMouseLeaveTrigger(e);
                if (child.props.onMouseLeave)
                    child.props.onMouseLeave(e);
            },
        });
    }
    return (_jsx("button", { ref: (node) => {
            triggerRef.current = node;
            if (typeof ref === "function") {
                ref(node);
            }
            else if (ref) {
                ref.current = node;
            }
        }, type: "button", onClick: handleClick, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeaveTrigger, ...otherProps, children: children }));
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";
const dropdownMenuContentVariants = cva("z-50 min-w-[8rem] overflow-hidden rounded-md border   bg-popover p-1 text-popover-foreground shadow-md", {
    variants: {
        variant: {
            default: "",
            contextMenu: "min-w-0",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
const DropdownMenuContent = React.forwardRef(({ className, children, align = "center", alignOffset = 0, side = "bottom", sideOffset = 4, variant, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) {
        throw new Error("DropdownMenuContent must be used within a DropdownMenu");
    }
    const { open, setOpen, hoverMode, triggerRef } = context;
    const menuRef = React.useRef(null);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const contentMouseLeaveTimeoutRef = React.useRef(null);
    React.useEffect(() => {
        if (!open)
            return;
        const handleClickOutside = (e) => {
            if (menuRef.current &&
                !menuRef.current.contains(e.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, setOpen, triggerRef]);
    const handleMouseLeave = (e) => {
        if (hoverMode) {
            if (contentMouseLeaveTimeoutRef.current) {
                clearTimeout(contentMouseLeaveTimeoutRef.current);
            }
            contentMouseLeaveTimeoutRef.current = setTimeout(() => {
                setOpen(false);
            }, 150);
        }
        if (props.onMouseLeave) {
            props.onMouseLeave(e);
        }
    };
    const handleMouseEnterContent = (e) => {
        if (hoverMode) {
            if (contentMouseLeaveTimeoutRef.current) {
                clearTimeout(contentMouseLeaveTimeoutRef.current);
            }
            if (triggerRef.current) {
                const triggerAny = triggerRef.current;
                if (triggerAny._hoverTimeoutRef) {
                    clearTimeout(triggerAny._hoverTimeoutRef);
                    triggerAny._hoverTimeoutRef = null;
                }
            }
        }
        if (props.onMouseEnter) {
            props.onMouseEnter(e);
        }
    };
    React.useEffect(() => {
        if (!open || !triggerRef.current)
            return;
        const updatePosition = () => {
            if (!triggerRef.current)
                return;
            const triggerRect = triggerRef.current.getBoundingClientRect();
            let menuRect = menuRef.current?.getBoundingClientRect();
            if (!menuRect) {
                const dummyDiv = document.createElement("div");
                dummyDiv.style.visibility = "hidden";
                dummyDiv.style.position = "absolute";
                dummyDiv.style.minWidth = "8rem";
                dummyDiv.style.padding = "1px";
                dummyDiv.style.border = "1px solid";
                dummyDiv.className = cn(dropdownMenuContentVariants({ variant }), className);
                document.body.appendChild(dummyDiv);
                menuRect = dummyDiv.getBoundingClientRect();
                document.body.removeChild(dummyDiv);
            }
            let top = 0;
            let left = 0;
            if (side === "bottom") {
                top = triggerRect.bottom + sideOffset;
            }
            else if (side === "top") {
                top = triggerRect.top - (menuRect?.height || 0) - sideOffset;
            }
            else if (side === "left" || side === "right") {
                top =
                    triggerRect.top +
                        triggerRect.height / 2 -
                        (menuRect?.height || 0) / 2;
            }
            if (side === "right") {
                left = triggerRect.right + sideOffset;
            }
            else if (side === "left") {
                left = triggerRect.left - (menuRect?.width || 0) - sideOffset;
            }
            else {
                if (align === "start") {
                    left = triggerRect.left + alignOffset;
                }
                else if (align === "center") {
                    left =
                        triggerRect.left +
                            triggerRect.width / 2 -
                            (menuRect?.width || 0) / 2 +
                            alignOffset;
                }
                else if (align === "end") {
                    left = triggerRect.right - (menuRect?.width || 0) - alignOffset;
                }
            }
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            if (left + (menuRect?.width || 0) > windowWidth) {
                left = windowWidth - (menuRect?.width || 0) - 8;
            }
            if (left < 8) {
                left = 8;
            }
            if (top + (menuRect?.height || 0) > windowHeight) {
                if (side === "bottom" &&
                    triggerRect.top > (menuRect?.height || 0) + sideOffset) {
                    top = triggerRect.top - (menuRect?.height || 0) - sideOffset;
                }
                else {
                    const maxHeight = windowHeight - top - 8;
                    if (menuRef.current) {
                        menuRef.current.style.maxHeight = `${maxHeight}px`;
                    }
                }
            }
            setPosition({ top, left });
        };
        updatePosition();
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);
        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [
        open,
        align,
        alignOffset,
        side,
        sideOffset,
        triggerRef,
        children,
        variant,
        className,
    ]);
    const { onMouseLeave, onMouseEnter, ...otherProps } = props;
    return (_jsx(AnimatePresence, { children: open && (_jsx(motion.div, { ref: (node) => {
                if (typeof ref === "function") {
                    ref(node);
                }
                else if (ref) {
                    ref.current =
                        node;
                }
                menuRef.current = node;
            }, className: cn(dropdownMenuContentVariants({ variant }), "dropdown-scrollbar", "scrollbar-hide", className), style: {
                position: "fixed",
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 50,
                maxHeight: "calc(90vh - 60px)",
                overflowY: "auto",
            }, onMouseLeave: handleMouseLeave, onMouseEnter: handleMouseEnterContent, initial: { y: 70, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 100, opacity: 0 }, transition: { duration: 0.3, ease: "easeInOut" }, ...otherProps, children: children })) }));
});
DropdownMenuContent.displayName = "DropdownMenuContent";
const DropdownMenuLabel = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("px-2 py-1.5 text-sm font-semibold", className), ...props })));
DropdownMenuLabel.displayName = "DropdownMenuLabel";
const DropdownMenuItem = React.forwardRef(({ className, inset, disabled = false, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) {
        throw new Error("DropdownMenuItem must be used within a DropdownMenu");
    }
    const { setOpen } = context;
    const handleClick = (e) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        setOpen(false);
        if (props.onClick) {
            props.onClick(e);
        }
    };
    const { onClick, ...otherProps } = props;
    return (_jsx("div", { ref: ref, className: cn(`relative flex cursor-default select-none items-center 
        rounded-sm px-2 py-1.5 text-sm outline-none 
        focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground 
        data-[disabled]:pointer-events-none data-[disabled]:opacity-50`, inset && "pl-8", className), onClick: handleClick, "data-disabled": disabled ? "" : undefined, ...otherProps }));
});
DropdownMenuItem.displayName = "DropdownMenuItem";
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("-mx-1 my-1 h-px bg-muted", className), ...props })));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
const DropdownMenuGroup = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("space-y-1", className), ...props })));
DropdownMenuGroup.displayName = "DropdownMenuGroup";
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuGroup, };
