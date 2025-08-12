import { cn } from "@/lib/util";
import * as RadixDialog from "@radix-ui/react-dialog";

export const Dialog = ({
  ...props
}: React.ComponentProps<typeof RadixDialog.Root>) => {
  return <RadixDialog.Root data-slot="dialog" {...props} />;
};

const DialogPortal = ({
  ...props
}: React.ComponentProps<typeof RadixDialog.Portal>) => {
  return <RadixDialog.Portal data-slot="dialog-portal" {...props} />;
};

export const DialogContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadixDialog.Content>) => {
  return (
    <DialogPortal data-slot="dialog-portal">
      <RadixDialog.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    </DialogPortal>
  );
};

export const DialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixDialog.Title>) => {
  return (
    <RadixDialog.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
};

export const DialogDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixDialog.Description>) => {
  return (
    <RadixDialog.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};
