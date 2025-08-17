import Button from "@/ui/button";
import React from "react";

const ConfirmDialog = ({
  plural,
  handleOK,
  handleCancel,
}: {
  plural: boolean;
  handleOK: () => any;
  handleCancel: () => any;
}) => {
  const titlepart: string = plural ? "Jobs" : "Job";
  const sentencepart: string = plural ? "those jobs" : "this job";
  const questionpart: string = plural ? "They" : "It";

  return (
    <dialog id="confirmdialog" className="modal">
      <div className="modal-box border-2 border-orange-500">
        <h3 className="flex justify-center">{`Delete ${titlepart}?`}</h3>
        <br />
        <div className="flex justify-center">
          <p>{`Are you sure to delete ${sentencepart}?`}</p>
        </div>
        <div className="flex justify-center">
          <p>{`${questionpart} can't be recreated manually?`}</p>
        </div>
        <br />
        <div className="flex items-center justify-center space-x-2">
          <Button
            name="Yes"
            style="soft"
            size="small"
            intent="warning"
            onClick={handleOK}
          />
          <Button
            name="No"
            style="soft"
            size="small"
            className="bg-cancel"
            onClick={handleCancel}
          />
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
