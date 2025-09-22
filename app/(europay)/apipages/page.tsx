"use client";

import React, { JSX, useState } from "react";
import RenderApiPage from "./pages/render-api-page";
import { ApiItem, apimenu } from "./pages/api-menu";
import { json } from "@/lib/util";

const ApiPage = () => {
  const [page, setPage] = useState<number>(0);

  const renderItem = (item: ApiItem): JSX.Element => {
    if (item.subitems.length > 0) {
      return (
        <details>
          <summary>{item.title}</summary>
          <ul>{renderMenu(item.subitems)}</ul>
        </details>
      );
    } else {
      if (item.disabled) {
        return <a className="text-neutral-content/60">{item.title}</a>;
      } else {
        return <a onClick={() => setPage(item.page!)}>{item.title}</a>;
      }
    }
  };

  const renderMenu = (_menu: ApiItem[]): JSX.Element => {
    return (
      <ul className="text-sm">
        {_menu.map((item: ApiItem) =>
          item.disabled ? (
            <li key={item.id} className="menu-disabled">
              {renderItem(item)}
            </li>
          ) : (
            <li key={item.id}>{renderItem(item)}</li>
          )
        )}
      </ul>
    );
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-start justify-start">
        <RenderApiPage page={page} />
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          API
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-60 p-4">
          <li>{renderMenu(apimenu)}</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiPage;
