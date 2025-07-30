// import { ToastContainer } from "react-toastify";
// import Footer from "./components/footer/footer";
// import Navbar from "./components/navbar/navbar";

import { ToastContainer } from "react-toastify";
import Navbar from "./ui/navigation/navbar";

interface EuropayLayoutProps {
  children: React.ReactNode;
}

const dynamicHeight = "calc(100vh - 90px)";

const EuropayLayout = ({ children }: EuropayLayoutProps) => {
  return (
    <div data-wrapper="" className="border-border/40 dark:border-border">
      <div className="mx-auto w-full border-border/40 dark:border-border min-[2000px]:max-w-[1536px] min-[2000px]:border-x">
        <div className="flex-1">
          <div className="h-screen">
            <Navbar />
            <div style={{ height: dynamicHeight }}>{children}</div>
            {/* <Footer /> */}
            <ToastContainer newestOnTop />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EuropayLayout;
