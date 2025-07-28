import Navbar from "@/app/(europay)/ui/navigation/navbar";
import Providers from "@/app/providers";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => jest.requireActual("next-router-mock"));

describe("Navbar", () => {
  beforeEach(() => {
    render(
      <Providers>
        <Navbar />
      </Providers>
    );
  });

  it("Should render the Navbar", () => {
    render(<Navbar />);

    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeInTheDocument();
  });

  it("Should contain the left navbar", () => {
    render(<Navbar />);

    const navbarLeft = screen.getByTestId("navbarleft");
    expect(navbarLeft).toBeInTheDocument();
  });
});
