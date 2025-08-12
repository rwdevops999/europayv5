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
      <h1 className="text-3xl text-gray-200 font-extrabold italic">EUROPAY</h1>
      <InitialiseApplication />
    </PageContent>
  );
};

export default EuropayHome;
