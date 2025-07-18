import * as React from "react";
import { cn } from "../lib/utils";
import { X } from "lucide-react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"; // Import motion, AnimatePresence, and HTMLMotionProps

interface DialogContextType {
 open: boolean;
 setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

interface DialogProps {
 children: React.ReactNode;
 defaultOpen?: boolean;
 open?: boolean;
 onOpenChange?: (open: boolean) => void;
}

const Dialog: React.FC<DialogProps> = ({
 children,
 defaultOpen = false,
 open: controlledOpen,
 onOpenChange,
}) => {
 const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

 const isControlled = controlledOpen !== undefined;
 const open = isControlled ? controlledOpen : uncontrolledOpen;

 const setOpen = React.useCallback((value: boolean | ((prev: boolean) => boolean)) => {
  if (!isControlled) {
  setUncontrolledOpen(value);
  }
  if (onOpenChange) {
  const newValue = typeof value === "function" ? value(open) : value;
  onOpenChange(newValue);
  }
 }, [isControlled, onOpenChange, open]);

 return (
  <DialogContext.Provider value={{ open, setOpen }}>
  {children}
  </DialogContext.Provider>
 );
};

interface DialogTriggerProps {
 children: React.ReactNode;
 asChild?: boolean;
}

const DialogTrigger = React.forwardRef<HTMLDivElement, DialogTriggerProps & React.HTMLAttributes<HTMLDivElement>>(
 ({ children, asChild = false, ...props }, ref) => {
  const context = React.useContext(DialogContext);
  if (!context) {
  throw new Error("DialogTrigger must be used within a Dialog");
  }

  const { setOpen } = context;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  e.preventDefault();
  setOpen(true);

  // Call the original onClick if it exists
  if (props.onClick) {
  props.onClick(e);
  }
  };

  // Remove onClick from props to avoid duplicate handlers
  const { onClick, ...otherProps } = props;

  if (asChild) {
  return (
  <div
   ref={ref}
   onClick={handleClick}
   {...otherProps}
  >
   {React.Children.map(children, child => {
   if (React.isValidElement(child)) {
 return React.cloneElement(child, {
    ...child.props
 });
   }
   return child;
   })}
  </div>
  );
  }

  return (
  <div
  ref={ref}
  onClick={handleClick}
  {...otherProps}
  >
  {children}
  </div>
  );
 }
);
DialogTrigger.displayName = "DialogTrigger";


// Define a type that omits conflicting HTML attributes for Framer Motion
type OmittedDialogContentHTMLAttributes = Omit<React.HTMLAttributes<HTMLDivElement>, 
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 
  'onTransitionEnd' | 'onDrag' | 'onDragEnd' | 'onDragEnter' | 
  'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 
  'onDrop' | 'onMouseDown' | 'onMouseEnter' | 'onMouseLeave' | 
  'onMouseMove' | 'onMouseOut' | 'onMouseOver' | 'onMouseUp' |
  'onTouchCancel' | 'onTouchEnd' | 'onTouchMove' | 'onTouchStart' |
  'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onPointerCancel' |
  'onPointerEnter' | 'onPointerLeave' | 'onPointerOver' | 'onPointerOut' |
  'onGotPointerCapture' | 'onLostPointerCapture'
>;

const DialogContent = React.forwardRef<HTMLDivElement, OmittedDialogContentHTMLAttributes>( // Use the new type here
 ({ className, children, ...props }, ref) => {
  const context = React.useContext(DialogContext);
  if (!context) {
  throw new Error("DialogContent must be used within a Dialog");
  }

  const { open, setOpen } = context;

  return (
  <AnimatePresence>
  {open && ( // Conditionally render the motion components based on `open` state
   <div className="fixed inset-0 z-50 flex items-center justify-center">
   {/* Backdrop Overlay */}
   <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="absolute inset-0 bg-background/80 backdrop-blur-sm"
 onClick={() => setOpen(false)} // Close dialog when clicking overlay
   />

   {/* Dialog Content */}
   <motion.div
 ref={ref}
 initial={{ opacity: 0, scale: 0.95 }} // Start slightly scaled down and invisible
 animate={{ opacity: 1, scale: 1 }} // Scale up to full size and visible
 exit={{ opacity: 0, scale: 0.95 }}  // Scale down and invisible on exit
 transition={{ duration: 0.2, ease: "easeOut" }} // Smooth transition for content
 className={cn(
    "relative z-50 w-full max-w-lg rounded-lg border border-gray-200 dark:border-gray-800 bg-background p-6 shadow-lg",
    className
 )}
 role="dialog"
 aria-modal="true"
              // Cast props to HTMLMotionProps<'div'> to satisfy TypeScript
 {...props as HTMLMotionProps<'div'>}
 >
 {children}
 <button
    onClick={() => setOpen(false)}
    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
    aria-label="Close dialog"
 >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
 </button>
   </motion.div>
   </div>
  )}
 </AnimatePresence>
);
 }
);
DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
({ className, ...props }, ref) => (
 <div
ref={ref}
 className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
 {...props}
 />
 )
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
 ({ className, ...props }, ref) => (
  <h2
   ref={ref}
   className={cn(
   "text-lg font-semibold leading-none tracking-tight",
    className
   )}
   {...props}
  />
 )
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
 ({ className, ...props }, ref) => (
  <p
   ref={ref}
   className={cn("text-sm text-muted-foreground", className)}
   {...props}
  />
 )
);
DialogDescription.displayName = "DialogDescription";

const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
 ({ className, ...props }, ref) => (
  <div
  ref={ref}
   className={cn(
   "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
 className
   )}
 {...props}
  />
 )
);
DialogFooter.displayName = "DialogFooter";

export {
 Dialog,
 DialogTrigger,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
DialogFooter
};