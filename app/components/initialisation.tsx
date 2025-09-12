"use client";

import React, { useEffect, useState } from "react";
import SetupServices from "./setup-services";
import SetupTemplates from "./setup-templates";
import SetupCountries from "./setup-countries";
import SetupSettings from "./setup-settings";
import { createHistoryEntry } from "../server/history";
import { HistoryType } from "@/generated/prisma";
import DeleteClientJobs from "./delete-client-jobs";
import SetupServerJobs from "./setup-server-jobs";
import SetupClientJobs from "./setup-client-jobs";
import ProcessSettings from "../(europay)/components/initialise/process-settings";
import CreateManagedIam from "./create-managed-iam";
import EnableCursor from "./enable-cursor";

const Initialisation = () => {
  const createStartupHistoryEntry = async (): Promise<void> => {
    await createHistoryEntry(
      HistoryType.INFO,
      HistoryType.ALL,
      "STARTUP",
      {},
      "Initialise"
    );
  };

  useEffect(() => {
    createStartupHistoryEntry();
  }, []);

  const [initServices, setInitServices] = useState<boolean>(false);
  const [initCountries, setInitCountries] = useState<boolean>(false);
  const [initSettings, setInitSettings] = useState<boolean>(false);
  const [processSettings, setProcessSettings] = useState<boolean>(false);
  const [deleteClientJobs, setDeleteClientJobs] = useState<boolean>(false);
  const [setupServerJobs, setSetupServerJobs] = useState<boolean>(false);
  const [setupClientJobs, setSetupClientJobs] = useState<boolean>(false);
  const [initIam, setInitIam] = useState<boolean>(false);

  return (
    <>
      <SetupTemplates proceed={setInitServices} />
      <SetupServices start={initServices} proceed={setInitCountries} />
      <SetupCountries start={initCountries} proceed={setInitSettings} />
      <SetupSettings start={initSettings} proceed={setProcessSettings} />
      {/* <ProcessSettings start={processSettings} proceed={setDeleteClientJobs} /> */}
      <ProcessSettings start={processSettings} proceed={setSetupClientJobs} />
      {/* <DeleteClientJobs start={deleteClientJobs} proceed={setSetupServerJobs} /> */}
      {/* <SetupServerJobs start={setupServerJobs} proceed={setSetupClientJobs} /> */}
      <SetupClientJobs start={setupClientJobs} proceed={setInitIam} />
      <CreateManagedIam start={initIam} proceed={() => {}} />
    </>
  );
};

export default Initialisation;
