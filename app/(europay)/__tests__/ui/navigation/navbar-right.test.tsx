import NavbarRight from "@/app/(europay)/ui/navigation/navbar-right";
import { render, screen } from "@testing-library/react";

describe("NavbarRight", () => {
  it("Should render the application info bar", () => {
    render(<NavbarRight />);

    expect(screen.getByTestId("navbarappinfo")).toBeInTheDocument();
  });

  it("Should render the theme toggle", () => {
    render(<NavbarRight />);

    expect(screen.getByTestId("themetoggle")).toBeInTheDocument();
  });

  it("Should render the user profile", () => {
    render(<NavbarRight />);

    expect(screen.getByTestId("navbar-user-profile")).toBeInTheDocument();
  });
});
