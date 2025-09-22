import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { vi } from "vitest";
import React from "react";

// Mock de Search para no depender de su implementación real
vi.mock("./Search", () => ({
  default: () => <div data-testid="mock-search" />,
}));

describe("Header component", () => {
  it("renderiza el logo con alt 'Flik Blog'", () => {
    render(<Header />);
    const logo = screen.getByAltText("Flik Blog");
    expect(logo).toBeInTheDocument();
  });

  it("renderiza los links de navegación", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /posts/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: /sobre flik/i })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: /categorías/i })).toHaveAttribute(
      "href",
      "/mapa?modo=categorias",
    );
    expect(screen.getByRole("link", { name: /contacto/i })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("incluye el componente Search", () => {
    render(<Header />);
    expect(screen.getByTestId("mock-search")).toBeInTheDocument();
  });
});
