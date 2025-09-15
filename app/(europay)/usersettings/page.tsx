import { Suspense } from "react";
import LoadingSpinner from "@/ui/loading-spinner";
import HandleUserSettings from "./handle-user-settings";

const UserSettingsDialog = ({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) => {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading User Settings ..." />}>
      <HandleUserSettings searchParams={searchParams} />
    </Suspense>
  );
};

export default UserSettingsDialog;
