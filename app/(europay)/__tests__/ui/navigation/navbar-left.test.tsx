import NavbarLeft from "@/app/(europay)/ui/navigation/navbar-left";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));

describe("NavbarLeft", () => {
  it("Should render the logo", () => {
    render(<NavbarLeft />);

    expect(screen.getByTestId("europay-logo")).toBeInTheDocument();
  });
});
