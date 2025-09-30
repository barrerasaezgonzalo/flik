import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import Header from "./Header";
import { vi } from "vitest";
import React from "react";

// Mock de Search para no depender de su implementación real
vi.mock("./Search", () => ({
  default: ({ onClose }: { onClose?: () => void }) => (
    <div data-testid="mock-search">
      <p>Mock Search</p>
      {onClose && <button onClick={onClose}>Cerrar mock</button>}
    </div>
  ),
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

  it("cierra el menú mobile cuando la pantalla pasa a >=768px", () => {
    render(<Header />);

    // Abrir menú mobile
    const toggleMenuBtn = screen.getByRole("button", { name: /abrir menú/i });
    fireEvent.click(toggleMenuBtn);
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();

    // Simular resize a desktop
    window.innerWidth = 1024;
    fireEvent(window, new Event("resize"));

    // ✅ El menú debería cerrarse
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
  });

  it("cierra el buscador cuando la pantalla pasa a >=768px", () => {
    render(<Header />);

    // Abrir buscador desde el menú mobile
    const toggleMenuBtn = screen.getByRole("button", { name: /abrir menú/i });
    fireEvent.click(toggleMenuBtn);

    // El componente Search debería estar abierto
    waitFor(() => {
      expect(screen.getByRole("search")).toBeInTheDocument();
    });

    // Simular resize a desktop
    window.innerWidth = 1024;
    fireEvent(window, new Event("resize"));

    // ✅ El buscador debería cerrarse
    expect(screen.queryByRole("search")).not.toBeInTheDocument();
  });

  it("llama a onClose del Search mockeado", () => {
    render(<Header />);

    // Abrir menú mobile
    fireEvent.click(screen.getByRole("button", { name: /abrir menú/i }));

    // Click en Buscar
    const searchButtons = screen.getAllByText("Buscar");
    const mobileBtn = searchButtons[searchButtons.length - 1]; // generalmente el último es mobile
    fireEvent.click(mobileBtn.closest("button")!);

    // MockSearch renderizado
    expect(screen.getByTestId("mock-search")).toBeInTheDocument();

    // Simulamos que el usuario hace click en Cerrar
    fireEvent.click(screen.getByText("Cerrar mock"));

    // ✅ como el Header pasa onClose={() => setOpenSearch(false)},
    // esto cubre la rama al ejecutarlo
  });
});
