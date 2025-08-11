"use client";

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
}: {
  name: string;
  href: string;
  icon: ReactNode;
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
      />
    </div>
  );
};

const FooterSocialMedia = () => {
  return (
    <div data-testid="footer-social-media" className="flex space-x-2">
      {socialmedia.map((media: tSocialMedia) => {
        return (
          <FooterMediaButton
            key={media.name}
            name={media.name}
            href={media.href}
            icon={media.icon}
          />
        );
      })}
    </div>
  );
};

export default FooterSocialMedia;
