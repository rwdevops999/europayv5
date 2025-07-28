import clsx from "clsx";
import NavbarAppInfo from "./components/navbar-appinfo";

const renderDevItems: boolean = process.env.NODE_ENV === "development";

const NavbarRight = () => {
  return (
    <div data-testid="navbarright" className="flex items-center space-x-2">
      <NavbarAppInfo
        className={clsx(
          "grid",
          { "grid-cols-8": renderDevItems },
          { "grid-cols-4": !renderDevItems }
        )}
      >
        {renderDevItems && <></>}
      </NavbarAppInfo>
    </div>
  );
};

export default NavbarRight;
