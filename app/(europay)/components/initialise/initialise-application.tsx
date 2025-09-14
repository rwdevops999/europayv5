import RenderApply from "../apply/render-apply";
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
