import { render } from "@testing-library/react";
import Header from "./Header";
import { vi } from "vitest";
import React from "react";

// Mock de Search para no complicar el snapshot con su contenido
vi.mock("./Search", () => ({
  default: () => <div data-testid="mock-search" />,
}));

describe("Header snapshots", () => {
  it("match snapshot render", () => {
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });
});
