import NavbarCenter from "./navbar-center";
import NavbarLeft from "./navbar-left";
import NavbarRight from "./navbar-right";

const Navbar = () => {
  return (
    <div className="navbar justify-between">
      <NavbarLeft />
      <NavbarCenter />
      <NavbarRight />
    </div>
  );
};

export default Navbar;
