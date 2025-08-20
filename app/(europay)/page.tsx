import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import InitialiseApplication from "./components/initialise/initialise-application";
import { useEffect } from "react";
import io from "socket.io-client";

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
