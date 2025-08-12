import { cn } from "@/lib/util";

const Table = ({ className, ...props }: React.ComponentProps<"table">) => {
  return (
    <div
      data-slot="table-container"
      // className="w-[97.7vw] overflow-x-auto rounded-box border border-base-content/5 bg-base-100"
    >
      <table
        data-slot="table"
        className={cn("table table-xs", className)}
        style={{}}
        {...props}
      />
    </div>
  );
};

const TableHeader = ({
  className,
  ...props
}: React.ComponentProps<"thead">) => {
  return <thead data-slot="table-header" className={className} {...props} />;
};

const TableBody = ({ className, ...props }: React.ComponentProps<"tbody">) => {
  return <tbody data-slot="table-body" className={className} {...props} />;
};

const TableRow = ({ className, ...props }: React.ComponentProps<"tr">) => {
  return (
    <tr
      data-slot="table-row"
      className={cn("hover:bg-base-content/10", className)}
      {...props}
    />
  );
};

const TableHead = ({ className, ...props }: React.ComponentProps<"th">) => {
  return <th data-slot="table-head" className={className} {...props} />;
};

const TableCell = ({ className, ...props }: React.ComponentProps<"td">) => {
  return (
    <td
      data-slot="table-cell"
      className={className}
      // className={cn(
      //   "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      //   className
      // )}
      {...props}
    />
  );
};

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell };
