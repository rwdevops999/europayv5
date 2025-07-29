import * as RadixSeparator from "@radix-ui/react-separator";
import clsx from "clsx";

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof RadixSeparator.Root>) {
  return (
    <RadixSeparator.Root
      data-slot="separator-root"
      decorative={false}
      orientation={orientation}
      className={clsx("border-1 text-base-content/30", className)}
      {...props}
    />
  );
}

export { Separator };
