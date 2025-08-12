import { CgScreen } from "react-icons/cg";
import { MdOutlineSnippetFolder } from "react-icons/md";
import ProgressLink from "./progress-link";
import { cn } from "@/lib/util";

const Breadcrumb = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={cn("breadcrumbs text-sm", className)} {...props} />;
};

const BreadcrumbList = ({
  className,
  ...props
}: React.ComponentProps<"ul">) => {
  return <ul data-slot="breadcrumb-list" {...props} />;
};

const BreadcrumbItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => {
  return (
    <li data-slot="breadcrumb-item" className={cn("", className)} {...props} />
  );
};

const BreadcrumbLink = ({
  asChild,
  className,
  name,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
} & { name: string }) => {
  return (
    <a data-slot="breadcrumb-link" {...props}>
      <CgScreen />
      {name}
    </a>
  );
};

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink };
