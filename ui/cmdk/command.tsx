import { cn } from "@/lib/functions";
import { Command as CmdkCommand } from "cmdk";
import { IoIosSearch } from "react-icons/io";

const Command = ({
  className,
  ...props
}: React.ComponentProps<typeof CmdkCommand>) => {
  return (
    <CmdkCommand
      tabIndex={0}
      data-slot="command"
      className={className}
      {...props}
    />
  );
};

const CommandInput = ({
  className,
  ...props
}: React.ComponentProps<typeof CmdkCommand.Input>) => {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <IoIosSearch className="size-4 shrink-0 opacity-50" />
      <CmdkCommand.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  );
};

const CommandList = ({
  className,
  ...props
}: React.ComponentProps<typeof CmdkCommand.List>) => {
  return (
    <CmdkCommand.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  );
};

const CommandEmpty = ({
  ...props
}: React.ComponentProps<typeof CmdkCommand.Empty>) => {
  return (
    <CmdkCommand.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
};

const CommandGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof CmdkCommand.Group>) => {
  return (
    <CmdkCommand.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  );
};

const CommandItem = ({
  className,
  ...props
}: React.ComponentProps<typeof CmdkCommand.Item>) => {
  return (
    <CmdkCommand.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-sm px-1 py-1 text-sm data-[selected=true]:bg-base-content/10 data-[selected=true]:text-base-content data-[selected=false]:text-base-content/30 [&_svg:not([class*='text-'])]:text-base-content/50",
        className
      )}
      {...props}
    />
  );
};

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CmdkCommand.Separator>) {
  return (
    <CmdkCommand.Separator
      data-slot="command-separator"
      className={cn("bg-base-content/50 -mx-1 h-px", className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
};
