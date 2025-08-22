"use client";

import { menu, MenuItem } from "./menu";
import NavbarMenuItem from "./navbar-menu-item";

const NavbarMenu = () => {
  const renderComponent = () => {
    let adaptedmenu: MenuItem[] = menu;

    adaptedmenu = adaptedmenu.map((value: MenuItem) => {
      return value;
    });

    return (
      <ul
        data-testid="navbar-menu"
        className="menu menu-horizontal bg-base-200 rounded-box"
      >
        {adaptedmenu.map((menuitem: MenuItem) => (
          <NavbarMenuItem key={menuitem.title} menuitem={menuitem} />
        ))}
      </ul>
    );
  };

  return <>{renderComponent()}</>;
};

export default NavbarMenu;
