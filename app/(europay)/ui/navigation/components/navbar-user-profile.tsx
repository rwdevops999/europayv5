"use client";

import { useUser } from "@/hooks/use-user";
import UserAuth from "./user-auth";
import UserInfo from "./user-info";
import { useEffect } from "react";
import { tJob } from "@/lib/prisma-types";
import { useSocket } from "@/hooks/use-socket";
import { registerListener } from "@/listeners/register-listener";
import {
  TaskPollerJobName,
  transactionKey,
  TransactionPollerJobName,
} from "@/lib/constants";
import {
  createJob,
  deleteJob,
  findJobByName,
  runInngestJob,
} from "@/app/server/job";
import { JobModel, JobStatus } from "@/generated/prisma";
import { useTransaction } from "@/hooks/use-transaction";
import { useJob } from "@/hooks/use-job";

// const JOB_NAME: string = "TransactionPoller";
// const JOB_TIMING: number = 1 * 60 * 1000;

const NavbarUserProfile = () => {
  const { user } = useUser();
  const { socket, isConnected } = useSocket();
  const { setTransactionAvailable } = useTransaction();
  const { getJobTiming } = useJob();

  const runInngestJobForTransactionPoller = async (
    jobId: number
  ): Promise<void> => {
    await runInngestJob(
      TransactionPollerJobName,
      getJobTiming(TransactionPollerJobName),
      jobId,
      user?.id
    );
  };

  const createTransactionPollerJob = async (
    _jobname: string
  ): Promise<tJob | null> => {
    const job: tJob | null = await createJob(
      _jobname,
      JobModel.CLIENT,
      {},
      JobStatus.RUNNING
    );

    return job;
  };

  const startupJob = async (_jobname: string): Promise<void> => {
    await createTransactionPollerJob(_jobname).then(
      async (job: tJob | null) => {
        if (job) {
          await runInngestJobForTransactionPoller(job.id);
        }
      }
    );
  };

  const transactionListenerFunction = async (data: any): Promise<void> => {
    const { key, value } = data;

    if (key === `${transactionKey}:${user?.id}`) {
      const jobname: string = `${TransactionPollerJobName}:${user?.id}`;
      await findJobByName(jobname).then(async (job: tJob | null) => {
        if (job && job.status === JobStatus.RUNNING) {
          setTransactionAvailable(value > 0);
          await deleteJob(job.id).then(() => {
            startupJob(jobname);
          });
        }
      });
    }
  };

  useEffect(() => {
    if (user) {
      const jobname: string = `${TransactionPollerJobName}:${user.id}`;
      if (socket) {
        registerListener(
          socket,
          `${transactionKey}:${user.id}`,
          transactionListenerFunction
        );
        startupJob(jobname);
      }
    }
  }, [user]);

  return (
    <div data-testid="navbar-user-profile" className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-8 rounded-full">
          {(!user || !user.avatar) && (
            <img alt="User" src="/avatars/john.doe.png" />
          )}
          {user && user.avatar && (
            <img alt="User" src={`/avatars/${user.avatar}`} />
          )}
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow border-1 border-menuborder"
      >
        <li>
          <UserInfo />
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          <UserAuth />
        </li>
      </ul>
    </div>
  );
};

export default NavbarUserProfile;
