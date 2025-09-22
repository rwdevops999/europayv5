"use client";

import React, { JSX, useEffect } from "react";
import ParseContent from "./parse-content";
import { useTheme } from "@/hooks/use-theme";
import { loadApiContentFromFile } from "@/app/server/api";

export type tHTML = {
  htmlText: string;
  params?: any;
};

const html: tHTML = {
  htmlText: "<h1>TEST</h1>",
};

const Page1 = () => {
  const { theme } = useTheme();

  const renderToHTML = async (_html: string, _theme: string): Promise<void> => {
    const html: tHTML = {
      htmlText: await loadApiContentFromFile(_html),
    };

    const element: HTMLIFrameElement | null = document.getElementById(
      "iframe"
    ) as HTMLIFrameElement;

    if (element) {
      const y = element.contentDocument;
      if (y) {
        if (y.documentElement) {
          y.documentElement.style.color =
            _theme === "light" ? "black" : "white";
          y.documentElement.innerHTML = html.htmlText;
        }
      }
    }
  };

  // useEffect(() => {
  //   renderToHTML("page1.html", theme);
  // }, [theme]);

  const renderPage = (): JSX.Element => {
    renderToHTML("page1.html", theme);

    return <></>;
  };

  const RenderApiPage = (): JSX.Element => {
    return (
      <div className="w-[100%] h-[100%]">
        <iframe className="overflow-auto" id="iframe" />
      </div>
    );
  };

  return (
    <div className="w-[100%] h-[92%]">
      <RenderApiPage />
      {renderPage()}
    </div>
  );
};

export default Page1;
