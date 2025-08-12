import { cn } from "@/lib/util";

const PageItemContainer = ({
  className,
  border,
  title,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  border?: boolean;
  title: string;
}) => {
  return (
    <div
      className={cn(
        "",
        { "rounded-sm border border-base-content/10": border },
        className
      )}
    >
      <div className="flex items-center rounded-t-sm text-xs text-base-content/60 bg-base-content/30">
        <div className="ml-1">{title}</div>
      </div>
      <div
        className={cn("block items-center justify-center p-2", className)}
        {...props}
      />
    </div>
  );
};

export default PageItemContainer;
