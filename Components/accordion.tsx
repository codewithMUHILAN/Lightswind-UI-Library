import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "../lib/utils";

// --- Contexts ---

interface AccordionContextType {
  value: string[];
  // onValueChange now accepts the item's value (string), letting Accordion handle the full state change logic
  onValueChange: (value: string) => void;
  type: "single" | "multiple";
  collapsible: boolean;
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

interface AccordionItemContextType {
  value: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextType | undefined>(undefined);

// --- Accordion Component ---

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string[]) => void;
  collapsible?: boolean;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  // **MODIFICATION: Changed default `type` to "single" and included `collapsible`**
  ({ className, type = "single", value, defaultValue = [], onValueChange, collapsible = true, children, ...props }, ref) => {

    // Helper function to ensure value is an array of strings
    const normalizeValue = (val: string | string[] | undefined): string[] => {
      if (Array.isArray(val)) {
        return val;
      }
      return val ? [val] : [];
    };

    // Initial state setup
    const initialValues = normalizeValue(
      value !== undefined ? value : defaultValue
    );

    // In "single" mode, ensure initial state only has one open item
    const [values, setValues] = React.useState<string[]>(
      type === "single" && initialValues.length > 1
        ? [initialValues[0]]
        : initialValues
    );

    // Controlled component logic: sync state with prop `value`
    React.useEffect(() => {
      if (value !== undefined) {
        const newValues = normalizeValue(value);
        setValues(
          type === "single" && newValues.length > 1
            ? [newValues[0]]
            : newValues
        );
      }
    }, [value, type]);

    const handleValueChange = React.useCallback(
      (itemValue: string) => {
        const isCurrentlyOpen = values.includes(itemValue);
        let newValues: string[] = [];

        if (type === "single") {
          if (isCurrentlyOpen) {
            // 1. Item is open. If collapsible is TRUE, close it (empty array).
            // If collapsible is FALSE, it stays open (itemValue).
            newValues = collapsible ? [] : [itemValue];
          } else {
            // 2. Item is closed. Open it (new value), closing any old value.
            newValues = [itemValue];
          }
        } else {
          // "multiple" type logic
          newValues = isCurrentlyOpen
            ? values.filter((v) => v !== itemValue)
            : [...values, itemValue];
        }

        // Update internal state if uncontrolled
        if (value === undefined) {
          setValues(newValues);
        }

        // Call external handler
        onValueChange?.(newValues);
      },
      [values, onValueChange, value, type, collapsible]
    );

    // Passed `type` and `collapsible` to the context
    return (
      <AccordionContext.Provider value={{ value: values, onValueChange: handleValueChange, type, collapsible }}>
        <div ref={ref} className={cn(className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

// --- AccordionItem Component (No Change) ---

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled = false, children, ...props }, ref) => {
    return (
      <AccordionItemContext.Provider value={{ value }}>
        <div
          ref={ref}
          className={cn("border-b border-muted-foreground/20 text-black dark:text-white", className)}
          data-state={disabled ? "disabled" : undefined}
          data-value={value}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

// --- AccordionTrigger Component (Morphing Icon Logic) ---

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error("AccordionTrigger must be used within an Accordion");

    const itemContext = React.useContext(AccordionItemContext);
    if (!itemContext) throw new Error("AccordionTrigger must be used within an AccordionItem");

    const { value: values, onValueChange } = context;
    const { value: itemValue } = itemContext;

    const isOpen = values.includes(itemValue);

    // Simplified handler: calls context function with its item value
    const handleToggle = () => {
      onValueChange(itemValue);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          `flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline`,
          className
        )}
        onClick={handleToggle}
        data-state={isOpen ? "open" : "closed"}
        {...props}
      >
        {children}
        {/* MORPHING ICON IMPLEMENTATION */}
        <div className="relative  h-4 w-4 lg:h-6 lg:w-6 ml-2 shrink-0">
          {/* Plus (Closed State) */}
          <Plus
            className={cn(
              ` h-4 w-4 lg:h-6 lg:w-6 absolute transition-all duration-300 
              ease-in-out `,
              // Rotates + Fades out when open
              isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
            )}
          />
          {/* Minus (Open State) */}
          <Minus
            className={cn(
              " h-4 w-4 lg:h-6 lg:w-6 absolute transition-all duration-300 ease-in-out",
              // Fades in when open, starts rotated when closed
              isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
            )}
          />
        </div>
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

// --- AccordionContent Component (Height Animation Logic) ---

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> { }

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error("AccordionContent must be used within an Accordion");

    const itemContext = React.useContext(AccordionItemContext);
    if (!itemContext) throw new Error("AccordionContent must be used within an AccordionItem");

    const { value: values } = context;
    const { value: itemValue } = itemContext;

    const isOpen = values.includes(itemValue);

    const contentRef = React.useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = React.useState(0);

    // Calculates the height of the content element for smooth opening/closing
    React.useLayoutEffect(() => {
      if (isOpen && contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      } else {
        setContentHeight(0);
      }
    }, [isOpen, children]); // Recalculate if open state changes or children change

    return (
      <div
        ref={ref}
        style={{
          height: isOpen ? `${contentHeight}px` : "0px",
          transition: "height 300ms cubic-bezier(0.4, 0, 0.2, 1)", // Smooth transition
        }}
        className="overflow-hidden"
        data-state={isOpen ? "open" : "closed"}
        {...props}
      >
        <div ref={contentRef} className={cn("pb-4 pt-0 text-sm", className)}>
          {children}
        </div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
