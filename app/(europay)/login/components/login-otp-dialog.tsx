import { useProgressBar } from "@/hooks/use-progress-bar";
import { absoluteUrl, isNumber } from "@/lib/util";
import Button from "@/ui/button";
import { useRouter } from "next/navigation";
import { FormEvent, startTransition, useEffect } from "react";

export type tApplyInformation = {
  username: string;
  email: string;
  password: string;
};

const otpbutton: string = "otp-input";

const cid: string = "LoginOtpDialog";

const LoginOtpForm = ({
  open,
  closeOTPDialog,
  login,
}: {
  open: boolean;
  closeOTPDialog: (_cancelLogin: boolean) => void;
  login: (_info: any) => void;
}) => {
  const getInputValue = (_id: string): string => {
    let result: string = "";

    let element: HTMLInputElement | null = document.getElementById(
      _id
    ) as HTMLInputElement;
    if (element) {
      result = element.value;
    }

    return result;
  };

  const getOtpValue = (): string => {
    let result: string = "";

    [1, 2, 3, 4, 5, 6].forEach((value: number) => {
      let element: HTMLInputElement | null = document.getElementById(
        otpbutton + value
      ) as HTMLInputElement;
      if (element) {
        result += element.value;
      }
    });

    return result;
  };

  const deactivateRequiredElements = () => {
    [1, 2, 3, 4, 5, 6].forEach((value: number) => {
      let element: HTMLInputElement | null = document.getElementById(
        otpbutton + value
      ) as HTMLInputElement;
      if (element) {
        element.required = false;
      }
    });
  };

  const clearOTPElements = () => {
    [1, 2, 3, 4, 5, 6].forEach((value: number) => {
      let element: HTMLInputElement | null = document.getElementById(
        otpbutton + value
      ) as HTMLInputElement;
      if (element) {
        element.value = "";
      }
    });
  };

  const progress = useProgressBar();
  const { push, back } = useRouter();

  const redirect = (href: string) => {
    progress.start(); // show the indicator

    startTransition(() => {
      push(href);
      progress.done(); // only runs when the destination page is fully loaded
    });
  };

  const handleSubmitForm = (e: FormEvent): void => {
    e.preventDefault();

    if (submitForm) {
      let otp: string = getOtpValue();
      closeOTPDialog(false);
      login(otp);
    } else {
      redirect(absoluteUrl("/"));
    }
  };

  const cancelLogin = () => {
    submitForm = false;

    deactivateRequiredElements();

    closeOTPDialog(true);
  };

  const focusOnElement = (_id: number): void => {
    const element: HTMLElement | null = document.getElementById(
      otpbutton + _id
    );

    if (element) {
      window.setTimeout(() => {
        element.focus();
      }, 320);
    }
  };

  let submitForm: boolean = true;

  useEffect(() => {
    submitForm = true;
    clearOTPElements();
    focusOnElement(1);
  }, []);

  useEffect(() => {
    submitForm = true;
    clearOTPElements();
    focusOnElement(1);
  }, [open]);

  const isValid = (value: string): boolean => {
    let result: boolean = false;

    if (typeof value === "string") {
      const val: number = parseInt(value);

      if (isNumber(val) && !isNaN(val)) {
        result = true;
      }
    }

    return result;
  };

  return (
    <form
      className="w-fit h-fit flex flex-col items-center justify-center gap-1 pt-12.5 pr-10 pb-5 pl-10 bg-login-pattern rounded-md font-sans"
      onSubmit={(e) => handleSubmitForm(e)}
    >
      <span className="text-xl text-[#0f0f0f] font-bold">Enter OTP</span>
      <p className="text-xs text-black text-center">
        We have sent a verification code to your email
      </p>
      <div className="w-[100%] flex flex-row gap-2.5 items-center justify-center">
        <div className="flex space-x-1">
          <input
            id="otp-input1"
            data-prevent-modal-close-on-escape="true"
            type="text"
            required
            maxLength={1}
            className="bg-accent-content w-7.5 h-7.5 text-center border-none rounded-[7px] caret-[#fff] text-[#fff] outline-none font-semibold focus:bg-[rgba(127, 129, 255, 0.199)] focus:duration-300 valid:bg-[rgba(127, 129, 255, 0.199)] valid:duration-300"
            onChange={(event) => {
              if (isValid(event.target.value)) {
                focusOnElement(2);
              }
            }}
          />
          <input
            id="otp-input2"
            data-prevent-modal-close-on-escape="true"
            type="text"
            required
            maxLength={1}
            className="bg-accent-content w-7.5 h-7.5 text-center border-none rounded-[7px] caret-[#fff] text-[#fff] outline-none font-semibold focus:bg-[rgba(127, 129, 255, 0.199)] focus:duration-300 valid:bg-[rgba(127, 129, 255, 0.199)] valid:duration-300"
            onChange={(event) => {
              if (isValid(event.target.value)) {
                focusOnElement(3);
              }
            }}
          />
          <input
            id="otp-input3"
            data-prevent-modal-close-on-escape="true"
            type="text"
            required
            maxLength={1}
            className="bg-accent-content w-7.5 h-7.5 text-center border-none rounded-[7px] caret-[#fff] text-[#fff] outline-none font-semibold focus:bg-[rgba(127, 129, 255, 0.199)] focus:duration-300 valid:bg-[rgba(127, 129, 255, 0.199)] valid:duration-300"
            onChange={(event) => {
              if (isValid(event.target.value)) {
                focusOnElement(4);
              }
            }}
          />
          <input
            id="otp-input4"
            data-prevent-modal-close-on-escape="true"
            type="text"
            required
            maxLength={1}
            className="bg-accent-content w-7.5 h-7.5 text-center border-none rounded-[7px] caret-[#fff] text-[#fff] outline-none font-semibold focus:bg-[rgba(127, 129, 255, 0.199)] focus:duration-300 valid:bg-[rgba(127, 129, 255, 0.199)] valid:duration-300"
            onChange={(event) => {
              if (isValid(event.target.value)) {
                focusOnElement(5);
              }
            }}
          />
          <input
            id="otp-input5"
            data-prevent-modal-close-on-escape="true"
            type="text"
            required
            maxLength={1}
            className="bg-accent-content w-7.5 h-7.5 text-center border-none rounded-[7px] caret-[#fff] text-[#fff] outline-none font-semibold focus:bg-[rgba(127, 129, 255, 0.199)] focus:duration-300 valid:bg-[rgba(127, 129, 255, 0.199)] valid:duration-300"
            onChange={(event) => {
              if (isValid(event.target.value)) {
                focusOnElement(6);
              }
            }}
          />
          <input
            id="otp-input6"
            data-prevent-modal-close-on-escape="true"
            type="text"
            required
            maxLength={1}
            className="bg-accent-content w-7.5 h-7.5 text-center border-none rounded-[7px] caret-[#fff] text-[#fff] outline-none font-semibold focus:bg-[rgba(127, 129, 255, 0.199)] focus:duration-300 valid:bg-[rgba(127, 129, 255, 0.199)] valid:duration-300"
          />
        </div>
      </div>
      <Button
        size="small"
        name="Verify"
        type="submit"
        className="mt-5 bg-login-button"
      />
      {/* <button
        title="Verify"
        type="submit"
        className="h-10 border-0 bg-login-button text-[#fff] rounded-[7px] outline-none cursor-pointer"
      >
        <span>Verify</span>
      </button> */}
      <Button
        size="small"
        name="Cancel"
        type="button"
        onClick={cancelLogin}
        className="hover:bg-[#6c6f72]"
      />
      {/* <button
        type="button"
        title="Cancel"
        className="w-[100%] h-10 border-0 bg-[#b6bbc4] hover:bg-[#6c6f72] text-[#fff] rounded-[7px] outline-none cursor-pointer"
        onClick={cancelLogin}
      >
        <span>Cancel</span>
      </button> */}
    </form>
  );
};

const LoginOtpDialog = ({
  open,
  closeOTPDialog,
  login,
}: {
  open: boolean;
  closeOTPDialog: (_cancelLogin: boolean) => void;
  login: (_info: any) => void;
}) => {
  const handleDialogView = (open: boolean | undefined) => {
    const dialog: HTMLDialogElement = document.getElementById(
      "loginotpdialog"
    ) as HTMLDialogElement;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  };

  useEffect(() => {
    handleDialogView(open);
  }, [open]);

  return (
    <dialog id="loginotpdialog" className="modal">
      <div>
        <LoginOtpForm
          open={open}
          closeOTPDialog={closeOTPDialog}
          login={login}
        />
      </div>
    </dialog>
  );
};

export default LoginOtpDialog;
