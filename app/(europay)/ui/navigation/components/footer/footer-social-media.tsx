"use client";

import { $iam_user_has_action } from "@/app/client/iam-access";
import { useUser } from "@/hooks/use-user";
import Button from "@/ui/button";
import React, { ReactNode } from "react";
import { RiFacebookFill } from "react-icons/ri";
import { RiTwitterXLine } from "react-icons/ri";
import { RiLinkedinFill } from "react-icons/ri";
import { RiInstagramLine } from "react-icons/ri";

type tSocialMedia = {
  name: string;
  href: string;
  icon: ReactNode;
};

export const socialmedia: tSocialMedia[] = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: <RiFacebookFill size={16} />,
  },
  {
    name: "Twitter",
    href: "https://x.com/",
    icon: <RiTwitterXLine size={16} />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: <RiLinkedinFill size={16} />,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: <RiInstagramLine size={16} />,
  },
];

const FooterMediaButton = ({
  name,
  href,
  icon,
  disabled,
}: {
  name: string;
  href: string;
  icon: ReactNode;
  disabled: boolean;
}) => {
  const navigateToDestination = () => {
    window.location.href = href;
  };

  return (
    <div className="flex space-x-2">
      <Button
        data-testid={name}
        // intent="accent"
        className="text-gray-500 dark:text-gray-400"
        style="link"
        icon={icon}
        onClick={navigateToDestination}
        disabled={disabled}
      />
    </div>
  );
};

const FooterSocialMedia = () => {
  const { user } = useUser();

  return (
    <div data-testid="footer-social-media" className="flex space-x-2">
      {socialmedia.map((media: tSocialMedia) => {
        return (
          <FooterMediaButton
            key={media.name}
            name={media.name}
            href={media.href}
            icon={media.icon}
            disabled={
              !$iam_user_has_action(user, "europay:socialmedia", "Execute")
            }
          />
        );
      })}
    </div>
  );
};

export default FooterSocialMedia;
