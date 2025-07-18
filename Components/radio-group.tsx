
import * as React from "react";
import { cn } from "../lib/utils";
import { Circle } from "lucide-react";

interface RadioGroupContextType {
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  orientation?: "horizontal" | "vertical";
}

const RadioGroupContext = React.createContext<RadioGroupContextType | undefined>(undefined);

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, defaultValue, onValueChange, name, orientation = "vertical", ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "");

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setSelectedValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [onValueChange, value]
    );

    return (
      <RadioGroupContext.Provider
        value={{ value: selectedValue, onValueChange: handleValueChange, name, orientation }}
      >
        <div 
          ref={ref} 
          className={cn(
            orientation === "horizontal" ? "flex items-center space-x-4" : "grid gap-2", 
            className
          )} 
          role="radiogroup" 
          {...props} 
        />
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
  value: string;
  customSize?: "sm" | "md" | "lg";
}

const RadioGroupItem = React.forwardRef<HTMLDivElement, RadioGroupItemProps>(
  ({ className, value, customSize = "md", ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    if (!context) {
      throw new Error("RadioGroupItem must be used within a RadioGroup");
    }

    const { value: selectedValue, onValueChange, name } = context;
    const checked = selectedValue === value;
    const [focused, setFocused] = React.useState(false);
    const radioRef = React.useRef<HTMLInputElement>(null);

    // Size mappings for custom sizes
    const sizeMap = {
      sm: { outer: "h-3.5 w-3.5", inner: "h-1.5 w-1.5", icon: "h-2 w-2" },
      md: { outer: "h-4 w-4", inner: "h-2 w-2", icon: "h-2.5 w-2.5" },
      lg: { outer: "h-5 w-5", inner: "h-2.5 w-2.5", icon: "h-3 w-3" }
    };

    const itemSize = sizeMap[customSize];

    const handleChange = () => {
      onValueChange(value);
    };

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    return (
      <div className="relative flex items-center space-x-2">
        <div ref={ref} className="relative flex items-center">
          <input
            ref={radioRef}
            type="radio"
            value={value}
            checked={checked}
            name={name}
            className="absolute h-0 w-0 opacity-0"
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          <div
            className={cn(
              "relative flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 ring-offset-background transition-all duration-200",
              checked && "border-primary",
              focused && "ring-2 ring-ring ring-offset-2",
              props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              itemSize.outer,
              className
            )}
            onClick={() => radioRef.current?.click()}
          >
            <div 
              className={cn(
                "absolute rounded-full bg-primary scale-0 transition-transform duration-200 ease-in-out",
                checked && "scale-100",
                itemSize.inner
              )}
            />
          </div>
        </div>
        {props.children && (
          <label
            htmlFor={props.id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              props.disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !props.disabled && radioRef.current?.click()}
          >
            {props.children}
          </label>
        )}
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
