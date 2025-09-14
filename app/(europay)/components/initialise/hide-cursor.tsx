"use client";

import { useEffect } from "react";

const HideCursor = () => {
  const hideCursor = async (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      document.documentElement.style.cursor = "none";

      setTimeout(() => {
        resolve();
      }, 50);
    });
  };

  const hideTheCursor = async (): Promise<void> => {
    await hideCursor().then(() => console.log("CURSOR HIDDEN"));
  };

  useEffect(() => {
    hideTheCursor();
  }, []);

  return null;
};

export default HideCursor;
