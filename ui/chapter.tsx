import { cn } from "@/lib/util";

const Chapter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {}) => {
  return (
    <div
      className={cn("block items-center justify-center p-2", className)}
      {...props}
    />
  );
};

export default Chapter;
