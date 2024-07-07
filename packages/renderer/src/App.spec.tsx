import { render, screen } from "@testing-library/react";
import { expect, test } from "bun:test";
import App from "./App";

test("the component renders", () => {
  render(<App />);

  expect(screen.getByText("Hello world!")).toBeVisible();
});
