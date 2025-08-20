import { cn } from "@/lib/util";
import { FaPager } from "react-icons/fa6";

const ChapterContainer = ({
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
        { "rounded-sm border-1 border-base-content/40": border },
        className
      )}
    >
      <div className="flex space-x-2 items-center rounded-t-sm text-xs text-base-content/60 bg-base-content/30">
        <FaPager size={14} />
        <div className="ml-1">{title}</div>
      </div>
      <div
        className={cn("block items-center justify-center p-2", className)}
        {...props}
      />
    </div>
  );
};

export default ChapterContainer;
