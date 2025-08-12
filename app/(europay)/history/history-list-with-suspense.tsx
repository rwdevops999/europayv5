import { loadHistory } from "@/app/server/history";
import HistoryList from "./history-list";
import { tHistory } from "@/lib/prisma-types";
import { Suspense } from "react";
import LoadingSpinner from "@/ui/loading-spinner";

const HistoryListLoader = async () => {
  const history = await loadHistory();

  return <HistoryList history={history} />;
};

const HistoryListWithSuspense = ({ history }: { history?: tHistory[] }) => {
  if (history) {
    return <HistoryList history={history} />;
  }

  return (
    <Suspense fallback={<LoadingSpinner label="loading..." />}>
      <HistoryListLoader />
    </Suspense>
  );
};

export default HistoryListWithSuspense;
