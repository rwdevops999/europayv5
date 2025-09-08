"use client";

import { tJob } from "@/lib/prisma-types";
import { useEffect, useState } from "react";
import { JobStatus } from "@/generated/prisma";
import {
  changeJobStatus,
  deleteJob,
  findJobById,
  loadJobs,
  runInngestJob,
  suspendInngestJob,
} from "@/app/server/job";
import PageContent from "@/ui/page-content";
import { absoluteUrl } from "@/lib/util";
import JobsTable from "./components/jobs-table";
import JobInfo from "./components/job-info";
import JobActionButtons from "./components/job-action-buttons";
import { JsonValue } from "@/generated/prisma/runtime/library";
import { useJob } from "@/hooks/use-job";

const JobsPage = () => {
  const { jobsChanged } = useJob();

  const [jobs, setJobs] = useState<tJob[]>([]);

  const loadDatabaseJobs = async (): Promise<void> => {
    setJobs(await loadJobs());
  };

  useEffect(() => {
    loadDatabaseJobs();
    setSelectedJobIds([]);
  }, [jobsChanged]);

  // const selectedJobsIds = useRef<number[]>([]);
  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);

  const updateSelectedJobsId = (selection: number[]): void => {
    setSelectedJobIds(selection);
  };

  const suspendSelectedJobs = async (): Promise<void> => {
    let jobdataChanged: boolean = false;

    for (let i = 0; i < selectedJobIds.length; i++) {
      const jobId: number = selectedJobIds[i];
      const job: tJob | null = await findJobById(jobId);
      if (job) {
        if (job.status !== JobStatus.SUSPENDED) {
          const jobname: string = job.jobname;
          await suspendInngestJob(jobname, {
            jobid: job.id,
            delayexpression: "",
          }).then(async () => {
            await changeJobStatus(job.id, JobStatus.SUSPENDED).then(
              () => (jobdataChanged = true)
            );
          });
        }
      }
    }

    if (jobdataChanged) {
      loadDatabaseJobs();
    }
    setSelectedJobIds([]);
  };

  const removeSelectedJobs = async (): Promise<void> => {
    let jobdataChanged: boolean = false;

    for (let i = 0; i < selectedJobIds.length; i++) {
      const jobId: number = selectedJobIds[i];

      const job: tJob | null = await findJobById(jobId);

      if (job) {
        if (job.status !== JobStatus.SUSPENDED) {
          const jobname: string = job.jobname;
          await suspendInngestJob(jobname, {
            jobid: job.id,
            delayexpression: "",
          });
        }

        await deleteJob(job.id).then(() => {
          jobdataChanged = true;
        });
      }
    }

    if (jobdataChanged) {
      loadDatabaseJobs();
    }

    setSelectedJobIds([]);
  };

  const restartSelectedJobs = async (): Promise<void> => {
    let jobdataChanged: boolean = false;

    for (let i = 0; i < selectedJobIds.length; i++) {
      const jobId: number = selectedJobIds[i];

      const job: tJob | null = await findJobById(jobId);

      if (job) {
        const data: JsonValue = job.data;

        const _data: { delayexpression: string } = data as {
          delayexpression: string;
        };

        await changeJobStatus(job.id, JobStatus.CREATED).then(async () => {
          await runInngestJob(job.jobname, {
            jobid: job.id,
            delayexpression: _data.delayexpression,
          }).then(() => (jobdataChanged = true));
        });
      }
    }

    if (jobdataChanged) {
      loadDatabaseJobs();
    }

    setSelectedJobIds([]);
  };

  const clearSelectedJobs = (): void => {
    setSelectedJobIds([]);
  };

  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Jobs", url: absoluteUrl("/jobs") },
      ]}
    >
      <label>LENGTH: {selectedJobIds.length}</label>
      <div className="absolute w-[99vw] h-[80vh] grid grid-rows-[90%_5%_5%]">
        <JobsTable
          _jobs={jobs}
          selectedJobs={selectedJobIds}
          changeJobSelection={updateSelectedJobsId}
        />
        <JobInfo selectedJobs={selectedJobIds.length} />
        <JobActionButtons
          selectedJobsSize={selectedJobIds.length}
          suspendSelectedJobs={suspendSelectedJobs}
          removeSelectedJobs={removeSelectedJobs}
          restartSelectedJobs={restartSelectedJobs}
          clearSelectedJobs={clearSelectedJobs}
        />
      </div>
    </PageContent>
  );
};

export default JobsPage;
