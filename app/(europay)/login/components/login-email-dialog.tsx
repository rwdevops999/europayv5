import { useProgressBar } from "@/hooks/use-progress-bar";
import Button from "@/ui/button";
import { useRouter } from "next/navigation";
import { FormEvent, startTransition, useEffect } from "react";
import { MdAlternateEmail } from "react-icons/md";

export type tApplyInformation = {
  username: string;
  email: string;
  password: string;
};

const LoginEmailForm = ({
  closeEmailDialog,
  login,
}: {
  closeEmailDialog: (_cancelLogin: boolean) => void;
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

  let submitForm: boolean = true;

  const handleSubmitForm = (e: FormEvent): void => {
    e.preventDefault();

    if (submitForm) {
      let emailOrUsername: string = getInputValue("email");
      closeEmailDialog(false);
      login(emailOrUsername);
    }
    // } else {
    //   redirect(absoluteUrl("/"));
    // }
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

  const handleCancelLogin = () => {
    submitForm = false;

    deactivateRequiredElement("email");
    closeEmailDialog(true);
  };

  useEffect(() => {
    submitForm = true;
    const element: HTMLElement | null = document.getElementById("email");

    if (element) {
      window.setTimeout(() => {
        element.focus();
      }, 310);
    }

    addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }, []);

  return (
    <form
      className="w-fit h-fit flex flex-col items-center justify-center gap-1 pt-12.5 pr-10 pb-5 pl-10 bg-login-pattern rounded-md font-sans"
      onSubmit={(e) => handleSubmitForm(e)}
    >
      <div className="flex flex-col items-center justify-center gap-2.5">
        <p className="m-0 text-[1.25rem] font-bold text-[#212121]">
          Login to your Account
        </p>
        <p className="m-0 text-[1.25rem] font-bold text-[#212121]">
          (use your username or email)
        </p>
        <span className="max-w-[80%] text-center text-xs text-[#8B8E89]">
          Get started with Europay, just apply for an account and enjoy the
          experience.
        </span>
      </div>
      <br />
      <div className="w-[100%] h-fit relative flex flex-col gap-1.25">
        <label className="ml-5 input w-11/12">
          <input
            id="email"
            data-prevent-modal-close-on-escape="true"
            type="text"
            required
            className="validator"
            placeholder="email..."
          />
        </label>
      </div>
      <Button
        size="small"
        name="Sign in"
        type="submit"
        className="mt-5 bg-login-button"
      />
      <Button
        size="small"
        name="Cancel"
        type="button"
        className="hover:bg-[#6c6f72]"
        onClick={handleCancelLogin}
      />
    </form>
  );
};

const LoginEmailDialog = ({
  open,
  closeEmailDialog,
  login,
}: {
  open: boolean;
  closeEmailDialog: (_cancelLogin: boolean) => void;
  login: (_info: any) => void;
}) => {
  const handleDialogView = (open: boolean | undefined) => {
    const dialog: HTMLDialogElement = document.getElementById(
      "loginemaildialog"
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
    // <div className="w-[100vw] h-[100vh] flex items-center justify-center">
    <dialog id="loginemaildialog" className="modal">
      <div>
        <LoginEmailForm closeEmailDialog={closeEmailDialog} login={login} />
      </div>
    </dialog>
    // </div>
  );
};

export default LoginEmailDialog;
