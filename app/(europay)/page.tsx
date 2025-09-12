import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import InitialiseApplication from "./components/initialise/initialise-application";

const EuropayHome = () => {
  return (
    <PageContent
      data-testid="europay-home"
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Home", url: absoluteUrl("/") },
      ]}
    >
      <InitialiseApplication />
    </PageContent>
  );
};

export default EuropayHome;
