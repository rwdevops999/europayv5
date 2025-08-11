import { loadServiceStatements } from "@/app/server/service-statements";
import { loadServices } from "@/app/server/services";
import { absoluteUrl } from "@/lib/functions";
import { tService, tServiceStatement } from "@/lib/prisma-types";
import PageContent from "@/ui/page-content";
import ServiceStatementHandler from "./service-statement-handler";

/**
 * the param contains a statement id or undefined.
 *
 * @param param: the statement id or undefined
 * @returns
 */
const IamStatementsPage = async ({ params }: { params: Promise<any[]> }) => {
  let services: tService[] = [];
  let servicestatements: tServiceStatement[] = [];
  // let statementId: number | undefined;

  let statementId: number | undefined;
  let serviceId: number | undefined;

  /**
   * retrieve the statementId, then load all services and all service statements.
   */
  await params.then(async (values: any[]) => {
    statementId = values[0];
    serviceId = values[1];
    await loadServices().then(async (values: tService[]) => {
      services = values;
      await loadServiceStatements().then((values: tServiceStatement[]) => {
        servicestatements = values;
      });
    });
  });

  /**
   * call the service statement handler (which provides the UI for handling the statements)
   */
  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "IAM" },
        { name: "Statements", url: absoluteUrl("/iam/statements/id") },
      ]}
    >
      <ServiceStatementHandler
        serviceid={serviceId}
        servicestatementid={statementId}
        servicestatements={servicestatements}
        services={services}
      />
    </PageContent>
  );
};

export default IamStatementsPage;
