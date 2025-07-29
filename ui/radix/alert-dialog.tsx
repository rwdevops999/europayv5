import { cn } from "@/app/lib/util";
import * as RadixAlertDialog from "@radix-ui/react-alert-dialog";

export const AlertDialog = ({
  ...props
}: React.ComponentProps<typeof RadixAlertDialog.Root>) => {
  return <RadixAlertDialog.Root data-slot="alert-dialog" {...props} />;
};

export const AlertDialogPortal = ({
  ...props
}: React.ComponentProps<typeof RadixAlertDialog.Portal>) => {
  return <RadixAlertDialog.Portal data-slot="alert-dialog-portal" {...props} />;
};

export const AlertDialogContent = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixAlertDialog.Content>) => {
  return (
    <AlertDialogPortal>
      <RadixAlertDialog.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
};

export const AlertDialogHeader = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
};

export const AlertDialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixAlertDialog.Title>) => {
  return (
    <RadixAlertDialog.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
};

export const AlertDialogDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixAlertDialog.Description>) => {
  return (
    <RadixAlertDialog.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};

export const AlertDialogFooter = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
};
