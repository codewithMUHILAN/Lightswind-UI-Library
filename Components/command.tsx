import * as React from "react";
import { cn } from "../lib/utils";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  Search,
  Loader2,
  Command as CommandIcon,
  ChevronRight,
} from "lucide-react";

interface CommandContextType {
  value: string;
  onValueChange: (value: string) => void;
  filter: (items: CommandItem[]) => CommandItem[];
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
  emptyMessage?: string;
}

interface CommandItem {
  id: string;
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

const CommandContext = React.createContext<CommandContextType | undefined>(
  undefined
);

function useCommand() {
  const context = React.useContext(CommandContext);
  if (!context) {
    throw new Error("useCommand must be used within a Command component");
  }
  return context;
}

interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  emptyMessage?: string;
}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  (
    {
      className,
      isLoading: controlledLoading,
      emptyMessage = "No results found.",
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState("");
    const [internalLoading, setInternalLoading] = React.useState(false);

    const isLoading =
      controlledLoading !== undefined ? controlledLoading : internalLoading;

    const filter = React.useCallback(
      (items: CommandItem[]) => {
        if (!value) return items;
        return items.filter((item) =>
          typeof item.label === "string"
            ? item.label.toLowerCase().includes(value.toLowerCase())
            : item.value.toLowerCase().includes(value.toLowerCase())
        );
      },
      [value]
    );

    return (
      <CommandContext.Provider
        value={{
          value,
          onValueChange: setValue,
          filter,
          isLoading,
          setIsLoading: setInternalLoading,
          emptyMessage,
        }}
      >
        <div
          ref={ref}
          className={cn(
            `flex h-full w-full flex-col overflow-hidden rounded-md
             bg-popover text-popover-foreground`,
            className
          )}
          {...props}
          cmdk-root=""
        />
      </CommandContext.Provider>
    );
  }
);
Command.displayName = "Command";

interface CommandDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const CommandDialog: React.FC<CommandDialogProps> = ({
  children,
  open,
  onOpenChange,
  className,
}) => {
  // Prevent form submission causing page refresh
  const handleDialogClick = (e: React.MouseEvent) => {
    // Prevent any click events from bubbling up to a form
    e.stopPropagation();
  };

  // Handle ESC key to close dialog
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (onOpenChange) {
          onOpenChange(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);
  // Add body class to enable blur effect on the entire page
  React.useEffect(() => {
    if (open) {
      document.body.classList.add("command-dialog-open");
    } else {
      document.body.classList.remove("command-dialog-open");
    }

    return () => {
      document.body.classList.remove("command-dialog-open");
    };
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"/>
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            `fixed overflow-hidden p-0 shadow-xl border-muted/50 bg-background/90
             backdrop-blur-lg max-w-3xl z-50`,
            "top-[10vh] max-h-[80vh]", // Position from top with max height
            className
          )}
          onClick={handleDialogClick}
        >
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">{children}</Command>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface CommandInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
  isLoading?: boolean;
}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  (
    { className, onValueChange, isLoading: controlledLoading, ...props },
    ref
  ) => {
    const {
      value,
      onValueChange: contextOnValueChange,
      isLoading: contextLoading,
    } = useCommand();
    const isLoading =
      controlledLoading !== undefined ? controlledLoading : contextLoading;

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault(); // Prevent form submission
        const newValue = e.target.value;
        if (onValueChange) {
          onValueChange(newValue);
        } else {
          contextOnValueChange(newValue);
        }
      },
      [onValueChange, contextOnValueChange]
    );

    // Prevent form submission on key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    };

    return (
      <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-3" cmdk-input-wrapper="">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin opacity-70" />
        ) : (
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        )}
        <input
          ref={ref}
          value={props.value !== undefined ? props.value : value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            `flex h-11 w-full rounded-md bg-transparent py-3 text-sm border-none focus:border-none focus:ring-0 focus:outline-none 
   active:border-none active:ring-0 active:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50`,
            className
          )}
          placeholder={props.placeholder || "Type to search..."}
          cmdk-input=""
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          aria-autocomplete="list"
          {...props}
        />
      </div>
    );
  }
);
CommandInput.displayName = "CommandInput";

interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, isLoading: controlledLoading, ...props }, ref) => {
    const { isLoading: contextLoading } = useCommand();
    const isLoading =
      controlledLoading !== undefined ? controlledLoading : contextLoading;

    return (
      <div
        ref={ref}
        className={cn(
          "max-h-[300px] overflow-y-auto overflow-x-hidden",
          className
        )}
        {...props}
      >
        {isLoading && props.children && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading && props.children}
      </div>
    );
  }
);
CommandList.displayName = "CommandList";

interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  (props, ref) => {
    const { emptyMessage } = useCommand();

    return (
      <div
        ref={ref}
        className="py-6 text-center text-sm text-muted-foreground"
        {...props}
      >
        {props.children || emptyMessage || "No results found."}
      </div>
    );
  }
);
CommandEmpty.displayName = "CommandEmpty";

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {heading && <div cmdk-group-heading="">{heading}</div>}
      {props.children}
    </div>
  )
);
CommandGroup.displayName = "CommandGroup";

interface CommandSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("-mx-1 h-px bg-background", className)} {...props} />
));
CommandSeparator.displayName = "CommandSeparator";

interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  onSelect?: () => void;
  value?: string;
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, disabled, onSelect, value, ...props }, ref) => {
    const [isSelected, setIsSelected] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
          isSelected && "bg-accent text-accent-foreground",
          className
        )}
        data-disabled={disabled ? "true" : undefined}
        data-selected={isSelected ? "true" : undefined}
        data-value={value}
        onMouseEnter={() => setIsSelected(true)}
        onMouseLeave={() => setIsSelected(false)}
        onClick={() => {
          if (!disabled && onSelect) {
            onSelect();
          }
        }}
        {...props}
      />
    );
  }
);
CommandItem.displayName = "CommandItem";

interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

const CommandShortcut = ({ className, ...props }: CommandShortcutProps) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
