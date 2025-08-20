"use client";

import { mapJobs } from "@/app/client/mapping";
import { JobData } from "@/app/server/data/job-data";
import { useJob } from "@/hooks/use-job";
import { tJob } from "@/lib/prisma-types";
import { DataTable } from "@/ui/datatable/data-table";
import { JSX, useEffect, useState } from "react";
import { columns } from "./table/job-columns";
import { DataTableToolbar } from "./table/job-data-table-toolbar";
import { JobModel, JobStatus } from "@/generated/prisma";
import Button from "@/ui/button";
import {
  changeJobStatus,
  deleteJob,
  loadJobs,
  runInngestOtpJob,
  suspendInngestOtpJob,
} from "@/app/server/job";
import PageContent from "@/ui/page-content";
import { absoluteUrl, json } from "@/lib/util";
import ConfirmDialog from "./components/confirm-dialog";

const JobsPage = () => {
  const { jobCount } = useJob();

  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [jobs, setJobs] = useState<tJob[]>([]);

  const handleChangeJobSelection = (_ids: number[]) => {
    const equal: boolean =
      _ids.length === selectedJobs.length &&
      selectedJobs.every(function (value, index) {
        return value === _ids[index];
      });

    if (!equal) {
      setSelectedJobs(_ids);
    }
  };

  const JobTable = ({ _jobs }: { _jobs: tJob[] }): JSX.Element => {
    const [tableData, setTableData] = useState<JobData[]>([]);

    const mapJobsToData = (_jobs: tJob[]): void => {
      const mappedJobs: JobData[] = mapJobs(_jobs);

      setTableData(mappedJobs);
    };

    useEffect(() => {
      mapJobsToData(_jobs);
    }, [_jobs]);

    return (
      <DataTable
        data={tableData}
        columns={columns}
        Toolbar={DataTableToolbar}
        selectedItems={selectedJobs}
        handleChangeSelection={handleChangeJobSelection}
      />
    );
  };

  const JobInfo = (): JSX.Element => {
    return (
      <div className="ml-2 flex items-center space-x-2">
        <label>selected jobs:</label>
        <label className="font-extrabold italic">{selectedJobs.length}</label>
      </div>
    );
  };

  const suspendJobs = async (): Promise<void> => {
    for (let i = 0; i < selectedJobs.length; i++) {
      const job = jobs.find((_job: tJob) => _job.id === selectedJobs[i]);
      if (job) {
        if (job.model === JobModel.CLIENT) {
          // await suspendClientJob(job.jobname);
        } else {
          if (job.status === JobStatus.RUNNING) {
            await changeJobStatus(job.id, JobStatus.SUSPENDED).then(
              async () => {
                await suspendInngestOtpJob(job.id);
              }
            );
          }
        }

        loadTheJobs();
      }
    }
  };

  const restartJobs = async (): Promise<void> => {
    for (let i = 0; i < selectedJobs.length; i++) {
      const job = jobs.find((_job: tJob) => _job.id === selectedJobs[i]);
      if (job) {
        if (job.model === JobModel.CLIENT) {
          // await restartClientJob(job.jobname);
        } else {
          if (job.status === JobStatus.SUSPENDED) {
            await changeJobStatus(job.id, JobStatus.RUNNING).then(async () => {
              await runInngestOtpJob(job.id);
            });
          }
        }
        loadTheJobs();
      }
    }
  };

  const confirmDialog = async (): Promise<void> => {
    for (let i = 0; i < selectedJobs.length; i++) {
      const job = jobs.find((_job: tJob) => _job.id === selectedJobs[i]);
      if (job) {
        if (job.model === JobModel.CLIENT) {
          // await deleteClientJob(job.jobname);
        } else {
          await deleteJob(job.id).then(
            async () => await suspendInngestOtpJob(job.id)
          );
        }

        loadTheJobs();
      }
    }
    closeConfirmDialog();
  };

  const openConfirmDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "confirmdialog"
    ) as HTMLDialogElement;

    dialog.showModal();
  };

  const closeConfirmDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "confirmdialog"
    ) as HTMLDialogElement;

    dialog.close();
  };

  const removeJobs = (): void => {
    if (selectedJobs.length > 0) {
      openConfirmDialog();
    }
  };

  const Buttons = (): JSX.Element => {
    return (
      <div className="ml-2 flex items-center space-x-2">
        <Button
          intent="warning"
          style="soft"
          name="Suspend"
          size="small"
          onClick={suspendJobs}
        />
        <Button
          intent="success"
          style="soft"
          name="Restart"
          size="small"
          onClick={restartJobs}
        />
        <Button
          intent="error"
          style="soft"
          name="Remove"
          size="small"
          onClick={removeJobs}
        />
      </div>
    );
  };

  const loadTheJobs = async (): Promise<void> => {
    const jobs: tJob[] = await loadJobs();
    setJobs(jobs);
    setSelectedJobs([]);
  };

  useEffect(() => {
    loadTheJobs();
  }, []);

  useEffect(() => {
    loadTheJobs();
  }, [jobCount]);

  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Jobs", url: absoluteUrl("/jobs") },
      ]}
    >
      <div className="absolute w-[99vw] h-[84vh] grid grid-rows-[90%_5%_5%]">
        <div>
          <JobTable _jobs={jobs} />
        </div>
        <div>
          <JobInfo />
        </div>
        <div>
          <Buttons />
        </div>
      </div>
      <ConfirmDialog
        plural={selectedJobs.length > 1}
        handleOK={confirmDialog}
        handleCancel={closeConfirmDialog}
      />
    </PageContent>
  );
};

export default JobsPage;
