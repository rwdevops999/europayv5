"use client";

import Button from "@/ui/button";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useRef } from "react";
import { GrToast } from "react-icons/gr";
import { MdHistoryEdu } from "react-icons/md";
import { PiMarkdownLogoDuotone } from "react-icons/pi";

export interface UserSettingsCarrouselProps {}

enum Pages {
  TOAST = "toast",
  HISTORY = "history",
  MARKDOWN = "markdown",
}

const UserSettingsCarrousel = (props: UserSettingsCarrouselProps) => {
  const { back } = useRouter();

  const currentPage = useRef<string>(Pages.TOAST);
  const showCurrentPage = (_page: string): void => {
    const element: HTMLElement | null = document.getElementById(_page);
    if (element) {
      element.scrollIntoView({ behavior: "instant" });
    }
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
    currentPage.current = Pages.TOAST;
    showCurrentPage(Pages.TOAST);
  }, [props]);

  const handleToastPage = (): void => {
    currentPage.current = Pages.TOAST;
    location.href = "#toast";
  };

  const handleHistoryPage = (): void => {
    currentPage.current = Pages.HISTORY;
    location.href = "#history";
  };

  const handleMarkdownPage = (): void => {
    currentPage.current = Pages.MARKDOWN;
    location.href = "#markdown";
  };

  const Carrousel = (): JSX.Element => {
    return (
      <>
        <div id="carrousel" className="relative h-[95%] carousel w-full">
          <div id="toast" className="carousel-item w-full">
            <label>TOAST</label>
          </div>
          <div id="history" className="carousel-item w-full">
            <label>HISTORY</label>
          </div>
          <div id="markdown" className="carousel-item w-full">
            <label>MARKDOWN</label>
          </div>
        </div>
        <div className="flex w-full justify-center gap-2 py-2">
          <button
            type="button"
            onClick={handleToastPage}
            className="flex items-center space-x-2"
          >
            <GrToast size={16} />
            <label className="cursor-pointer text-xs">Toast</label>
          </button>

          <button
            type="button"
            onClick={handleHistoryPage}
            className="flex items-center space-x-2"
          >
            <MdHistoryEdu size={16} />
            <label className="cursor-pointer text-xs">History</label>
          </button>

          <button
            type="button"
            onClick={handleMarkdownPage}
            className="flex items-center space-x-2"
          >
            <PiMarkdownLogoDuotone size={16} />
            <label className="cursor-pointer text-xs">Markdown</label>
          </button>
        </div>
      </>
    );
  };

  // const onSubmit: SubmitHandler<UserEntity> = async (formData: UserEntity) => {
  // };

  const handleCancelClick = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "usersettingsdialog"
    ) as HTMLDialogElement;

    dialog.close();

    back();
  };

  const Buttons = (): JSX.Element => {
    return (
      <div className="flex flex-col">
        <Button
          id="cancelbutton"
          name="Cancel"
          intent={"neutral"}
          style={"soft"}
          size={"small"}
          onClick={handleCancelClick}
          className="bg-cancel"
          type="button"
        />
        <Button
          id="savebutton"
          name="Save"
          intent={"neutral"}
          style={"soft"}
          size={"small"}
          className="bg-custom"
          type="submit"
        />
      </div>
    );
  };

  const renderComponent = () => {
    return (
      <>
        {/* <div className="hidden">{reload}</div> */}
        <form
          onSubmit={() => {}}
          className="relative w-[100%] h-[450px] grid grid-cols-[90%_10%]"
        >
          <div>
            <Carrousel />
          </div>
          <div className="flex justify-end">
            <Buttons />
          </div>
        </form>
      </>
    );
  };

  return <>{renderComponent()}</>;
};

export default UserSettingsCarrousel;
