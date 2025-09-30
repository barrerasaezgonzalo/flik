import { render, screen, fireEvent } from "@testing-library/react";
import Search from "./Search";
import { vi } from "vitest";
import { useRouter } from "next/navigation";
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

  it("limpia la búsqueda al hacer click en el botón Limpiar", () => {
    render(<Search openSearch={true} onClose={() => {}} />);

    const input = screen.getByRole("textbox");

    // Simulamos escribir algo
    fireEvent.change(input, { target: { value: "React" } });
    expect(input).toHaveValue("React");

    // Aparece el botón de limpiar
    const clearBtn = screen.getByRole("button", { name: /limpiar búsqueda/i });
    fireEvent.click(clearBtn);

    // ✅ Input vacío después del click
    expect(input).toHaveValue("");
  });

  it("ejecuta router.push  al enviar con query", () => {
    const handleClose = vi.fn();
    const router = useRouter();

    render(<Search openSearch={true} onClose={handleClose} />);

    const input = screen.getByRole("textbox");

    // Escribimos algo en el input
    fireEvent.change(input, { target: { value: "react" } });
    expect(input).toHaveValue("react");

    // Enviamos el formulario
    fireEvent.submit(screen.getByRole("form"));

    // ✅ router.push llamado con la query
    expect(router.push).toHaveBeenCalledWith("/search?q=react");
  });
});
