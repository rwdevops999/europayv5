"use client";

import { $iam_user_has_action } from "@/app/client/iam-access";
import { deleteJob, findJobByName, suspendInngestJob } from "@/app/server/job";
import { useJob } from "@/hooks/use-job";
import { useProgressBar } from "@/hooks/use-progress-bar";
import { useSocket } from "@/hooks/use-socket";
import { useUser } from "@/hooks/use-user";
import { transactionKey, TransactionPollerJobName } from "@/lib/constants";
import { tJob, tUser } from "@/lib/prisma-types";
import { absoluteUrl } from "@/lib/util";
import {
  registerListener,
  unregisterListener,
} from "@/listeners/register-listener";
import Button from "@/ui/button";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";

const UserAuth = () => {
  const { user, isLoggedIn, logout } = useUser();
  const progress = useProgressBar();
  const { push, back } = useRouter();
  const { socket } = useSocket();
  const { incrementJobsChanged } = useJob();

  const redirect = (href: string) => {
    progress.start(); // show the indicator

    startTransition(() => {
      push(href);
      progress.done(); // only runs when the destination page is fully loaded
    });
  };

  const cleanupJob = async (_user: tUser): Promise<void> => {
    const expectedJobname: string = `${TransactionPollerJobName}:${_user.id}`;

    const job: tJob | null = await findJobByName(expectedJobname);

    if (job) {
      await suspendInngestJob(TransactionPollerJobName, {
        jobid: job.id,
      }).then(async () => {
        await deleteJob(job.id).then(() => incrementJobsChanged());
      });
    }
  };

  const cleanupTransactionPoller = async (_user: tUser): Promise<void> => {
    const key: string = `${transactionKey}:${_user.id}`;

    unregisterListener(socket, key);
    cleanupJob(_user);
  };

  const doLogout = () => {
    if (user) {
      cleanupTransactionPoller(user);
      logout();
      back();
      // redirect(absoluteUrl("/"));
    }
  };

  const visible: boolean = $iam_user_has_action(
    user,
    "europay",
    "Access Auth",
    true
  );

  const mayLogin: boolean = $iam_user_has_action(
    user,
    "europay:authorisation",
    "Login",
    true
  );

  const mayLogout: boolean = $iam_user_has_action(
    user,
    "europay:authorisation",
    "Logout"
  );

  return (
    <>
      {visible && (
        <div>
          {isLoggedIn() && mayLogout && (
            <div
              className="cursor-pointer flex space-x-2 items-center"
              onClick={doLogout}
            >
              <RiLogoutBoxLine className="text-red-500" size={16} />
              <label className="cursor-pointer">Log Out</label>
            </div>
          )}
          {!isLoggedIn() && mayLogin && (
            <div
              className="cursor-pointer flex space-x-2 items-center"
              onClick={() => redirect(absoluteUrl("/login"))}
            >
              <RiLogoutBoxLine className="text-red-500" size={16} />
              <label className="cursor-pointer">Log In</label>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserAuth;
