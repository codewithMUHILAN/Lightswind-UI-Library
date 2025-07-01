import * as React from "react";
import { cn } from "../lib/utils";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full max-h-[400px] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800
  ">
    <table
      ref={ref}
      className={cn(
        `w-full text-sm text-left border-separate rounded-lg
        border-spacing-x-0 border border-gray-300 dark:border-gray-700`,
        className
      )}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      // "bg-black text-white dark:text-black dark:bg-white ",
      "[&_tr]:border-b rounded-lg",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0 rounded-lg", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      `border-t bg-muted/50 font-medium [&>tr]:last:border-b-0 rounded-lg`,
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      `border-b transition-colors hover:bg-muted/50 
      data-[state=selected]:bg-muted `,
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
     `h-12 px-4 text-left  align-middle font-medium border border-gray-200 
      dark:border-gray-800 bg-primary 
     text-muted [&:has([role=checkbox])]:pr-0`,
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      `px-5 py-3 bg-gray-200/20 dark:bg-gray-900/20 border border-gray-200 
      dark:border-gray-800 
      text-sm text-gray-800 dark:text-gray-100 align-middle scrollbar`,
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
