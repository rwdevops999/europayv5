"use client";
import React, { useEffect, useState } from "react";
import NavbarMenu from "./components/navbar-menu";
import { menu } from "./components/menu";
import { $iam_user_has_action } from "@/app/client/iam-access";
import { useUser } from "@/hooks/use-user";

const NavbarCenter = () => {
  const { user } = useUser();

  const [menuInitiaised, setMenuInitialised] = useState<boolean>(false);

  const setMenuVisibilities = (): void => {
    // Dahsboard menu
    menu[0].visible = $iam_user_has_action(user, "View Dashboard", true);

    // Lists menu
    menu[1].visible = $iam_user_has_action(user, "View Lists", true);
    if (menu[1].visible && menu[1].subItems) {
      // Tasks
      menu[1].subItems[0].visible = $iam_user_has_action(user, "Show Tasks");
      // Jobs
      menu[1].subItems[1].visible = $iam_user_has_action(user, "Show Jobs");
      // Transaction
      // menu[1].subItems[2].visible = $iam_user_has_action(user, "Show ...");

      // History
      menu[1].subItems[3].visible = $iam_user_has_action(
        user,
        "Show History",
        true
      );

      // Exports
      // menu[1].subItems[4].visible = $iam_user_has_action(user, "Show History", true);
    }

    // Settings
    menu[2].visible = $iam_user_has_action(user, "View Settings");
    if (menu[2].visible && menu[2].subItems) {
      // General
      menu[2].subItems[0].visible = $iam_user_has_action(user, "Show General");

      // Storage
      menu[2].subItems[0].visible = $iam_user_has_action(user, "Show Storage");

      // Limits
      menu[2].subItems[0].visible = $iam_user_has_action(user, "Show Limits");

      // Export
      menu[2].subItems[0].visible = $iam_user_has_action(user, "Show Export");

      // Import
      menu[2].subItems[0].visible = $iam_user_has_action(user, "Show Import");
    }

    // Admin
    // menu[3].visible = $iam_user_has_action(user, "View Settings");

    // User
    // menu[4].visible = $iam_user_has_action(user, "View Settings");

    // IAM
    menu[5].visible = $iam_user_has_action(user, "View IAM", true);
    if (menu[5].visible && menu[5].subItems) {
      // Services
      menu[5].subItems[0].visible = $iam_user_has_action(
        user,
        "Show Services",
        true
      );

      // Statements
      menu[5].subItems[1].visible = $iam_user_has_action(
        user,
        "Handle Statements"
      );

      // Policies
      menu[5].subItems[2].visible = $iam_user_has_action(
        user,
        "Handle Policies"
      );

      // Roles
      menu[5].subItems[3].visible = $iam_user_has_action(user, "Handle Roles");

      // Users
      menu[5].subItems[4].visible = $iam_user_has_action(user, "Handle Users");

      // Groups
      menu[5].subItems[5].visible = $iam_user_has_action(user, "Handle Groups");
    }

    // Manual
    menu[6].visible = $iam_user_has_action(user, "View Manual", true);

    setMenuInitialised(true);
  };

  useEffect(() => {
    console.log("Setting Menu Visibilities");
    setMenuVisibilities();
  }, []);

  return (
    <div data-testid="navbar-center">{menuInitiaised && <NavbarMenu />}</div>
  );
};

export default NavbarCenter;
