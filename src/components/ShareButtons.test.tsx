import { render, screen } from "@testing-library/react";
import React from "react";
import { ShareButtons } from "./ShareButtons";

describe("ShareButtons", () => {
  const post = { slug: "mi-post", title: "Mi post increíble", id: "123" };
  const baseUrl = `https://flik.cl/posts/${post.slug}`;

  it("muestra el mensaje principal", () => {
    render(<ShareButtons post={post} />);
    expect(
      screen.getByText(/¿Te gustó este artículo\? ¡Compártelo!/i),
    ).toBeInTheDocument();
  });

  it("genera correctamente el enlace de LinkedIn", () => {
    render(<ShareButtons post={post} />);
    const link = screen.getByText("LinkedIn").closest("a");
    expect(link).toHaveAttribute(
      "href",
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl)}`,
    );
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("genera correctamente el enlace de X (Twitter)", () => {
    render(<ShareButtons post={post} />);
    const link = screen.getByText("X").closest("a");
    expect(link).toHaveAttribute(
      "href",
      `https://x.com/intent/tweet?url=${encodeURIComponent(baseUrl)}&text=${encodeURIComponent("Échale un vistazo a este artículo de Flik!")}`,
    );
  });

  it("genera correctamente el enlace de WhatsApp", () => {
    render(<ShareButtons post={post} />);
    const link = screen.getByText("WhatsApp").closest("a");
    expect(link).toHaveAttribute(
      "href",
      `https://api.whatsapp.com/send?text=${encodeURIComponent("Échale un vistazo a este artículo de Flik! " + baseUrl)}`,
    );
  });

  it("genera correctamente el enlace de Telegram", () => {
    render(<ShareButtons post={post} />);
    const link = screen.getByText("Telegram").closest("a");
    expect(link).toHaveAttribute(
      "href",
      `https://t.me/share/url?url=${encodeURIComponent(baseUrl)}&text=${encodeURIComponent("Échale un vistazo a este artículo de Flik!")}`,
    );
  });
});
