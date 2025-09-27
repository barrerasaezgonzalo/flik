import { render, screen, fireEvent } from "@testing-library/react";
import Search from "./Search";
import { vi } from "vitest";
import React from "react";

// mock de useRouter de next/navigation
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("Search component", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("renderiza input y botón", () => {
    render(<Search openSearch={false} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("no navega si el input está vacío", () => {
    render(<Search openSearch={false} />);
    const form =
      screen.getByRole("form") || screen.getByRole("button").closest("form")!;
    fireEvent.submit(form);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("navega a la ruta correcta cuando se escribe y se presiona Enter", () => {
    render(<Search openSearch={true} />);

    const input = screen.getByRole("textbox");

    // Escribir "nextjs"
    fireEvent.change(input, { target: { value: "nextjs" } });

    // Simular enviar el formulario (Enter)
    fireEvent.submit(input.closest("form")!);

    expect(pushMock).toHaveBeenCalledWith("/search?q=nextjs");
  });
});
