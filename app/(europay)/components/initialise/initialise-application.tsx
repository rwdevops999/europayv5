import RenderApply from "../apply/render-apply";
import ProcessSettings from "./process-settings";
import RenderBackground from "./render-background";

const InitialiseApplication = async () => {
  return (
    <>
      <RenderBackground />
      <RenderApply />
    </>
  );
};

export default InitialiseApplication;
