import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import EuropayHome from "../page";

describe("EuropayHome", () => {
  it("renders a navbar", () => {
    render(<EuropayHome />);
  });
});
