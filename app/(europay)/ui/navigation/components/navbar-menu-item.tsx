"use client";

import { MenuItem } from "./menu";
import AppLink from "./app-link";
import clsx from "clsx";

let openItem: string = "";

const NavbarMenuItem = ({ menuitem }: { menuitem: MenuItem }) => {
  const handleItem = (item: string): void => {
    if (item !== "") {
      const element: HTMLElement | null = document.getElementById(
        `details${item}`
      );

      if (element) {
        if (element.hasAttribute("open")) {
          element.removeAttribute("open");
          openItem = "";
        } else {
          element.setAttribute("open", "true");
          openItem = item;
        }
      }
    }
  };

  const handleClick = (
    index: number,
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    title: string | undefined,
    href?: string
  ) => {
    if (title) {
      e.preventDefault();
      e.stopPropagation();
      if (openItem !== title) {
        handleItem(openItem);
        handleItem(title);
      } else {
        handleItem(title);
      }

      if (href) {
        window.location.href = href;
      }
    }
  };

  if (menuitem.subItems && menuitem.subItems.length > 0) {
    if (menuitem.visible) {
      return (
        <li suppressHydrationWarning>
          <details
            id={`details${menuitem.title}`}
            data-testid={`${menuitem.title.toLocaleLowerCase()}-menu`}
            onClick={(e) => handleClick(1, e, menuitem.title)}
            suppressHydrationWarning
          >
            <summary>
              {menuitem.icon}&nbsp;{menuitem.title}
            </summary>
            <ul className="border-1 border-gray-500 z-50 menu-dropdown">
              {menuitem.subItems.map((menuitem: MenuItem) => (
                <NavbarMenuItem key={menuitem.title} menuitem={menuitem} />
              ))}
            </ul>
          </details>
        </li>
      );
    } else {
      return null;
    }
  } else {
    if (menuitem.visible) {
      return (
        <li>
          <AppLink
            data-testid={`${menuitem.title.toLocaleLowerCase()}-menuitem`}
            href={menuitem.url}
            className={clsx("", {
              "text-gray-500 hover:bg-transparent": menuitem.disabled,
            })}
            onClick={(e) =>
              handleClick(2, e, menuitem.parent ?? menuitem.title, menuitem.url)
            }
          >
            {menuitem.icon}&nbsp;{menuitem.title}
          </AppLink>
        </li>
      );
    } else {
      return null;
    }
  }
};

export default NavbarMenuItem;
