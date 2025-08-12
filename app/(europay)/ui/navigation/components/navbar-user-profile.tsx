"use client";

import { useUser } from "@/hooks/use-user";
import UserAuth from "./user-auth";
import UserInfo from "./user-info";

// const JOB_NAME: string = "TransactionPoller";
// const JOB_TIMING: number = 1 * 60 * 1000;

const NavbarUserProfile = () => {
  const { user } = useUser();
  // const { setTransactionCount } = useTransaction();
  // const { jobCount, setJobCount } = useJob();

  // const checkForNewTransactions = async (_data: any): Promise<void> => {
  //   setTransactionCount(_data);
  //   startJob(JOB_NAME, JOB_TIMING);
  // };

  // const startTransactionPollerJob = async (): Promise<void> => {
  //   addJob(JOB_NAME, "Polling for new transactions", checkForNewTransactions);
  //   startJob(JOB_NAME, 500);
  //   setJobCount(jobCount + 1);
  // };

  // const stopTransactionPollerJob = async (): Promise<void> => {
  //   await deleteClientJob(JOB_NAME).then(() => {
  //     setJobCount(jobCount - 1);
  //   });
  // };

  // useEffect(() => {
  //   if (user) {
  //     startTransactionPollerJob();
  //   } else {
  //     stopTransactionPollerJob();
  //   }
  // }, [user]);

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
