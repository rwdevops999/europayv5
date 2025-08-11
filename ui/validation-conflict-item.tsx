import PageTitle from "./page-title";

const ValidationConflictItem = ({ conflict }: { conflict: any }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex space-x-2 items-center">
          <label>Action:</label>
          <PageTitle title={`${conflict.action} (${conflict.service})`} />
        </div>
        <div className="block text-xs">
          <div className="block">
            <div>
              <label className="text-green-500">Allowed in:</label>
            </div>
            <div>
              <label>{conflict.allowedPath}</label>
            </div>
          </div>
          <div className="block">
            <div>
              <label className="text-red-500">Denied in:</label>
            </div>
            <div>
              <label>{conflict.deniedPath}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationConflictItem;
