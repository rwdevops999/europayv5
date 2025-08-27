"use client";

import { tEmail } from "@/app/server/data/email-data";
import { sendEmail } from "@/app/server/email";
import {
  createOTP,
  loadOTPByOtpCode,
  otpHasValidCode,
  setOtpStatus,
} from "@/app/server/otp";
import {
  blockUser,
  createUserAsGuest,
  loadUserByEmail,
  updateUserAttemps,
} from "@/app/server/users";
import { JobStatus, OTPStatus, UserType } from "@/generated/prisma";
import { useOTPSettings } from "@/hooks/use-otp-settings";
import { useProgressBar } from "@/hooks/use-progress-bar";
import { useToastSettings } from "@/hooks/use-toast-settings";
import { useUser } from "@/hooks/use-user";
import { tJob, tOTP, tOTPCreate, tUser } from "@/lib/prisma-types";
import { ToastType } from "@/lib/types";
import { absoluteUrl, showToast } from "@/lib/util";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";
import LoginEmailDialog from "./login-email-dialog";
import LoginOtpDialog from "./login-otp-dialog";
import LoginPasswordDialog from "./login-password";
import Processing from "@/ui/processing";
import NotificationDialog from "@/ui/notification-dialog";
import {
  changeJobStatus,
  createOtpJob,
  findOtpJobOfOtpId,
  runInngestOtpJob,
  suspendInngestOtpJob,
} from "@/app/server/job";

const cid: string = "StartLogin";

// MUST Come under Settings Limits
const MAX_ATTEMPS: number = 3;

export type tNotificationButton = {
  leftButton?: string;
  centerButton?: string;
  rightButton?: string;
};

type tLoginNotification = {
  _open: boolean;
  _template: string;
  _params: Record<string, string>;
  _buttonnames: tNotificationButton;
  _className?: string;
  _data?: any;
};

const generateOTP = (): string => {
  let str = "0123456789";
  let n = str.length;

  let OTP = "";
  for (var i = 1; i <= 6; i++) OTP += str[Math.floor(Math.random() * 10) % n];

  return OTP;
};

const StartLogin = ({ doLogin }: { doLogin: boolean }) => {
  const { login } = useUser();
  const { getTimingValue, getTimingNotation } = useOTPSettings();
  const { getToastDuration } = useToastSettings();

  const [processing, setProcessing] = useState<boolean>(false);

  const setProcessingOn = (): void => {
    setProcessing(true);
  };

  const setProcessingOff = (): void => {
    setProcessing(false);
  };

  const [notification, setNotification] = useState<
    tLoginNotification | undefined
  >(undefined);

  const [openEmailLoginDialog, setOpenEmailLoginDialog] =
    useState<boolean>(false);

  const userRef = useRef<tUser | null>(null);

  const showBlockedNotification = (_email: string): void => {
    let notification: tLoginNotification = {
      _open: true,
      _template: "ACCOUNT_BLOCKED",
      _params: { email: _email },
      _buttonnames: { leftButton: "Ok" },
    };

    setNotification(notification);
  };

  const showWrongLoginNotification = (_attempt: number): void => {
    let notification: tLoginNotification = {
      _open: true,
      _template: "WRONG_LOGIN",
      _params: { attemp: "" + _attempt, maxAttemps: "" + MAX_ATTEMPS },
      _buttonnames: { leftButton: "No", rightButton: "Yes" },
    };

    setNotification(notification);
  };

  const [openPasswordLoginDialog, setOpenPasswordLoginDialog] =
    useState<boolean>(false);

  const continueWithPasswordLogin = (): void => {
    setProcessingOff();
    setOpenPasswordLoginDialog(true);
  };

  const createOTPEntry = async (_user: tUser): Promise<string> => {
    const expirationvalue: number = getTimingValue();

    let date: number = Date.now() + expirationvalue;
    const expdate: Date = new Date(date);

    const otp: tOTPCreate = {
      userId: _user.id,
      OTP: generateOTP(),
      email: _user.email,
      status: OTPStatus.ONGOING,
      expirationDate: expdate,
      createDate: new Date(),
      updateDate: new Date(),
    };

    await createOTP(otp).then(async (id: number | null) => {
      if (id) {
        await createOtpJob(id, JobStatus.RUNNING).then(
          async (job: tJob | null) => {
            if (job) {
              await runInngestOtpJob(job.id);
            }
          }
        );
      }
    });

    return otp.OTP;
  };

  const hasValidOTPCode = async (_email: string): Promise<boolean> => {
    let result: boolean = false;

    await otpHasValidCode(_email).then((value: boolean) => (result = value));

    return result;
  };

  const [openOtpLoginDialog, setOpenOtpLoginDialog] = useState<boolean>(false);

  const continueWithOtpLogin = async (): Promise<void> => {
    if (userRef.current) {
      const user: tUser = userRef.current;

      if (await hasValidOTPCode(user.email)) {
        setProcessingOff();
        setOpenOtpLoginDialog(true);
      } else {
        const otp: string = await createOTPEntry(user);

        // TODO set value of OTP settings and start job
        const _email: tEmail = {
          destination: user.email,
          template: "EMAIL_OTP",
          asHTML: true,
          params: { OTPcode: otp, OTPvalid: getTimingNotation() },
        };

        await sendEmail(_email).then(() => {
          setProcessingOff();
          setOpenOtpLoginDialog(true);
        });
      }
    }
  };

  const continueWithUser = (_user: tUser | null) => {
    if (_user) {
      if (_user.blocked) {
        setProcessingOff();
        showBlockedNotification(_user.email);
      } else {
        if (_user.passwordless) {
          continueWithOtpLogin();
        } else {
          continueWithPasswordLogin();
        }
      }
    }
  };

  const loginWithEmail = async (_email: string): Promise<void> => {
    setProcessingOn();

    await loadUserByEmail(_email).then(async (user: tUser | null) => {
      if (user) {
        userRef.current = user;
        continueWithUser(user);
      } else {
        await createUserAsGuest(_email).then((user: tUser | null) => {
          userRef.current = user;
          continueWithUser(user);
        });
      }
    });
  };

  const showWrongOTPNotification = (_otp: string): void => {
    let notification: tLoginNotification = {
      _open: true,
      _template: "OTP_INCORRECT",
      _params: { otp: _otp },
      _buttonnames: { leftButton: "No", rightButton: "Yes" },
    };

    setNotification(notification);
  };

  const showOTPAlreadyUsed = (_otp: string): void => {
    let notification: tLoginNotification = {
      _open: true,
      _template: "OTP_ALREADY_USED",
      _params: { otp: _otp },
      _buttonnames: { leftButton: "No", rightButton: "Yes" },
    };

    setNotification(notification);
  };

  const showOTPExpired = (_otp: string): void => {
    let notification: tLoginNotification = {
      _open: true,
      _template: "OTP_EXPIRED",
      _params: { otp: _otp },
      _buttonnames: { leftButton: "No", centerButton: "Yes" },
    };

    setNotification(notification);
  };

  const loginWithOtp = async (_otp: string): Promise<void> => {
    setProcessingOn();
    if (userRef.current) {
      const user: tUser = userRef.current;

      await loadOTPByOtpCode(_otp).then(async (value: tOTP | null) => {
        if (value) {
          setProcessingOff();
          if (value.status === OTPStatus.EXPIRED) {
            showOTPExpired(_otp);
          } else if (value.status === OTPStatus.USED) {
            showOTPAlreadyUsed(_otp);
          } else {
            await setOtpStatus(value.id, OTPStatus.USED).then(async () => {
              const job: tJob | null = await findOtpJobOfOtpId(value.id);
              if (job && job.status === JobStatus.RUNNING) {
                await changeJobStatus(job.id, JobStatus.COMPLETED).then(
                  async () => {
                    await suspendInngestOtpJob(job.id);
                  }
                );
              }

              await updateUserAttemps(user.id, 0).then(() => {
                let welcome: string = "Guest";
                if (user.type === UserType.EUROPAY) {
                  welcome = `${user.firstname} ${user.lastname}`;
                }

                showToast(
                  ToastType.SUCCESS,
                  `Welcome ${welcome}`,
                  getToastDuration()
                );
                login(user);
                back();
                // redirect(absoluteUrl("/dashboard"));
              });
            });
          }
        } else {
          const attemps: number = user.attemps ? user.attemps + 1 : 1;
          user.attemps = attemps;
          userRef.current = user;

          await updateUserAttemps(user.id, attemps);

          if (attemps >= MAX_ATTEMPS) {
            await blockUser(user.id).then(() => {
              user.blocked = true;
              userRef.current = user;
              continueWithUser(user);
            });
          } else {
            setProcessingOff();
            showWrongOTPNotification(_otp);
          }
        }
      });
    }
  };

  const loginWithPassword = async (_password: string): Promise<void> => {
    setProcessingOn();
    if (userRef.current) {
      const user: tUser = userRef.current;

      if (_password === user.password) {
        setProcessingOff();
        await updateUserAttemps(user.id, 0);
        let welcome: string = "Guest";
        if (user.type === UserType.EUROPAY) {
          welcome = `${user.firstname} ${user.lastname}`;
        }

        showToast(ToastType.SUCCESS, `Welcome ${welcome}`, getToastDuration());
        login(user);
        back();
        // redirect(absoluteUrl("/dashboard"));
      } else {
        const attemps: number = user.attemps ? user.attemps + 1 : 1;
        user.attemps = attemps;
        userRef.current = user;
        await updateUserAttemps(user.id, attemps).then(async () => {
          if (attemps >= MAX_ATTEMPS) {
            await blockUser(user.id).then(() => {
              user.blocked = true;
              userRef.current = user;
              continueWithUser(user);
            });
          } else {
            setProcessingOff();
            showWrongLoginNotification(attemps);
          }
        });
      }
    }
  };

  const closeEmailDialog = (_cancelLogin: boolean): void => {
    setOpenEmailLoginDialog(false);

    if (_cancelLogin) {
      back();
    }
  };

  const closeOTPDialog = (_cancelLogin: boolean): void => {
    setOpenOtpLoginDialog(false);

    if (_cancelLogin) {
      back();
    }
  };

  const closePasswordDialog = (_cancelLogin: boolean): void => {
    setOpenPasswordLoginDialog(false);

    if (_cancelLogin) {
      back();
    }
  };

  useEffect(() => {
    setOpenEmailLoginDialog(true);
  }, [doLogin]);

  const progress = useProgressBar();
  const { push, back } = useRouter();

  const redirect = (href: string) => {
    progress.start(); // show the indicator

    startTransition(() => {
      push(href);
      progress.done(); // only runs when the destination page is fully loaded
    });
  };

  const handleCancelClick = (): void => {
    redirect(absoluteUrl("/"));
  };

  const handleOTPClick = (): void => {
    setNotification(undefined);
    setProcessingOn();
    continueWithUser(userRef.current);
  };

  const handlePasswordClick = (): void => {
    setNotification(undefined);
    setProcessingOn();
    continueWithUser(userRef.current);
  };

  const testNot = (): void => {
    let notification: tLoginNotification = {
      _open: true,
      _template: "ACCOUNT_BLOCKED",
      _params: { email: "test@test.com" },
      _buttonnames: { leftButton: "Ok" },
    };

    setNotification(notification);
  };

  const renderComponent = () => {
    return (
      <>
        <div className="w-[100vw] h-[88vh] flex justify-center border-2 border-red-500">
          <LoginEmailDialog
            open={openEmailLoginDialog}
            closeEmailDialog={closeEmailDialog}
            login={loginWithEmail}
          />
          <LoginOtpDialog
            open={openOtpLoginDialog}
            closeOTPDialog={closeOTPDialog}
            login={loginWithOtp}
          />
          <LoginPasswordDialog
            open={openPasswordLoginDialog}
            closePasswordDialog={closePasswordDialog}
            login={loginWithPassword}
          />
          <Processing open={processing} />
          <NotificationDialog
            _open={notification?._open}
            _template={notification?._template}
            _params={notification?._params}
            _buttonnames={notification?._buttonnames}
            _handleButtonLeft={handleCancelClick}
            _handleButtonCenter={handleOTPClick}
            _handleButtonRight={handlePasswordClick}
            _data={notification?._data}
          />
        </div>
      </>
    );
  };

  return <>{renderComponent()}</>;
};

export default StartLogin;
