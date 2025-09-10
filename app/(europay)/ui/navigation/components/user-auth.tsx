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

    console.log(
      "[TRANSACTIONPOLLER]:cleanupJob",
      "Looking up job",
      expectedJobname
    );

    const job: tJob | null = await findJobByName(expectedJobname);

    if (job) {
      console.log(
        "[TRANSACTIONPOLLER]:cleanupJob",
        "Job found",
        expectedJobname
      );

      console.log("[TRANSACTIONPOLLER]:startupJob", "Suspend Inngest job");

      await suspendInngestJob(TransactionPollerJobName, {
        jobid: job.id,
      }).then(async () => {
        console.log("[TRANSACTIONPOLLER]:startupJob", "Delete job", job.id);
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
      console.log("[LOGOUT]", "Logoff user", user.id);
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
    "Logout",
    true
  );

  return (
    <>
      {visible && (
        <div>
          {isLoggedIn() && (
            <div className="-ml-4 flex items-center">
              <Button
                name="Log Out"
                size="small"
                className="bg-transparent hover:border-none hover:shadow-none"
                icon={<RiLogoutBoxLine className="text-red-500" size={16} />}
                iconFirst
                onClick={doLogout}
                disabled={!mayLogout}
              />
            </div>
          )}
          {!isLoggedIn() && (
            <div className="-ml-4 flex items-center">
              <Button
                name="Log In"
                size="small"
                className="bg-transparent hover:border-none hover:shadow-none"
                icon={<RiLoginBoxLine className="text-red-500" size={16} />}
                iconFirst
                onClick={() => redirect(absoluteUrl("/login"))}
                disabled={!mayLogin}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserAuth;
