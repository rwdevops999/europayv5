import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import PageItemContainer from "@/ui/page-item-container";
import UserAccount from "./components/user-account";
import UserTransactionsList from "./components/user-transactions-list";

const UserPage = () => {
  console.log("[UserPage]:RENDER");
  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "User", url: absoluteUrl("/user") },
      ]}
    >
      <div
        id="userlayout"
        className="w-[98vw] h-[84vh] rounded-sm grid flex-1 items-start gap-2 grid-cols-8"
      >
        <div className="col-span-2 m-1 group relative flex flex-col overflow-hidden rounded-md shadow transition-all duration-200 ease-in-out hover:z-30 space-y-2">
          <PageItemContainer title="user account" border>
            <UserAccount />
          </PageItemContainer>
          {/* <PageItemContainer title="payment" border>
            <UserPayment />
          </PageItemContainer> */}
        </div>
        <div className="col-span-2 m-1 group relative flex flex-col overflow-hidden rounded-md shadow transition-all duration-200 ease-in-out hover:z-30 space-y-2">
          <PageItemContainer title="transactions" border>
            <UserTransactionsList />
          </PageItemContainer>
        </div>
        <div className="col-span-2 m-1 group relative flex flex-col overflow-hidden rounded-md shadow transition-all duration-200 ease-in-out hover:z-30 space-y-2">
          {/* <PageItemContainer title="linked banks" border>
            <BankAccounts />
          </PageItemContainer> */}
        </div>
      </div>
    </PageContent>
  );
};

export default UserPage;
