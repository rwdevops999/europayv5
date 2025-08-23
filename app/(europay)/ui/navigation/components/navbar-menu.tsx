"use client";

import { json } from "@/lib/util";
import { menu, MenuItem } from "./menu";
import NavbarMenuItem from "./navbar-menu-item";
import { $iam_user_has_action } from "@/app/client/iam-access";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";

const NavbarMenu = () => {
  const { user } = useUser();

  const [adaptedmenu, setAdaptedMenu] = useState<MenuItem[]>([]);

  const setMenuVisibilities = (_menu: MenuItem[]): MenuItem[] => {
    let newmenu: MenuItem[] = [..._menu];

    // Dahsboard menu
    newmenu[0].visible = $iam_user_has_action(user, "View Dashboard", true);

    // Lists menu
    newmenu[1].visible = $iam_user_has_action(user, "View Lists", true);
    if (newmenu[1].visible && newmenu[1].subItems) {
      // Tasks
      newmenu[1].subItems[0].visible = $iam_user_has_action(user, "Show Tasks");
      // Jobs
      newmenu[1].subItems[1].visible = $iam_user_has_action(user, "Show Jobs");
      // Transaction
      // menu[1].subItems[2].visible = $iam_user_has_action(user, "Show ...");

      // History
      newmenu[1].subItems[3].visible = $iam_user_has_action(
        user,
        "Show History",
        true
      );

      // Exports
      // newmenu[1].subItems[4].visible = $iam_user_has_action(user, "Show History", true);
    }

    // Settings
    newmenu[2].visible = $iam_user_has_action(user, "View Settings", true);
    if (newmenu[2].visible && newmenu[2].subItems) {
      // General
      newmenu[2].subItems[0].visible = $iam_user_has_action(
        user,
        "Show General"
      );

      // Storage
      newmenu[2].subItems[1].visible = $iam_user_has_action(
        user,
        "Show Storage"
      );

      // Limits
      newmenu[2].subItems[2].visible = $iam_user_has_action(
        user,
        "Show Limits"
      );

      // Export
      newmenu[2].subItems[3].visible = $iam_user_has_action(
        user,
        "Show Export",
        true
      );

      // Import
      newmenu[2].subItems[4].visible = $iam_user_has_action(
        user,
        "Show Import"
      );
    }

    // Admin
    // newmenu[3].visible = $iam_user_has_action(user, "View Settings");

    // User
    // newmenu[4].visible = $iam_user_has_action(user, "View Settings");

    // IAM
    newmenu[5].visible = $iam_user_has_action(user, "View IAM", true);
    if (newmenu[5].visible && newmenu[5].subItems) {
      // Services
      newmenu[5].subItems[0].visible = $iam_user_has_action(
        user,
        "Show Services",
        true
      );

      // Statements
      newmenu[5].subItems[1].visible = $iam_user_has_action(
        user,
        "Handle Statements",
        true
      );

      // Policies
      newmenu[5].subItems[2].visible = $iam_user_has_action(
        user,
        "Handle Policies",
        true
      );

      // Roles
      newmenu[5].subItems[3].visible = $iam_user_has_action(
        user,
        "Handle Roles",
        true
      );

      // Users
      newmenu[5].subItems[4].visible = $iam_user_has_action(
        user,
        "Handle Users",
        true
      );

      // Groups
      newmenu[5].subItems[5].visible = $iam_user_has_action(
        user,
        "Handle Groups",
        true
      );
    }

    // Manual
    newmenu[6].visible = $iam_user_has_action(user, "View Manual", true);

    setAdaptedMenu(newmenu);
    console.log("NEW ADAPTED MENU", json(newmenu));
  };

  useEffect(() => {
    console.log("HANDLE MENU", user);
    setMenuVisibilities(menu);
  }, [user]);

  const renderComponent = () => {
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
