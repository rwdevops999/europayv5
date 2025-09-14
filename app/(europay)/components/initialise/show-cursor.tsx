"use client";

import { useInit } from "@/hooks/use-init";
import { useEffect } from "react";

const ShowCursor = ({ start }: { start: boolean }) => {
  const { setInit } = useInit();

  useEffect(() => {
    if (start) {
      setInit(true);
    }
  }, [start]);

  return null;
};

export default ShowCursor;
