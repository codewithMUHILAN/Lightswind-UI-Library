import React, { useState, useEffect, useRef } from "react";
import { cn } from "../lib/utils";
import { Input, InputProps  } from "./input";
import { Label } from "./label";
import { Eye, EyeOff, Check, X } from "lucide-react";

export type StrengthLevel = "empty" | "weak" | "medium" | "strong" | "very-strong";

export interface PasswordStrengthIndicatorProps {
  /**
   * The value of the password input
   */
  value: string;
  
  /**
   * Class name for the container
   */
  className?: string;
  
  /**
   * Label text for the password field
   */
  label?: string;
  
  /**
   * Show strength score as text
   */
  showScore?: boolean;
  
  /**
   * Show strength score as number
   */
  showScoreNumber?: boolean;
  
  /**
   * Function called when password changes
   */
  onChange?: (value: string) => void;
  
  /**
   * Function called when strength level changes
   */
  onStrengthChange?: (strength: StrengthLevel) => void;
  
  /**
   * Placeholder text for input
   */
  placeholder?: string;
  
  /**
   * Show toggle for password visibility
   */
  showVisibilityToggle?: boolean;
  
  /**
   * Additional props for the input element
   */
  inputProps?: InputProps; // <--- Use the imported InputProps here
}

// Password strength calculation based on common rules
const calculateStrength = (password: string): { score: number; level: StrengthLevel } => {
  if (!password) return { score: 0, level: "empty" };
  
  let score = 0;
  
  // Length check
  if (password.length > 5) score += 1;
  if (password.length > 8) score += 1;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Determine level based on score
  let level: StrengthLevel = "empty";
  if (score === 0) level = "empty";
  else if (score <= 2) level = "weak";
  else if (score <= 4) level = "medium";
  else if (score <= 5) level = "strong";
  else level = "very-strong";
  
  return { score, level };
};

// Colors for different strength levels
const strengthColors = {
  empty: "bg-gray-200",
  weak: "bg-red-500",
  medium: "bg-orange-500",
  strong: "bg-green-500",
  "very-strong": "bg-emerald-500",
};

// Text labels for different strength levels
const strengthLabels = {
  empty: "Empty",
  weak: "Weak",
  medium: "Medium",
  strong: "Strong",
  "very-strong": "Very Strong",
};

export function PasswordStrengthIndicator({
  value,
  className,
  label = "Password",
  showScore = true,
  showScoreNumber = false,
  onChange,
  onStrengthChange,
  placeholder = "Enter your password",
  showVisibilityToggle = true,
  inputProps,
}: PasswordStrengthIndicatorProps) {
  const [password, setPassword] = useState(value || "");
  const [showPassword, setShowPassword] = useState(false);
  const { score, level } = calculateStrength(password);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (onStrengthChange) {
      onStrengthChange(level);
    }
  }, [level, onStrengthChange]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPassword(newValue);
    if (onChange) onChange(newValue);
  };
  
  const toggleVisibility = () => {
    setShowPassword(!showPassword);
    // Focus back on input after toggling visibility
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between items-center">
          <Label htmlFor="password">{label}</Label>
          {showScoreNumber && (
            <span className="text-xs text-muted-foreground">
              {Math.floor((score / 6) * 10)}/10
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handleChange}
          placeholder={placeholder}
          className="pr-10"
          {...inputProps}
        />
        
        {showVisibilityToggle && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
        
        {password && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              level === "weak" ? "bg-red-500" : level === "medium" ? "bg-orange-500" : "bg-green-500"
            )}>
              {level === "weak" ? (
                <X className="h-4 w-4 text-white" />
              ) : (
                <Check className="h-4 w-4 text-white" />
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Password strength bar */}
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-full flex-1 rounded-full transition-all duration-300",
              i < Math.min(Math.ceil(score / 1.5), 4) ? strengthColors[level] : "bg-gray-200"
            )}
          />
        ))}
      </div>
      
      {/* Strength label */}
      {showScore && level !== "empty" && (
        <p className={cn(
          "text-xs transition-colors",
          level === "weak" ? "text-red-500" :
          level === "medium" ? "text-orange-500" :
          level === "strong" ? "text-green-500" :
          "text-emerald-500"
        )}>
          {strengthLabels[level]}
        </p>
      )}
    </div>
  );
}
