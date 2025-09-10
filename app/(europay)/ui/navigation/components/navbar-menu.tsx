"use client";

import { json } from "@/lib/util";
import { menu, MenuItem } from "./menu";
import NavbarMenuItem from "./navbar-menu-item";
import { $iam_user_has_action } from "@/app/client/iam-access";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";

const iamvisible: boolean = true;

const NavbarMenu = () => {
  const { user } = useUser();

  const [adaptedmenu, setAdaptedMenu] = useState<MenuItem[]>([]);

  const setMenuVisibilities = (_menu: MenuItem[]): void => {
    let newmenu: MenuItem[] = [..._menu];

    // Dashboard menu
    newmenu[0].visible = $iam_user_has_action(
      user,
      "europay",
      "View Dashboard",
      true
    );

    // Lists menu
    newmenu[1].visible = $iam_user_has_action(
      user,
      "europay",
      "View Lists",
      true
    );
    if (newmenu[1].visible && newmenu[1].subItems) {
      // Tasks
      newmenu[1].subItems[0].visible = $iam_user_has_action(
        user,
        "europay:lists",
        "Show Tasks"
      );
      // Jobs
      newmenu[1].subItems[1].visible = $iam_user_has_action(
        user,
        "europay:lists",
        "Show Jobs",
        true
      );
      // Transaction
      // menu[1].subItems[2].visible = $iam_user_has_action(user, "Show ...");

      // History
      newmenu[1].subItems[3].visible = $iam_user_has_action(
        user,
        "europay:lists",
        "Show History",
        true
      );

      // Exports
      // newmenu[1].subItems[4].visible = $iam_user_has_action(user, "Show History", true);
    }

    // Settings
    newmenu[2].visible = $iam_user_has_action(user, "europay", "View Settings");
    if (newmenu[2].visible && newmenu[2].subItems) {
      // General
      newmenu[2].subItems[0].visible = $iam_user_has_action(
        user,
        "europay:settings",
        "Show General"
      );

      // Storage
      newmenu[2].subItems[1].visible = $iam_user_has_action(
        user,
        "europay:settings",
        "Show Storage"
      );

      // Limits
      newmenu[2].subItems[2].visible = $iam_user_has_action(
        user,
        "europay:settings",
        "Show Limits"
      );

      // Export
      newmenu[2].subItems[3].visible = $iam_user_has_action(
        user,
        "europay:settings",
        "Show Export"
      );

      // Import
      newmenu[2].subItems[4].visible = $iam_user_has_action(
        user,
        "europay:settings",
        "Show Import"
      );
    }

    // Admin
    newmenu[3].visible = $iam_user_has_action(user, "europay", "View Admin");

    // User
    newmenu[4].visible = $iam_user_has_action(
      user,
      "europay",
      "View User",
      true
    );

    // IAM
    newmenu[5].visible = $iam_user_has_action(
      user,
      "europay",
      "View IAM",
      true
    );
    if (newmenu[5].visible && newmenu[5].subItems) {
      // Services
      newmenu[5].subItems[0].visible = $iam_user_has_action(
        user,
        "europay:iam",
        "Show Services",
        true
      );

      // Statements
      newmenu[5].subItems[1].visible = $iam_user_has_action(
        user,
        "europay:iam",
        "Handle Statements",
        iamvisible
      );

      // Policies
      newmenu[5].subItems[2].visible = $iam_user_has_action(
        user,
        "europay:iam",
        "Handle Policies",
        iamvisible
      );

      // Roles
      newmenu[5].subItems[3].visible = $iam_user_has_action(
        user,
        "europay:iam",
        "Handle Roles",
        iamvisible
      );

      // Users
      newmenu[5].subItems[4].visible = $iam_user_has_action(
        user,
        "europay:iam",
        "Handle Users",
        iamvisible
      );

      // Groups
      newmenu[5].subItems[5].visible = $iam_user_has_action(
        user,
        "europay:iam",
        "Handle Groups",
        iamvisible
      );
    }

    // Manual
    newmenu[6].visible = $iam_user_has_action(
      user,
      "europay",
      "View Manual",
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
