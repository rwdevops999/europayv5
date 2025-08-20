import { absoluteUrl } from "@/lib/util";
import Chapter from "@/ui/chapter";
import ChapterContainer from "@/ui/chapter-container";
import PageContent from "@/ui/page-content";
import Intro from "./chapter1/intro";

const ManualPages = () => {
  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Manual", url: absoluteUrl("/manual") },
      ]}
    >
      <div
        data-testid="manual"
        className="rounded-sm grid items-start gap-1 grid-cols-6"
      >
        <ChapterContainer title="chapter1: starting up" border>
          <Chapter>
            <Intro href={absoluteUrl("/manual/chapter1")} />
          </Chapter>
        </ChapterContainer>

        {/* <div className="border-1 border-red-500">COL2</div>
        <div className="border-1 border-red-500">COL3</div>
        <div className="border-1 border-red-500">COL4</div>
        <div className="border-1 border-red-500">COL5</div>
        <div className="border-1 border-red-500">COL6</div> */}
      </div>
    </PageContent>
  );
};

export default ManualPages;
