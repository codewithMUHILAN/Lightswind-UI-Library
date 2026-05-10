
import * as React from "react";
import { cn } from "../lib/utils";

interface ToggleGroupContextValue {
  type: "single" | "multiple";
  value: string | string[];
  onChange: (value: string) => void;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
  disabled?: boolean;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | undefined>(undefined);

function useToggleGroupContext() {
  const context = React.useContext(ToggleGroupContext);
  if (!context) {
    throw new Error("useToggleGroupContext must be used within a ToggleGroup");
  }
  return context;
}

interface ToggleGroupProps {
  type: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof ToggleGroupProps>>(
  ({ 
    className, 
    type, 
    value, 
    defaultValue, 
    onValueChange, 
    variant = "default", 
    size = "default", 
    disabled = false,
    children, 
    ...props 
  }, ref) => {
    // Ensure value is always of the right type (string for single, string[] for multiple)
    const ensureCorrectValueType = (val: string | string[] | undefined): string | string[] => {
      if (val === undefined) return type === "single" ? "" : [];
      if (type === "single") {
        return Array.isArray(val) ? val[0] || "" : val;
      } else {
        return Array.isArray(val) ? val : val ? [val] : [];
      }
    };
    
    const [stateValue, setStateValue] = React.useState<string | string[]>(
      ensureCorrectValueType(defaultValue)
    );
    
    // Determine if the component is controlled or uncontrolled
    const isControlled = value !== undefined;
    const currentValue = isControlled ? ensureCorrectValueType(value) : stateValue;
    
    const handleValueChange = React.useCallback((itemValue: string) => {
      if (disabled) return;
      
      const newValue = (() => {
        if (type === "single") {
          return itemValue;
        }
        
        // For multiple selection
        // Ensure currentValue is always treated as an array for "multiple" type
        const values = Array.isArray(currentValue) ? currentValue : [currentValue].filter(Boolean);
        return values.includes(itemValue)
          ? values.filter((v) => v !== itemValue)
          : [...values, itemValue];
      })();
      
      if (!isControlled) {
        setStateValue(newValue);
      }
      
      onValueChange?.(newValue);
    }, [type, currentValue, disabled, isControlled, onValueChange]);
    
    return (
      <ToggleGroupContext.Provider
        value={{
          type,
          value: currentValue,
          onChange: handleValueChange,
          size,
          variant,
          disabled,
        }}
      >
        <div
          ref={ref}
          className={cn("flex items-center justify-center gap-1", className)}
          role={type === "single" ? "radiogroup" : "group"}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  defaultPressed?: boolean;
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, children, value, variant, size, disabled: itemDisabled, defaultPressed, ...props }, ref) => {
    const { type, value: groupValue, onChange, size: groupSize, variant: groupVariant, disabled: groupDisabled } = useToggleGroupContext();
    
    const isActive = type === "single" 
      ? groupValue === value 
      : Array.isArray(groupValue) 
        ? groupValue.includes(value) 
        : groupValue === value;
    
    const isDisabled = groupDisabled || itemDisabled;
    
    React.useEffect(() => {
      // Handle defaultPressed if provided and the toggle is not already active
      if (defaultPressed && !isActive && !isDisabled) {
        onChange(value);
      }
    }, []);
    
    const handleClick = () => {
      onChange(value);
    };
    
    return (
      <button
        ref={ref}
        type="button"
        role={type === "single" ? "radio" : "checkbox"}
        aria-checked={isActive}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        data-state={isActive ? "on" : "off"}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
          variant === "default" ? "bg-transparent" : "border   bg-transparent hover:bg-accent hover:text-accent-foreground",
          size === "default" ? "h-10 px-3" : size === "sm" ? "h-9 px-2.5" : "h-11 px-5",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
