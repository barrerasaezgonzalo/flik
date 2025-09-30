// Footer.test.tsx
import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import Footer, { getScrollY } from "./Footer";

describe("Footer scroll button behavior", () => {
  beforeAll(() => {
    window.scrollTo = vi.fn();
  });

  it("getScrollY retorna scrollY cuando está definido", () => {
    Object.defineProperty(window, "scrollY", {
      value: 150,
      writable: true,
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 0,
      writable: true,
    });
    expect(getScrollY()).toBe(150);
  });

  it("getScrollY usa document.documentElement.scrollTop si scrollY es cero", () => {
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 250,
      writable: true,
    });
    expect(getScrollY()).toBe(250);
  });

  it("no muestra el botón al inicio (scrollY pequeño)", () => {
    Object.defineProperty(window, "scrollY", {
      value: 50,
      writable: true,
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 0,
      writable: true,
    });
    render(<Footer />);
    // fuerza el evento scroll
    act(() => {
      fireEvent.scroll(window);
    });
    const btn = screen.queryByRole("button", { name: /volver al inicio/i });
    expect(btn).toBeNull();
  });

  it("muestra el botón cuando scrollY > 200", () => {
    Object.defineProperty(window, "scrollY", {
      value: 300,
      writable: true,
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 0,
      writable: true,
    });
    render(<Footer />);
    act(() => {
      fireEvent.scroll(window);
    });
    const btn = screen.getByRole("button", { name: /volver al inicio/i });
    expect(btn).toBeInTheDocument();
  });

  it("al hacer click llama window.scrollTo con top: 0 y behavior smooth", () => {
    Object.defineProperty(window, "scrollY", {
      value: 300,
      writable: true,
    });
    render(<Footer />);
    act(() => {
      fireEvent.scroll(window);
    });
    const btn = screen.getByRole("button", { name: /volver al inicio/i });
    fireEvent.click(btn);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
