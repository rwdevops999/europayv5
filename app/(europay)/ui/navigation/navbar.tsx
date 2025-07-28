import NavbarCenter from "./navbar-center";
import NavbarLeft from "./navbar-left";
import NavbarRight from "./navbar-right";

const Navbar = () => {
  return (
    <div data-testid="navbar" className="navbar justify-between">
      <NavbarLeft />
      <NavbarCenter />
      <NavbarRight />
    </div>
  );
};

export default Navbar;
