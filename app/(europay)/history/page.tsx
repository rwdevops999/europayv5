import { loadHistory } from "@/app/server/history";
import { tHistory } from "@/lib/prisma-types";
import HistoryListWithSuspense from "./history-list-with-suspense";

const HistoryPage = async () => {
  const history: tHistory[] = await loadHistory();

  return <HistoryListWithSuspense history={history} />;
};

export default HistoryPage;
