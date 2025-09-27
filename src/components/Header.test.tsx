import { fireEvent, render, screen, within } from "@testing-library/react";
import Header from "./Header";
import { vi } from "vitest";
import React from "react";

// Mock de Search para no depender de su implementación real
vi.mock("./Search", () => ({
  default: () => <div data-testid="mock-search" />,
}));

vi.mock("next/link", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
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

  it("muestra el menú mobile al abrir el toggle", () => {
    render(<Header />);
    const toggleBtn = screen.getByRole("button", { name: /abrir menú/i });
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });

  it.each(["Posts", "Sobre Flik", "Categorías", "Contacto"])(
    "cierra el menú al hacer click en %s",
    (linkText) => {
      render(<Header />);

      // Abro el menú con el botón hamburguesa
      const toggleBtn = screen.getByRole("button", { name: /abrir menú/i });
      fireEvent.click(toggleBtn);

      // Verifico que el menú está abierto
      const mobileMenu = screen.getByTestId("mobile-menu");
      expect(mobileMenu).toBeInTheDocument();

      // Busco el link específico dentro del menú mobile
      const link = within(mobileMenu).getByText(linkText);

      // Click en el link → dispara setOpen(false)
      fireEvent.click(link);

      // Verifico que el menú se cerró
      expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
    },
  );
});
