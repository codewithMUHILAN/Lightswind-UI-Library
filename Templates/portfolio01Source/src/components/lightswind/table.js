import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../lib/utils";
const Table = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { className: "relative w-full max-h-[400px] overflow-auto scrollbar-hide rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black shadow-sm", children: _jsx("table", { ref: ref, className: cn(`w-full text-sm text-left border-collapse`, className), ...props }) })));
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (_jsx("thead", { ref: ref, className: cn(`sticky top-0 z-10 bg-white dark:bg-black`, // Explicit dark:bg-black for header
    className), ...props })));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => (_jsx("tbody", { ref: ref, className: cn(`divide-y divide-gray-100 dark:divide-zinc-900`, className), ...props })));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => (_jsx("tfoot", { ref: ref, className: cn(`border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 font-medium`, // Very dark gray for footer
    className), ...props })));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(({ className, ...props }, ref) => (_jsx("tr", { ref: ref, className: cn(`transition-colors hover:bg-gray-50/50 dark:hover:bg-zinc-900 
       data-[state=selected]:bg-gray-100 dark:data-[state=selected]:bg-zinc-800`, // Solid hover/selected background
    className), ...props })));
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => (_jsx("th", { ref: ref, className: cn(`h-12 px-6 text-left align-middle font-semibold 
      text-background bg-foreground
       [&:first-child]:rounded-tl-lg [&:last-child]:rounded-tr-lg`, // White text on dark header
    className), ...props })));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => (_jsx("td", { ref: ref, className: cn(`p-4 align-middle text-gray-800 dark:text-gray-100`, // Slightly off-white for cell text
    className), ...props })));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => (_jsx("caption", { ref: ref, className: cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className), ...props })));
TableCaption.displayName = "TableCaption";
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, };
