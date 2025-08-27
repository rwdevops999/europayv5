"use client";

import { useEffect } from "react";

const EnableCursor = ({ start }: { start: boolean }) => {
  useEffect(() => {
    if (start) {
      document.documentElement.style.cursor = "auto";
    }
  }, [start]);

  return null;
};

export default EnableCursor;
