import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar as CalendarIcon } from "lucide-react";
import { DayPicker, DropdownProps } from "react-day-picker"; // Import StyledElement
import { addYears, format, subYears } from "date-fns";

import { cn } from "../lib/utils";
import { buttonVariants } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /** Add a shadow effect to the calendar */
  shadow?: boolean;
  /** Show quick month navigation */
  quickNav?: boolean;
  /** Add a year selector dropdown */
  yearSelector?: boolean;
  /** Enables smooth transitions between months */
  animateMonths?: boolean;
  /** Sets the transition duration for month changes in ms */
  transitionDuration?: number;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  shadow = false,
  quickNav = false,
  yearSelector = false,
  animateMonths = true,
  transitionDuration = 300,
  ...props
}: CalendarProps) {
  const [selectedYear, setSelectedYear] = React.useState<number | undefined>(
    props.defaultMonth?.getFullYear() || props.month?.getFullYear() || new Date().getFullYear()
  );
  
  const [isYearOpen, setIsYearOpen] = React.useState(false);
  const [isMonthOpen, setIsMonthOpen] = React.useState(false);

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = props.month || props.defaultMonth || new Date();
  const currentMonthIndex = currentMonth.getMonth();
  const currentYear = currentMonth.getFullYear();

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year, 10);
    setSelectedYear(newYear);
    
    const newDate = new Date(currentMonth);
    newDate.setFullYear(newYear);
    
    if (props.onMonthChange) {
      props.onMonthChange(newDate);
    }
    
    setIsYearOpen(false);
  };

  const handleMonthChange = (monthIndex: string) => {
    const index = parseInt(monthIndex, 10);
    
    const newDate = new Date(currentMonth);
    newDate.setMonth(index);
    
    if (props.onMonthChange) {
      props.onMonthChange(newDate);
    }
    
    setIsMonthOpen(false);
  };

  // Create a compliant dropdown component that matches the DropdownProps expected by DayPicker
  const CustomDropdown = (props: DropdownProps) => {
    // Fix: Ensure monthIndex is a number by converting it
    const monthIndex = typeof props.value === 'number' ? props.value : 0;
    
    return (
      <Popover open={isMonthOpen} onOpenChange={setIsMonthOpen}>
        <PopoverTrigger asChild>
          <button 
            className="flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-md hover:bg-accent"
            aria-label="Select month"
          >
            <span className="font-medium">{months[monthIndex]}</span>
            <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="center">
          <div className="grid grid-cols-2 gap-1 p-2">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => {
                  // Create a synthetic event that conforms to what the DropdownProps expects
                  const fakeEvent = {
                    target: { value: index },
                    currentTarget: { value: index },
                    preventDefault: () => {},
                    stopPropagation: () => {}
                  } as unknown as React.ChangeEvent<HTMLSelectElement>;
                  
                  if (props.onChange) {
                    props.onChange(fakeEvent);
                  }
                  setIsMonthOpen(false);
                }}
                className={cn(
                  "text-sm px-3 py-1.5 rounded-md text-left",
                  monthIndex === index ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                {month}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const CustomCaption = () => (
    <div className="flex justify-center items-center mb-2 mt-1 relative">
      <div className="absolute left-0 flex justify-start space-x-1">
        <button
          onClick={() => {
            const newDate = subYears(currentMonth, 1);
            if (props.onMonthChange) {
              props.onMonthChange(newDate);
            }
          }}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-7 w-7")}
          aria-label="Previous year"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            const newDate = new Date(currentMonth);
            newDate.setMonth(currentMonth.getMonth() - 1);
            if (props.onMonthChange) {
              props.onMonthChange(newDate);
            }
          }}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-7 w-7")}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 cursor-pointer">
        <Popover open={isMonthOpen} onOpenChange={setIsMonthOpen}>
          <PopoverTrigger asChild>
            <button className="text-sm font-medium hover:bg-accent px-2 py-1 rounded-md transition-colors">
              {months[currentMonthIndex]}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="center">
            <div className="grid grid-cols-3 gap-1 p-2">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(index);
                    if (props.onMonthChange) {
                      props.onMonthChange(newDate);
                    }
                    setIsMonthOpen(false);
                  }}
                  className={cn(
                    "text-sm px-3 py-1.5 rounded-md text-center",
                    currentMonthIndex === index ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  )}
                >
                  {month}
                </button>
              ))}
          </div>
        </PopoverContent>
        </Popover>

        <Popover open={isYearOpen} onOpenChange={setIsYearOpen}>
          <PopoverTrigger asChild>
            <button className="text-sm font-medium hover:bg-accent px-2 py-1 rounded-md transition-colors">
              {currentYear}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="center">
            <div className="grid grid-cols-3 gap-1 p-2 max-h-[220px] overflow-y-auto">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year.toString())}
                  className={cn(
                    "text-sm px-3 py-1.5 rounded-md text-center",
                    currentYear === year ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="absolute right-0 flex justify-end space-x-1">
        <button
          onClick={() => {
            const newDate = new Date(currentMonth);
            newDate.setMonth(currentMonth.getMonth() + 1);
            if (props.onMonthChange) {
              props.onMonthChange(newDate);
            }
          }}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-7 w-7")}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            const newDate = addYears(currentMonth, 1);
            if (props.onMonthChange) {
              props.onMonthChange(newDate);
            }
          }}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-7 w-7")}
          aria-label="Next year"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3", 
        animateMonths && "rdp-transitions",
        shadow && "shadow-lg rounded-lg border border-gray-200 dark:border-gray-800", 
        className
      )}
      classNames={{
        months: cn(
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          animateMonths && "transition-all duration-300 ease-in-out"
        ),
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center gap-1",
        caption_label: yearSelector ? "text-sm font-medium hidden" : "text-sm font-medium",
        caption_dropdowns: "flex justify-center gap-1 grow dropdowns",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 transition-opacity"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border border-gray-200 dark:border-gray-800 space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          animateMonths && "transition-all duration-200 ease-in-out"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 transition-all duration-200 ease-in-out"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground transition-all duration-200 ease-in-out",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
//       components={{
//         // Correctly type IconLeft and IconRight as StyledElement (or React.ElementType)
//         IconLeft: (props) => <ChevronLeft className="h-4 w-4" {...props} />,
//         IconRight: (props) => <ChevronRight className="h-4 w-4" {...props} />,
//         Dropdown: quickNav ? CustomDropdown : undefined,
//         Caption: yearSelector ? CustomCaption : undefined,
//       }}
      {...props}
      style={
        animateMonths
          ? { "--rdp-transitions-duration": `${transitionDuration}ms` } as React.CSSProperties
          : undefined
      }
    />
  ); 
}
Calendar.displayName = "Calendar";

export { Calendar };