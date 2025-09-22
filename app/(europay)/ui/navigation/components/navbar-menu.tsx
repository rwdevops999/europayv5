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

  const setMenuVisibilities = (_menu: MenuItem[]): void => {
    let newmenu: MenuItem[] = [..._menu];

    // Dashboard menu
    newmenu[0].visible = $iam_user_has_action(
      user,
      "europay",
      "Dashboard Menu",
      true
    );

    // Lists menu
    newmenu[1].visible = $iam_user_has_action(user, "europay", "Lists Menu");
    if (newmenu[1].visible && newmenu[1].subItems) {
      // Tasks
      newmenu[1].subItems[0].visible = $iam_user_has_action(
        user,
        "europay:lists",
        "Task Submenu"
      );
      // Jobs
      newmenu[1].subItems[1].visible = $iam_user_has_action(
        user,
        "europay:lists",
        "Job Submenu"
      );

      // Transactions
      newmenu[1].subItems[2].visible = $iam_user_has_action(
        user,
        "europay:lists",
        "Transaction Submenu"
      );

      // History
      newmenu[1].subItems[3].visible = $iam_user_has_action(
        user,
        "europay:lists",
        "History Submenu"
      );

      // Exports
      // newmenu[1].subItems[4].visible = $iam_user_has_action(
      //   user,
      //   "europay:lists",
      //   "Export Submenu",
      //   true
      // );
    }

    // Settings
    newmenu[2].visible = $iam_user_has_action(user, "europay", "Settings Menu");
    if (newmenu[2].visible && newmenu[2].subItems) {
      // General
      newmenu[2].subItems[0].visible = $iam_user_has_action(
        user,
        "europay:settings",
        "General Submenu"
      );

      // Storage
      newmenu[2].subItems[1].visible = $iam_user_has_action(
        user,
        "europay:settings",
        "Storage Submenu"
      );

      // Limits
      newmenu[2].subItems[2].visible = $iam_user_has_action(
        user,
        "europay:settings",
        "Limits Submenu"
      );

      // Export
      newmenu[2].subItems[3].visible = $iam_user_has_action(
        user,
        "europay:settings",
        "Export Submenu"
      );

      // Import
      newmenu[2].subItems[4].visible = $iam_user_has_action(
        user,
        "europay:settings",
        "Import Submenu"
      );
    }

    // Admin
    newmenu[3].visible = $iam_user_has_action(user, "europay", "Admin Menu");

    // User
    newmenu[4].visible = $iam_user_has_action(user, "europay", "User Menu");

    // IAM
    newmenu[5].visible = $iam_user_has_action(
      user,
      "europay",
      "IAM Menu",
      true
    );
    if (newmenu[5].visible && newmenu[5].subItems) {
      // Services
      newmenu[5].subItems[0].visible = $iam_user_has_action(
        user,
        "europay:iam",
        "Services",
        true
      );

      // Statements
      newmenu[5].subItems[1].visible = $iam_user_has_action(
        user,
        "europay:iam",
        "Statements"
      );

      // Policies
      newmenu[5].subItems[2].visible = $iam_user_has_action(
        user,
        "europay:iam",
        "Policies"
      );

      // Roles
      newmenu[5].subItems[3].visible = $iam_user_has_action(
        user,
        "europay:iam",
        "Roles"
      );

      // Users
      newmenu[5].subItems[4].visible = $iam_user_has_action(
        user,
        "europay:iam",
        "Users"
      );

      // Groups
      newmenu[5].subItems[5].visible = $iam_user_has_action(
        user,
        "europay:iam",
        "Groups"
      );
    }

    // Manual
    newmenu[6].visible = $iam_user_has_action(
      user,
      "europay",
      "Manual Menu",
      true
    );

    // API
    newmenu[7].visible = $iam_user_has_action(
      user,
      "europay",
      "API Menu",
      true
    );

    setAdaptedMenu(newmenu);
  };

  useEffect(() => {
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
