import { absoluteUrl, cn } from "../util";

test("testing absolute url from .env", () => {
  expect(absoluteUrl("/test")).toBe("http://localhost:3000/test");
});

test("testing absolute url without .env", () => {
  expect(absoluteUrl("/test", false)).toBe("http://localhost:3000/test");
});

test("testing simple cn", () => {
  expect(cn("border-1", "border-red-500")).toBe("border-1 border-red-500");
});

test("testing conditional cn (with true value)", () => {
  const value: boolean = true;

  expect(
    cn("border-1", { "border-red-500": value }, { "border-green-500": !value })
  ).toBe("border-1 border-red-500");
});

test("testing conditional cn (with false value)", () => {
  const value: boolean = false;

  expect(
    cn("border-1", { "border-red-500": value }, { "border-green-500": !value })
  ).toBe("border-1 border-green-500");
});
