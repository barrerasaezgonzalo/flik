// privacyPage.test.tsx

import { render, screen } from "@testing-library/react";
import PrivacyPage, { metadata } from "./page";

// Si tu página es `async`, puede que necesites envolver con act o suspender, pero en muchos casos React Testing Library lo maneja bien.

describe("PrivacyPage", () => {
  it("metadata tiene los valores correctos", () => {
    expect(metadata.title).toBe(
      "Política de Privacidad | Blog de tecnología en español",
    );
    expect(metadata.description).toContain("cómo protegemos tu información");
  });

  it("muestra el título principal", async () => {
    render(await PrivacyPage());
    const title = screen.getByRole("heading", {
      name: /Política de Privacidad/i,
    });
    expect(title).toBeInTheDocument();
  });

  it("incluye secciones esperadas", async () => {
    render(await PrivacyPage());

    expect(
      screen.getByText(/Información que recopilamos/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Uso de la información/i)).toBeInTheDocument();
    expect(screen.getByText("Cookies")).toBeInTheDocument();
    expect(screen.getByText("Google AdSense")).toBeInTheDocument();
    expect(screen.getByText(/Seguridad de los datos/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacto/i)).toBeInTheDocument();
  });

  it("muestra la dirección de correo correspondiente", async () => {
    render(await PrivacyPage());
    expect(screen.getByText(/hola@flik\.cl/i)).toBeInTheDocument();
  });
});
