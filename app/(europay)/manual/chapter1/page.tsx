import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";

const Chapter1 = () => {
  return (
    <PageContent
      data-testid="europay-tests"
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Manual", url: absoluteUrl("/manual") },
        { name: "Chapter1", url: absoluteUrl("/manual/chapter1") },
      ]}
    >
      CHAPTER 1
    </PageContent>
  );
};

export default Chapter1;
