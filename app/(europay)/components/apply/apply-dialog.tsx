import { loadCountries } from "@/app/server/country";
import { ApplyData } from "@/app/server/data/apply-data";
import { Gender } from "@/generated/prisma";
import { DEFAULT_COUNTRY } from "@/lib/constants";
import { tCountry } from "@/lib/prisma-types";
import Button from "@/ui/button";
import CountrySelect from "@/ui/country-select";
import { FormEvent, useEffect, useState } from "react";
import { MdEmail, MdPassword } from "react-icons/md";

const ApplyForm = ({
  closeApplyDialog,
  apply,
  open,
}: {
  closeApplyDialog: (_cancelLogin: boolean) => void;
  apply: (_info: any) => void;
  open: boolean;
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

  const clearInputValue = (_id: string): string => {
    let result: string = "";

    let element: HTMLInputElement | null = document.getElementById(
      _id
    ) as HTMLInputElement;
    if (element) {
      element.value = "";
    }

    return result;
  };

  const handleSubmitForm = (e: FormEvent): void => {
    e.preventDefault();

    const data: ApplyData = {
      username: getInputValue("username"),
      firstname: getInputValue("firstname"),
      lastname: getInputValue("lastname"),
      email: getInputValue("email"),
      password: getInputValue("password"),
      gender: Gender[gender.toLocaleUpperCase() as keyof typeof Gender],
      country: country,
    };

    apply(data);
  };

  const [countries, setCountries] = useState<tCountry[]>([]);
  const [country, setCountry] = useState<string>(DEFAULT_COUNTRY);

  const [gender, setGender] = useState<string>("male");

  const handleSetGender = (event: any): void => {
    setGender(event.target.value);
  };

  const handleSetCountry = (_country: tCountry): void => {
    setCountry(_country.name);
  };

  const loadTheCountries = async (): Promise<void> => {
    setCountries(await loadCountries());
  };

  const focus = (_name: string) => {
    const element: HTMLElement | null = document.getElementById(_name);

    if (element) {
      window.setTimeout(() => {
        element.focus();
      }, 310);
    }
  };

  const resetAll = (): void => {
    clearInputValue("username");
    clearInputValue("firstname");
    clearInputValue("lastname");
    clearInputValue("email");
    clearInputValue("password");
    setCountry(DEFAULT_COUNTRY);
    setGender("male");

    focus("firstname");
  };

  const ignoreEscape = (): void => {
    addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  };

  useEffect(() => {
    ignoreEscape();
    loadTheCountries();
  }, []);

  useEffect(() => {
    resetAll();
  }, [open]);

  return (
    <form
      className="w-fit h-fit flex flex-col items-center justify-center gap-1 pt-12.5 pr-10 pb-5 pl-10 bg-base-100 rounded-md font-sans"
      onSubmit={(e) => handleSubmitForm(e)}
    >
      <span className="font-bold text-2xl">Apply for an account</span>
      <span className="text-[1rem] text-[#666]">
        Apply for an account with your email.
      </span>
      <div className="ml-0 grid justify-center overflow-hidden space-y-1 rounded-[0.5rem] mt-4 mr-0 mb-2">
        <div></div>
        <label className="ml-1 input">
          <input
            id="username"
            type="text"
            className="input-sm"
            placeholder="username (optional)"
          />
        </label>
        <label className="ml-1 input">
          <input
            id="firstname"
            type="text"
            className="input-sm"
            placeholder="firstname"
            required
          />
        </label>
        <label className="ml-1 input">
          <input
            id="lastname"
            type="text"
            className="input-sm"
            placeholder="lastname"
            required
          />
        </label>
        <label className="ml-1 input">
          <MdEmail />
          <input
            id="email"
            type="email"
            className="input-sm"
            placeholder="email"
            required
          />
        </label>
        <label className="ml-1 input">
          <MdPassword />
          <input
            id="password"
            type="password"
            className="input-sm"
            placeholder="password"
            required
            autoComplete="off"
          />
        </label>
        <select
          value={gender}
          className="ml-1 select h-8 block text-sm rounded-lg bg-base text-base-content"
          onChange={(e) => handleSetGender(e)}
        >
          <option>male</option>
          <option>female</option>
        </select>
        <CountrySelect
          countries={countries}
          handleSetCountry={handleSetCountry}
          selected={country}
          className="ml-1"
        />
        <div></div>
      </div>
      <div className="space-x-2">
        <Button name="Apply" className="bg-custom" size="small" type="submit" />
        <Button
          name="Cancel"
          type="button"
          className="bg-cancel"
          size="small"
          onClick={() => closeApplyDialog(false)}
        />
      </div>
    </form>
  );
};

const ApplyDialog = ({
  open,
  closeApplyDialog,
  apply,
}: {
  open: boolean;
  closeApplyDialog: (_cancelLogin: boolean) => void;
  apply: (_info: any) => void;
}) => {
  const handleDialogRender = (open: boolean | undefined) => {
    const dialog: HTMLDialogElement = document.getElementById(
      "applydialog"
    ) as HTMLDialogElement;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  };

  useEffect(() => {
    handleDialogRender(open);
  }, [open]);

  return (
    <dialog id="applydialog" className="modal">
      <div>
        <ApplyForm
          closeApplyDialog={closeApplyDialog}
          apply={apply}
          open={open}
        />
      </div>
    </dialog>
  );
};

export default ApplyDialog;
