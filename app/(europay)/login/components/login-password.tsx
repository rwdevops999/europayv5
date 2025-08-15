import { useProgressBar } from "@/hooks/use-progress-bar";
import { absoluteUrl } from "@/lib/util";
import Button from "@/ui/button";
import { useRouter } from "next/navigation";
import { FormEvent, startTransition, useEffect } from "react";
import { PiPasswordLight } from "react-icons/pi";

export type tApplyInformation = {
  username: string;
  email: string;
  password: string;
};

const LoginPasswordForm = ({
  open,
  closePasswordDialog,
  login,
}: {
  open: boolean;
  closePasswordDialog: (_cancellogin: boolean) => void;
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

  const deactivateRequiredElement = (_element: string) => {
    let element: HTMLInputElement | null = document.getElementById(
      _element
    ) as HTMLInputElement;
    if (element) {
      element.required = false;
    }
  };

  const progress = useProgressBar();
  const { push } = useRouter();

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
      let password: string = getInputValue("password");

      login(password);

      closePasswordDialog(false);
    } else {
      redirect(absoluteUrl("/"));
    }
  };

  const cancelLogin = () => {
    submitForm = false;

    deactivateRequiredElement("password");

    closePasswordDialog(true);
  };

  let submitForm: boolean = true;

  useEffect(() => {
    submitForm = true;

    document.getElementById("password")?.focus();
  }, []);

  useEffect(() => {
    submitForm = true;

    const element: HTMLElement | null = document.getElementById("password");
    if (element) {
      window.setTimeout(() => {
        element.focus();
      }, 320);
    }
  }, [open]);

  return (
    <form
      className="w-fit h-fit flex flex-col items-center justify-center gap-1 pt-12.5 pr-10 pb-5 pl-10 bg-login-pattern rounded-md font-sans"
      onSubmit={(e) => handleSubmitForm(e)}
    >
      <div className="flex flex-col items-center justify-center gap-2.5">
        <p className="m-0 text-[1.25rem] font-bold text-[#212121]">
          Login to your Account
        </p>
        <span className="max-w-[80%] text-center text-xs text-[#8B8E89]">
          Enter the your password.
        </span>
      </div>
      <br />
      <div className="w-[100%] h-fit relative flex flex-col gap-1.25">
        <label className="input">
          <PiPasswordLight size={16} />
          <input
            id="password"
            required
            type="password"
            className="grow"
            placeholder="password..."
            autoComplete="off"
          />
        </label>
      </div>
      <Button
        size="small"
        name="Sign In"
        type="submit"
        className="mt-5 bg-login-button"
      />
      {/* <button
        title="Sign In"
        type="submit"
        className="w-[100%] h-10 border-0 bg-login-button hover:bg-[#005ce6] text-[#fff] rounded-[7px] outline-none cursor-pointer"
      >
        <span>Sign In</span>
      </button> */}
      <Button
        size="small"
        name="Cancel"
        type="button"
        onClick={cancelLogin}
        className="hover:bg-[#6c6f72]"
      />
      {/* <button
        title="Cancel"
        className="w-[100%] h-10 border-0 bg-[#b6bbc4] hover:bg-[#6c6f72] text-[#fff] rounded-[7px] outline-none cursor-pointer"
        onClick={cancelLogin}
      >
        <span>Cancel</span>
      </button> */}
    </form>
  );
};

const LoginPasswordDialog = ({
  open,
  closePasswordDialog,
  login,
}: {
  open: boolean;
  closePasswordDialog: (_cancelLogin: boolean) => void;
  login: (_info: any) => void;
}) => {
  const handleDialogView = (open: boolean | undefined) => {
    const dialog: HTMLDialogElement = document.getElementById(
      "loginpassworddialog"
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
    <dialog id="loginpassworddialog" className="modal">
      <div>
        <LoginPasswordForm
          open={open}
          closePasswordDialog={closePasswordDialog}
          login={login}
        />
      </div>
    </dialog>
  );
};

export default LoginPasswordDialog;
