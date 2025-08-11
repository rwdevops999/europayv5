import React from "react";
import FooterCopyright from "./footer-copyright";
import FooterSocialMedia from "./footer-social-media";

const Footer = () => {
  return (
    <div
      data-testid="footer"
      className="w-full flex items-center justify-between -mt-3"
    >
      <FooterCopyright />
      <FooterSocialMedia />
    </div>
  );
};

export default Footer;
