// TerminosPage.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TerminosPage, { metadata } from "./page";

describe("TerminosPage", () => {
  it("metadata tiene título y descripción correctos", () => {
    expect(metadata.title).toBe(
      "Términos y Condiciones | Blog de tecnología en español",
    );
    expect(metadata.description).toContain("términos y condiciones de uso");
  });

  it("muestra el título principal", () => {
    render(<TerminosPage />);
    const title = screen.getByRole("heading", {
      name: /Términos y condicione/i,
    });
    expect(title).toBeInTheDocument();
  });

  it("muestra secciones esperadas", () => {
    render(<TerminosPage />);
    waitFor(() => {
      expect(screen.getByText(/Propiedad intelectual/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Responsabilidad del contenido/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Enlaces a terceros/i)).toBeInTheDocument();
      expect(screen.getByText(/Modificaciones/i)).toBeInTheDocument();
      expect(screen.getByText(/Contacto/i)).toBeInTheDocument();
    });
  });

  it("incluye el correo de contacto", () => {
    render(<TerminosPage />);
    expect(screen.getByText(/hola@flik\.cl/i)).toBeInTheDocument();
  });
});
