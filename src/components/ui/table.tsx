import * as React from "react";
import { cn } from "@/components/lib/utils";

const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement> & { noScroll?: boolean }
>(({ className, noScroll, ...props }, ref) => {
  const table = (
    <table
      ref={ref}
      className={cn(
        `w-full text-sm text-left border-collapse`,
        className
      )}
      {...props}
    />
  );

  if (noScroll) return table;

  return (
    <div className="relative w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black shadow-sm overflow-hidden">
      <div className="w-full overflow-auto max-h-[calc(80vh-70px)] custom-scrollbar" data-lenis-prevent>
        {table}
      </div>
    </div>
  );
});
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      `sticky top-0 z-10 bg-white dark:bg-black`, // Explicit dark:bg-black for header
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
    className={cn(`divide-y divide-gray-100 dark:divide-zinc-900`, className)} // Darker divider
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
      `border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 font-medium`, // Very dark gray for footer
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
      `transition-colors hover:bg-gray-50/50 dark:hover:bg-zinc-900 
       data-[state=selected]:bg-gray-100 dark:data-[state=selected]:bg-zinc-800`, // Solid hover/selected background
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
      `h-12 px-6 text-left align-middle font-semibold transition-all duration-200
      [&:first-child]:rounded-tl-lg [&:last-child]:rounded-tr-lg
      
      /* Flat style (no .lw-3d) */
      bg-foreground text-background
      
      /* 3D Shade Style (when .lw-3d is present on root/parent) */
      [.lw-3d_&]:bg-zinc-900 [.lw-3d_&]:bg-gradient-to-b [.lw-3d_&]:from-zinc-800 [.lw-3d_&]:to-zinc-950
      [.lw-3d_&]:text-white [.lw-3d_&]:border-t [.lw-3d_&]:border-t-white/10 [.lw-3d_&]:border-b [.lw-3d_&]:border-b-zinc-900/50
      [.lw-3d_&]:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_1px_2px_0_rgba(0,0,0,0.05)]
      
      /* 3D Shade Dark Styles */
      dark:[.lw-3d_&]:bg-zinc-100
      dark:[.lw-3d_&]:from-white dark:[.lw-3d_&]:to-zinc-200 dark:[.lw-3d_&]:text-zinc-950
      dark:[.lw-3d_&]:border-t-white/80 dark:[.lw-3d_&]:border-b-zinc-300
      dark:[.lw-3d_&]:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.9),0_1px_2px_0_rgba(0,0,0,0.15)]`,
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
      `p-4 align-middle text-gray-800 dark:text-gray-100`, // Slightly off-white for cell text
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