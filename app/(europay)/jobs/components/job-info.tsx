import React from "react";

const JobInfo = ({ selectedJobs }: { selectedJobs: number }) => {
  return (
    <div className="ml-2 flex items-center space-x-2">
      <label>selected jobs:</label>
      <label className="font-extrabold italic">{selectedJobs}</label>
    </div>
  );
};

export default JobInfo;
