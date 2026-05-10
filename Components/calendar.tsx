"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "../lib/utils"
import { buttonVariants } from "./button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [direction, setDirection] = React.useState(0)
  const [month, setMonth] = React.useState<Date>(props.month || props.defaultMonth || new Date())

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      month={month}
      onMonthChange={(newMonth) => {
        setDirection(newMonth > month ? 1 : -1)
        setMonth(newMonth)
        props.onMonthChange?.(newMonth)
      }}
      className={cn(
        "p-4 bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl",
        className
      )}
      classNames={{
        months: "relative",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center h-10",
        caption_label: "text-sm font-bold tracking-tight text-foreground/90",
        nav: "flex items-center space-x-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-background/50 p-0 opacity-70 hover:opacity-100 hover:bg-accent border-gray-200 dark:border-gray-800 rounded-full absolute left-1 top-1 z-20 transition-all active:scale-90"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-background/50 p-0 opacity-70 hover:opacity-100 hover:bg-accent border-gray-200 dark:border-gray-800 rounded-full absolute right-1 top-1 z-20 transition-all active:scale-90"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex justify-between",
        weekday: "text-muted-foreground/60 w-9 font-bold text-[0.65rem] uppercase tracking-[0.1em] text-center",
        week: "flex w-full mt-1 justify-between",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-medium transition-all duration-300 hover:bg-primary/10 dark:hover:bg-primary/20",
          "aria-selected:opacity-100 rounded-full relative overflow-visible"
        ),
        selected: "text-primary-foreground",
        today: "text-primary font-bold after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full",
        outside: "day-outside text-muted-foreground/30 opacity-40",
        disabled: "text-muted-foreground opacity-20 cursor-not-allowed",
        range_start: "day-range-start rounded-l-full",
        range_end: "day-range-end rounded-r-full",
        range_middle: "aria-selected:bg-primary/20 aria-selected:text-primary dark:aria-selected:bg-primary/20 dark:aria-selected:text-primary rounded-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight
          return (
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              className="flex items-center justify-center"
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          )
        },
        Month: ({ children, ...props }) => (
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={month.toISOString()}
              custom={direction}
              initial={{ opacity: 0, x: direction * 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -direction * 20, filter: "blur(4px)" }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 1
              }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        ),
        DayButton: ({ day, modifiers, ...buttonProps }) => {
          const isSelected = modifiers.selected;
          const isRangeStart = modifiers.range_start;
          const isRangeEnd = modifiers.range_end;
          const isRangeMiddle = modifiers.range_middle;
          const isRange = isRangeStart || isRangeEnd || isRangeMiddle;
          // Avoid jumping layout animations when a range is spanning
          const useLayoutAnim = isSelected && !isRange;

          // Filter out props that conflict with Framer Motion's motion.button
          const { onDrag, onDragStart, onDragEnd, onDragOver, onDragEnter, onDragLeave, onDragExit, className, ...validProps } = buttonProps as any;

          return (
            <div className="relative w-full h-full flex items-center justify-center">
              {useLayoutAnim && (
                <motion.div
                  layoutId="calendar-selection-pro"
                  className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/20"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                  }}
                  style={{ zIndex: 0 }}
                />
              )}
              {/* Fallback solid background for the edges of a range */}
              {isRange && (isRangeStart || isRangeEnd) && (
                <div className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/20 z-0" />
              )}
              <motion.button
                {...validProps}
                className={cn(
                  className, // Incorporate dynamically generated classes from RDP
                  "z-10 relative overflow-visible flex items-center justify-center",
                  // Ensure start/end of a range or single selection shows white text
                  (useLayoutAnim || isRangeStart || isRangeEnd) && "text-primary-foreground focus:text-primary-foreground hover:text-primary-foreground focus:bg-transparent",
                  // Ensure middle selections use theme colored text instead of turning white
                  isRangeMiddle && "text-primary dark:text-primary font-medium"
                )}
                whileHover={!isRange ? { scale: 1.1 } : undefined}
                whileTap={!isRange ? { scale: 0.9 } : undefined}
              >
                {day.date.getDate()}
              </motion.button>
            </div>
          )
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
