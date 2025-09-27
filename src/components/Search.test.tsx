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
    render(<Search />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /buscar/i })).toBeInTheDocument();
  });

  it("no navega si el input está vacío", () => {
    render(<Search />);
    const form =
      screen.getByRole("form") || screen.getByRole("button").closest("form")!;
    fireEvent.submit(form);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("navega a la ruta correcta cuando se escribe y se envía", () => {
    render(<Search />);
    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /buscar/i });

    fireEvent.change(input, { target: { value: "nextjs" } });
    fireEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith("/search?q=nextjs");
  });
});
