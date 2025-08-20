import { uploadTemplates } from "@/app/server/templates";
import Loaded from "./loaded";
import { Suspense } from "react";
import LoadingSpinner from "@/ui/loading-spinner";

const TemplateLoader = async () => {
  await uploadTemplates(process.env.NEXT_PUBLIC_TEMPLATE_FILE);

  return null;
};

const TemplateLoaderWithSuspense = ({ _loaded }: { _loaded: boolean }) => {
  if (_loaded) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingSpinner label="Initialising..." />}>
      <TemplateLoader />
    </Suspense>
  );
};

export default TemplateLoaderWithSuspense;
