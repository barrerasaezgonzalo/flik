import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "./page";
import "@testing-library/jest-dom";
import React from "react";

describe("About Page", () => {
  it("renders the about page with correct title and content", () => {
    render(<AboutPage />);

    // Check main heading
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Sobre Flik");
    expect(screen.getByText(/hola@flik.cl/i)).toBeInTheDocument();

    // Check for the image with specific alt text
    const image = screen.getByAltText(/Ayúdamos a crecer/i);
    expect(image).toBeInTheDocument();

    // Check for the LinkedIn share link
    const linkedinLink = screen.getByRole("link", {
      name: /ayúdamos a crecer/i,
    });
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/sharing/share-offsite/?url=https://flik.cl",
    );
    expect(linkedinLink).toHaveAttribute("target", "_blank");
  });

  it("has the correct metadata", async () => {
    const { metadata } = await import("./page");

    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("Sobre Flik | Blog de tecnología en español");
    expect(metadata.description).toContain("Conoce la historia de Flik");
  });
});
