import { cn } from "@/lib/util";

const NavbarAppInfo = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-testid="navbar-app-info"
      data-slot="app-info"
      className={cn("grid grid-cols-8 gap-0.5 h-[16px]", className)}
      {...props}
    />
  );
};

export default NavbarAppInfo;
