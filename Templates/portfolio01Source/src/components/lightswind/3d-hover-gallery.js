import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
const cn = (...classes) => classes.filter(Boolean).join(" ");
const ThreeDHoverGallery = ({
  images = [
    "https://images.pexels.com/photos/26797335/pexels-photo-26797335/free-photo-of-scenic-view-of-mountains.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/12194487/pexels-photo-12194487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/32423809/pexels-photo-32423809/free-photo-of-aerial-view-of-kayaking-at-robberg-south-africa.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/32296519/pexels-photo-32296519/free-photo-of-rocky-coastline-of-cape-point-with-turquoise-waters.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/32396739/pexels-photo-32396739/free-photo-of-serene-motorcycle-ride-through-bamboo-grove.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/32304900/pexels-photo-32304900/free-photo-of-scenic-view-of-cape-town-s-twelve-apostles.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/32437034/pexels-photo-32437034/free-photo-of-fisherman-holding-freshly-caught-red-drum-fish.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/32469847/pexels-photo-32469847/free-photo-of-deer-drinking-from-natural-water-source-in-wilderness.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  ],
  itemWidth = 12, // Increased default for more width
  itemHeight = 20, // Increased default for more height
  gap = 1.2, // Increased default for more spacing between items
  perspective = 50, // Increased default for a stronger 3D effect
  hoverScale = 15, // Increased default for more pronounced hover scale
  transitionDuration = 1.25,
  backgroundColor,
  grayscaleStrength = 1,
  brightnessLevel = 0.5,
  activeWidth = 45, // Increased default for wider active item
  rotationAngle = 35,
  zDepth = 10, // Increased default for deeper Z-axis effect
  enableKeyboardNavigation = true,
  autoPlay = false,
  autoPlayDelay = 3000,
  className,
  style,
  onImageClick,
  onImageHover,
  onImageFocus,
}) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const autoPlayRef = useRef(null);
  // Effect for auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 0) {
      // Clear any existing interval to prevent multiple intervals running
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          // Calculate the next index, looping back to the start if at the end
          const nextIndex = prev === null ? 0 : (prev + 1) % images.length;
          return nextIndex;
        });
      }, autoPlayDelay);
      // Cleanup function to clear the interval when the component unmounts or dependencies change
      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
    // If autoPlay is false or no images, ensure interval is cleared
    if (!autoPlay && autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, [autoPlay, autoPlayDelay, images.length]); // Dependencies for the effect
  // Handler for image click event
  const handleImageClick = (index, image) => {
    // Toggle active state: if clicked item is already active, deactivate it
    setActiveIndex(activeIndex === index ? null : index);
    onImageClick?.(index, image); // Call optional onImageClick prop
  };
  // Handler for image hover (mouse enter) event
  const handleImageHover = (index, image) => {
    // Only set active index on hover if autoPlay is not enabled
    if (!autoPlay) {
      setActiveIndex(index);
    }
    onImageHover?.(index, image); // Call optional onImageHover prop
  };
  // Handler for image leave (mouse leave) event
  const handleImageLeave = () => {
    // Only clear active index on leave if autoPlay is not enabled
    if (!autoPlay) {
      setActiveIndex(null);
    }
  };
  // Handler for image focus event (e.g., via keyboard navigation)
  const handleImageFocus = (index, image) => {
    setFocusedIndex(index); // Set the focused index
    onImageFocus?.(index, image); // Call optional onImageFocus prop
  };
  // Handler for keyboard navigation
  const handleKeyDown = (event, index) => {
    if (!enableKeyboardNavigation) return; // Exit if keyboard navigation is disabled
    switch (event.key) {
      case "Enter":
      case " ": // Space key
        event.preventDefault(); // Prevent default scroll behavior for space key
        handleImageClick(index, images[index]); // Simulate click
        break;
      case "ArrowLeft":
        event.preventDefault(); // Prevent default scroll behavior
        // Calculate previous index, looping to the end if at the beginning
        const prevIndex = index > 0 ? index - 1 : images.length - 1;
        // Focus the previous element if it exists
        containerRef.current?.children[prevIndex]?.focus();
        break;
      case "ArrowRight":
        event.preventDefault(); // Prevent default scroll behavior
        // Calculate next index, looping to the start if at the end
        const nextIndex = index < images.length - 1 ? index + 1 : 0;
        // Focus the next element if it exists
        containerRef.current?.children[nextIndex]?.focus();
        break;
    }
  };
  // Function to determine the style for each gallery item
  const getItemStyle = (index) => {
    const isActive = activeIndex === index;
    const isFocused = focusedIndex === index;
    // A small base width to ensure items are always visible, especially on very small screens
    const baseWidthPx = 10;
    return {
      // Width calculation: active item gets activeWidth, others get itemWidth + a base pixel width
      width: isActive
        ? `${activeWidth}vw`
        : `calc(${itemWidth}vw + ${baseWidthPx}px)`,
      // Height calculation: uses a combination of viewport width and height units for responsiveness
      height: `calc(${itemHeight}vw + ${itemHeight}vh)`,
      backgroundImage: `url(${images[index]})`, // Set background image
      backgroundSize: "cover", // Cover the entire area
      backgroundPosition: "center", // Center the image
      backgroundColor, // Fallback background color
      cursor: "pointer", // Indicate interactivity
      // Apply grayscale and brightness filters if not active or focused
      filter:
        isActive || isFocused
          ? "inherit"
          : `grayscale(${grayscaleStrength}) brightness(${brightnessLevel})`,
      // Apply 3D transform for active item, and transitions for smooth animation
      transform: isActive
        ? `translateZ(calc(${hoverScale}vw + ${hoverScale}vh))`
        : "none",
      transition: `transform ${transitionDuration}s cubic-bezier(.1, .7, 0, 1), filter 3s cubic-bezier(.1, .7, 0, 1), width ${transitionDuration}s cubic-bezier(.1, .7, 0, 1)`,
      willChange: "transform, filter, width", // Optimize for animation performance
      zIndex: isActive ? 100 : "auto", // Bring active item to front
      margin: isActive ? "0 0.45vw" : "0", // Add slight margin for active item
      outline: isFocused ? "2px solid #3b82f6" : "none", // Outline for focused item
      outlineOffset: "2px", // Offset for the outline
      borderRadius: "0.5rem", // Apply rounded corners to items
    };
  };
  return _jsx("div", {
    className: cn(
      "flex items-center justify-center min-h-screen w-full overflow-hidden bg-background",
      className
    ),
    style: backgroundColor ? { backgroundColor, ...style } : style,
    children: _jsx("div", {
      ref: containerRef,
      // Inner flex container for the images, centered and taking full width.
      // Applies the 3D perspective and gap between items.
      className: "flex justify-center items-center w-full",
      style: {
        perspective: `calc(${perspective}vw + ${perspective}vh)`,
        gap: `${gap}rem`,
      },
      children: images.map((image, index) =>
        _jsx(
          "div",
          {
            // Individual image item, applies styling, interactivity, and accessibility attributes.
            className: "relative will-change-transform rounded-lg shadow-lg", // Added Tailwind classes for rounded corners and shadow
            style: getItemStyle(index),
            tabIndex: enableKeyboardNavigation ? 0 : -1,
            onClick: () => handleImageClick(index, image),
            onMouseEnter: () => handleImageHover(index, image),
            onMouseLeave: handleImageLeave,
            onFocus: () => handleImageFocus(index, image),
            onBlur: () => setFocusedIndex(null),
            onKeyDown: (e) => handleKeyDown(e, index),
            role: "button", // Indicate that this div acts as a button
            "aria-label": `Image ${index + 1} of ${images.length}`,
            "aria-pressed": activeIndex === index,
          },
          index
        )
      ),
    }),
  });
};
export default ThreeDHoverGallery;
