import { Column } from "@tanstack/react-table";
import { LuArrowDownUp } from "react-icons/lu";
import Button from "../button";
import { cn } from "@/lib/util";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <Button
        name={title}
        intent={"neutral"}
        size={"small"}
        style="ghost"
        className={cn(
          "border-none shadow-none hover:bg-transparent text-base-content/30",
          className
        )}
      />
    );
  }

  return (
    <div className={cn("flex items-start", className)}>
      <Button
        name={`${title}`}
        intent={"neutral"}
        size={"small"}
        style="ghost"
        icon={<LuArrowDownUp />}
        iconFirst={false}
        className={cn(
          "border-none shadow-none hover:bg-transparent text-base-content/30",
          className
        )}
        onClick={() =>
          column.toggleSorting(
            column.getIsSorted() ? column.getIsSorted() === "asc" : true
          )
        }
      />
    </div>
  );
}
