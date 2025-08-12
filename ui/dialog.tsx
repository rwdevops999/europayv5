import React, { JSX, ReactNode, useEffect } from "react";
import PageTitle from "./page-title";
import { Separator } from "./radix/separator";
import { cn } from "@/lib/util";

const Dialog = ({
  id,
  title,
  className,
  form,
}: {
  id: string;
  title?: string;
  className?: string;
  form?: ReactNode;
}) => {
  return (
    <dialog id={id} className="modal">
      <div className={cn("modal-box", className)}>
        {title && (
          <>
            <PageTitle title={title} className="mb-2" />
            <Separator />
          </>
        )}
        <div className="mt-2">{form}</div>
      </div>
    </dialog>
  );
};

export default Dialog;
