import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

interface AccordionContextType {
  value: string[];
  onValueChange: (value: string[]) => void;
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

// Add AccordionItemContext to pass value from AccordionItem to its children
interface AccordionItemContextType {
  value: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextType | undefined>(undefined);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string[]) => void;
  collapsible?: boolean;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = "multiple", value, defaultValue = [], onValueChange, children, ...props }, ref) => {
    // Always ensure values is an array, even if a single string is passed
    const [values, setValues] = React.useState<string[]>(
      Array.isArray(value) ? value : 
      value ? [value] : 
      Array.isArray(defaultValue) ? defaultValue : 
      defaultValue ? [defaultValue] : []
    );
    
    React.useEffect(() => {
      if (value !== undefined) {
        setValues(Array.isArray(value) ? value : value ? [value] : []);
      }
    }, [value]);
    
    const handleValueChange = React.useCallback((newValues: string[]) => {
      if (value === undefined) {
        setValues(newValues);
      }
      onValueChange?.(newValues);
    }, [onValueChange, value]);
    
    return (
      <AccordionContext.Provider value={{ value: values, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn(className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

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
          className={cn("border-b   text-black dark:text-white", className)}
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

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error("AccordionTrigger must be used within an Accordion");
    
    const itemContext = React.useContext(AccordionItemContext);
    if (!itemContext) throw new Error("AccordionTrigger must be used within an AccordionItem");
    
    const { value: values, onValueChange } = context;
    const { value: itemValue } = itemContext;
    
    const isOpen = values.includes(itemValue);
    
    const handleToggle = () => {
      const newValues = isOpen
        ? values.filter(v => v !== itemValue)
        : [...values, itemValue];
      
      onValueChange(newValues);
    };
    
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          `flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline 
          [&[data-state=open]>svg]:rotate-180`,
          className
        )}
        onClick={handleToggle}
        data-state={isOpen ? "open" : "closed"}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error("AccordionContent must be used within an Accordion");
    
    const itemContext = React.useContext(AccordionItemContext);
    if (!itemContext) throw new Error("AccordionContent must be used within an AccordionItem");
    
    const { value: values } = context;
    const { value: itemValue } = itemContext;
    
    const isOpen = values.includes(itemValue);
    
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden text-sm transition-all",
          isOpen ? "animate-accordion-down" : "animate-accordion-up h-0",
          className
        )}
        data-state={isOpen ? "open" : "closed"}
        {...props}
      >
        <div className={cn("pb-4 pt-0")}>
          {children}
        </div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };