import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import React from "react";

describe("Footer component", () => {
  it("renderiza el logo con alt 'Flik Blog'", () => {
    render(<Footer />);
    const logo = screen.getByAltText("Flik Blog");
    expect(logo).toBeInTheDocument();
  });

  it("muestra el nombre y la descripción", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Blog de tecnología en español/i),
    ).toBeInTheDocument();
  });

  it("renderiza todos los links con href correcto", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /sobre flik/i })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: /privacidad/i })).toHaveAttribute(
      "href",
      "/privacy",
    );
    expect(screen.getByRole("link", { name: /términos/i })).toHaveAttribute(
      "href",
      "/terminos",
    );
    expect(screen.getByRole("link", { name: /contacto/i })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/flikcl/",
    );
    expect(screen.getByRole("link", { name: /mapa/i })).toHaveAttribute(
      "href",
      "/mapa",
    );
  });

  it("muestra el año actual", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${year} Flik`))).toBeInTheDocument();
  });
});
