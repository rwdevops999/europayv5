"use client";

import React from "react";
import FooterCopyright from "./footer-copyright";
import FooterSocialMedia from "./footer-social-media";
import { useUser } from "@/hooks/use-user";
import { $iam_user_has_action } from "@/app/client/iam-access";
import clsx from "clsx";

const Footer = () => {
  const { user } = useUser();

  const socialMediaVisible: boolean = $iam_user_has_action(
    user,
    "europay",
    "View Social Media"
  );

  return (
    <div
      data-testid="footer"
      className={clsx(
        "w-full flex items-center justify-between",
        { "-mt-2.5": socialMediaVisible },
        { "": !socialMediaVisible }
      )}
    >
      <FooterCopyright />
      {socialMediaVisible && <FooterSocialMedia />}
    </div>
  );
};

export default Footer;
