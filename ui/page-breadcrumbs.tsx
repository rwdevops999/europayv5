import { z } from "zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "./bread-crumb";

const breadcrumbsScheme = z.object({
  name: z.string(),
  url: z.string().optional(),
});

export type BreadcrumbsType = z.infer<typeof breadcrumbsScheme>;

const PageBreadcrumbs = ({ crumbs }: { crumbs: BreadcrumbsType[] }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb: BreadcrumbsType, index: number) => (
          <BreadcrumbItem key={crumb.name}>
            <BreadcrumbLink href={crumb.url} name={crumb.name} />
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumbs;
