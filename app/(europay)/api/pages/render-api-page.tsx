import React, { JSX } from "react";
import Page1 from "./page1";
import Page2 from "./page2";

const pages: JSX.Element[] = [<Page1 />, <Page2 />];

const RenderApiPage = ({ page }: { page: number }) => {
  return pages[page];
};

export default RenderApiPage;
