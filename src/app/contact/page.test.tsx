import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContactoPage from "./page";
import React from "react";

describe("Contacto Page", () => {
  it("renders the contact page with title and content", () => {
    render(<ContactoPage />);

    // Check main heading
    expect(
      screen.getByRole("heading", { level: 1, name: "Contacto" }),
    ).toBeInTheDocument();

    // Check description text
    expect(screen.getByText(/¡Hola! Gracias por visitar/i)).toBeInTheDocument();

    // Check for Flik in the greeting (there should be exactly one instance)
    const flikElements = screen.getAllByText(/Flik/);
    expect(flikElements.length).toBeGreaterThan(0);

    // Verify the greeting contains Flik
    const greetingElement = screen.getByText(/¡Hola! Gracias por visitar/);
    expect(greetingElement.textContent).toContain("Flik");

    // Check that contact information is present
    expect(
      screen.getByText(/dudas|sugerencias|colaborar|saludar/i),
    ).toBeInTheDocument();
  });

  it("displays the blog purpose and mission", () => {
    render(<ContactoPage />);

    expect(
      screen.getByText(/compartir experiencias reales/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/mundo de la tecnología/i)).toBeInTheDocument();
    expect(screen.getByText(/desarrollo de software/i)).toBeInTheDocument();
  });

  it("shows contact methods and email", () => {
    render(<ContactoPage />);

    // Check for email contact
    expect(screen.getByText(/escribirme directamente/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /hola@flik.cl/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /hola@flik.cl/i })).toHaveAttribute(
      "href",
      "mailto:hola@flik.cl",
    );
  });

  it("includes community message and call to action", () => {
    render(<ContactoPage />);

    expect(screen.getByText(/Gracias por ser parte/i)).toBeInTheDocument();
    expect(screen.getByText(/comunidad tecnológica/i)).toBeInTheDocument();
  });

  it("renders the advertisement section", () => {
    render(<ContactoPage />);

    // Check for the ad image
    const adImage = screen.getByAltText(/¿Quieres colabrar o proponer un tema/);
    expect(adImage).toBeInTheDocument();
    expect(adImage).toHaveAttribute("src", "/ads/publica.png");
  });

  it("has proper semantic structure", () => {
    render(<ContactoPage />);

    // Check that the main container div is present with correct classes
    const mainContainer = screen.getByText(/Contacto/).closest("div");
    expect(mainContainer).toHaveClass(
      "max-w-4xl",
      "mx-auto",
      "prose",
      "prose-lg",
    );

    // Check that the heading has the expected classes
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass(
      "text-4xl",
      "font-bold",
      "text-gray-900",
      "mb-8",
      "border-b",
      "pb-4",
    );
  });
});
