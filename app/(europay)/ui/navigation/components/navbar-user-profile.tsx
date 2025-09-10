"use client";

import { useUser } from "@/hooks/use-user";
import UserAuth from "./user-auth";
import UserInfo from "./user-info";
import { useEffect } from "react";
import {
  tJob,
  tSetting,
  tUser,
  tUserSetting,
  tUserSettingCreate,
} from "@/lib/prisma-types";
import { useSocket } from "@/hooks/use-socket";
import { registerListener } from "@/listeners/register-listener";
import {
  DEFAULT_TOAST_DURATION,
  TaskPollerJobName,
  transactionKey,
  TransactionPollerJobName,
} from "@/lib/constants";
import {
  createJob,
  deleteJob,
  findJobByName,
  runInngestJob,
  suspendInngestJob,
} from "@/app/server/job";
import { HistoryType, JobModel, JobStatus } from "@/generated/prisma";
import { useTransaction } from "@/hooks/use-transaction";
import { useJob } from "@/hooks/use-job";
import UserSettings from "./user-settings";
import { $iam_user_has_action } from "@/app/client/iam-access";
import { useToastSettings } from "@/hooks/use-toast-settings";
import { useMarkdownSettings } from "@/hooks/use-markdown-settings";
import { useHistorySettings } from "@/hooks/use-history-settings";
import { createUserSettings } from "@/app/server/usersettings";
import { json } from "@/lib/util";
import { loadUserById } from "@/app/server/users";
import { createDelayExpression } from "@/app/client/cron";

// const JOB_NAME: string = "TransactionPoller";
// const JOB_TIMING: number = 1 * 60 * 1000;

const envToastOn: string | undefined =
  process.env.NEXT_PUBLIC_SETTINGS_TOAST_ON;
const envToastDuration: string | undefined =
  process.env.NEXT_PUBLIC_SETTINGS_TOAST_DURATION;
const envMarkdownOn: string | undefined =
  process.env.NEXT_PUBLIC_SETTINGS_MARKDOWN_ON;
const envHistoryLevel: string | undefined =
  process.env.NEXT_PUBLIC_SETTINGS_HISTORY_LEVEL;

const NavbarUserProfile = () => {
  const { user, setUser } = useUser();
  const { socket, isConnected } = useSocket();
  const { setTransactions } = useTransaction();
  const { getJobTimingNotation, incrementJobsChanged } = useJob();

  const { setToast, setToastDuration } = useToastSettings();
  const { setMarkdown } = useMarkdownSettings();
  const { setHistory } = useHistorySettings();

  const handleUserSettings = async (
    _user: tUser | null = null
  ): Promise<void> => {
    if (_user) {
      if (_user.settings.length === 0) {
        const usersettings: tUserSettingCreate[] = [
          {
            key: "Toast",
            value: process.env.NEXT_PUBLIC_SETTINGS_TOAST_ON ?? "true",
            users: {
              connect: {
                id: _user.id,
              },
            },
          },
          {
            key: "ToastDuration",
            value:
              process.env.NEXT_PUBLIC_SETTINGS_TOAST_DURATION ??
              DEFAULT_TOAST_DURATION.toString(),
            users: {
              connect: {
                id: _user.id,
              },
            },
          },
          {
            key: "Markdown",
            value: process.env.NEXT_PUBLIC_SETTINGS_MARKDOWN_ON ?? "true",
            users: {
              connect: {
                id: _user.id,
              },
            },
          },
          {
            key: "History",
            value: process.env.NEXT_PUBLIC_SETTINGS_HISTORY_LEVEL ?? "All",
            users: {
              connect: {
                id: _user.id,
              },
            },
          },
        ];

        await createUserSettings(usersettings).then(async () => {
          const updateduser: tUser | null = await loadUserById(_user.id);

          setUser(updateduser);
        });
      }

      if (_user.settings.length > 0) {
        let setting: tUserSetting | undefined;

        setting = _user.settings.find(
          (usersetting: tUserSetting) => usersetting.key === "Toast"
        );
        if (setting && setting.value.toLocaleLowerCase() === "false") {
          setToast(false);
        } else {
          setToast(envToastOn ? envToastOn.toLowerCase() === "true" : true);
        }

        setting = _user.settings.find(
          (usersetting: tUserSetting) => usersetting.key === "ToastDuration"
        );

        if (setting) {
          setToastDuration(parseInt(setting.value));
        } else {
          setToastDuration(
            parseInt(
              envToastDuration
                ? envToastDuration
                : DEFAULT_TOAST_DURATION.toString()
            )
          );
        }

        setting = _user.settings.find(
          (usersetting: tUserSetting) => usersetting.key === "Markdown"
        );

        if (setting && setting.value.toLowerCase() === "false") {
          setMarkdown(false);
        } else {
          setMarkdown(
            envMarkdownOn ? envMarkdownOn.toLowerCase() === "true" : true
          );
        }

        setting = _user.settings.find(
          (usersetting: tUserSetting) => usersetting.key === "History"
        );

        if (setting) {
          setHistory(HistoryType[setting.value as keyof typeof HistoryType]);
        } else {
          setHistory(
            envHistoryLevel
              ? HistoryType[envHistoryLevel as keyof typeof HistoryType]
              : HistoryType.ALL
          );
        }
      }
    } else {
      setToast(envToastOn ? envToastOn.toLowerCase() === "true" : true);
      setToastDuration(
        parseInt(
          envToastDuration
            ? envToastDuration
            : DEFAULT_TOAST_DURATION.toString()
        )
      );
      setMarkdown(
        envMarkdownOn ? envMarkdownOn.toLowerCase() === "true" : true
      );
      setHistory(
        envHistoryLevel
          ? HistoryType[envHistoryLevel as keyof typeof HistoryType]
          : HistoryType.ALL
      );
    }
  };

  const transactionListenerFunction = async (data: any): Promise<void> => {
    console.log("[TRANSACTIONPOLLER] Received event from Inngest");
    const expectedkey: string = `${transactionKey}:${user?.id}`;

    const { key, value } = data;
    console.log("[TRANSACTIONPOLLER] Received", key);

    if (key === expectedkey) {
      console.log("[TRANSACTIONPOLLER] Key matches", "transactions", value);
      if (value >= 0) {
        setTransactions(value);
      }
      incrementJobsChanged();
    }
  };

  const createClientJob = async (
    _jobname: string,
    _data: any
  ): Promise<tJob | null> => {
    const job: tJob | null = await createJob(
      _jobname,
      JobModel.CLIENT,
      _data,
      JobStatus.CREATED
    );

    return job;
  };

  const startupJob = async (_user: tUser): Promise<void> => {
    const expectedJobname: string = `${TransactionPollerJobName}:${_user.id}`;

    console.log(
      "[TRANSACTIONPOLLER]:startupJob",
      "Looking up job",
      expectedJobname
    );
    const job: tJob | null = await findJobByName(expectedJobname);

    if (job) {
      console.log(
        "[TRANSACTIONPOLLER]:startupJob",
        "Job found",
        expectedJobname
      );
      if (job.status === JobStatus.RUNNING) {
        console.log(
          "[TRANSACTIONPOLLER]:startupJob",
          "Job is running => suspend Inngest job"
        );
        await suspendInngestJob(TransactionPollerJobName, {
          jobid: job.id,
        });
      }

      console.log("[TRANSACTIONPOLLER]:startupJob", "Delete job", job.id);
      await deleteJob(job.id);
    }

    const delay = createDelayExpression(
      getJobTimingNotation(TransactionPollerJobName)
    );
    console.log("[TRANSACTIONPOLLER]:startupJob", "Delay", delay);

    console.log(
      "[TRANSACTIONPOLLER]:startupJob",
      "Creating client job",
      expectedJobname
    );
    await createClientJob(expectedJobname, { delayexpression: delay }).then(
      async (job: tJob | null) => {
        if (job) {
          console.log(
            "[TRANSACTIONPOLLER]:startupJob",
            "Job is created",
            "Starting Inngest job",
            TransactionPollerJobName
          );
          await runInngestJob(TransactionPollerJobName, {
            jobid: job.id,
            userid: _user.id,
            delayexpression: delay,
          }).then(() => incrementJobsChanged());
        }
      }
    );
  };

  const setupTransactionPoller = async (_user: tUser): Promise<void> => {
    console.log("[TRANSACTIONPOLLER] Setting up transaction poller");

    const key: string = `${transactionKey}:${_user.id}`;
    console.log("[TRANSACTIONPOLLER] Register listener for", key);
    registerListener(socket, key, transactionListenerFunction);
    startupJob(_user);
  };

  useEffect(() => {
    if (user) {
      // user logged in

      // load/set settings
      handleUserSettings(user);
      // start transactionPoller job
      setupTransactionPoller(user);
    } else {
      // user logged out
      handleUserSettings();
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
          <UserSettings />
        </li>
        <li>
          <UserAuth />
        </li>
      </ul>
    </div>
  );
};

export default NavbarUserProfile;
