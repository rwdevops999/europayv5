import PageBreadcrumbs, { BreadcrumbsType } from "./page-breadcrumbs";

const PageContent = ({
  breadcrumbs,
  className,
  ...props
}: React.ComponentProps<"div"> & { breadcrumbs: BreadcrumbsType[] }) => {
  return (
    <div className="ml-2">
      {breadcrumbs.length > 0 && <PageBreadcrumbs crumbs={breadcrumbs} />}
      <div
        data-slot="page-content"
        style={{
          position: "fixed",
          width: "98.5vw",
          height: "84vh",
        }}
        className={className}
        {...props}
      />
    </div>
  );
};

export default PageContent;
