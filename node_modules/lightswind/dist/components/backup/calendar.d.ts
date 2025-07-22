import * as React from "react";
import { DayPicker } from "react-day-picker";
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
declare function Calendar({ className, classNames, showOutsideDays, shadow, quickNav, yearSelector, animateMonths, transitionDuration, ...props }: CalendarProps): import("react/jsx-runtime").JSX.Element;
declare namespace Calendar {
    var displayName: string;
}
export { Calendar };
