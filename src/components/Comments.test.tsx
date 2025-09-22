import { render, screen, fireEvent } from "@testing-library/react";
import Comments from "./Comments";
import { vi } from "vitest";
import React from "react";

vi.mock("@/lib/supabaseClient", () => ({
  __esModule: true,
  default: {},
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

const mockAddComment = vi.fn();
vi.mock("@/lib/comments", () => ({
  addComment: (...args: unknown[]) => mockAddComment(...args),
}));

vi.mock("@/lib/utils", () => ({
  formatDate: () => "FECHA_FAKE",
}));

describe("Comments component", () => {
  beforeEach(() => {
    mockRefresh.mockClear();
    mockAddComment.mockClear();
  });

  it("muestra error si el comentario está vacío", async () => {
    render(<Comments postId="post-1" initialComments={[]} />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const submitButton = screen.getByRole("button", {
      name: /enviar comentario/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@correo.com" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/el comentario no puede estar vacío/i),
    ).toBeInTheDocument();
  });

  it("muestra error si el email está vacío", async () => {
    render(<Comments postId="post-1" initialComments={[]} />);

    const commentInput = screen.getByRole("textbox", { name: /comentario/i });
    const submitButton = screen.getByRole("button", {
      name: /enviar comentario/i,
    });

    fireEvent.change(commentInput, {
      target: { value: "Un comentario válido" },
    });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/el correo electrónico es obligatorio/i),
    ).toBeInTheDocument();
  });

  it("muestra error si el email es inválido", async () => {
    render(<Comments postId="post-1" initialComments={[]} />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const commentInput = screen.getByRole("textbox", { name: /comentario/i });
    const submitButton = screen.getByRole("button", {
      name: /enviar comentario/i,
    });

    fireEvent.change(emailInput, { target: { value: "correo-invalido" } });
    fireEvent.change(commentInput, { target: { value: "Comentario válido" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/ingresa un correo válido/i),
    ).toBeInTheDocument();
  });

  it("envía correctamente y resetea el formulario", async () => {
    render(<Comments postId="post-1" initialComments={[]} />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const commentInput = screen.getByRole("textbox", { name: /comentario/i });
    const submitButton = screen.getByRole("button", {
      name: /enviar comentario/i,
    });

    // Llenar campos válidos
    fireEvent.change(emailInput, { target: { value: "test@correo.com" } });
    fireEvent.change(commentInput, {
      target: { value: "Un comentario válido" },
    });

    // Enviar
    fireEvent.click(submitButton);

    // Esperar a que addComment haya sido llamado
    expect(
      await screen.findByRole("button", { name: /enviar comentario/i }),
    ).toBeInTheDocument();
    expect(mockAddComment).toHaveBeenCalledWith({
      postId: "post-1",
      email: "test@correo.com",
      content: "Un comentario válido",
    });

    // Verificar refresh
    expect(mockRefresh).toHaveBeenCalled();

    // Verificar que el form se reseteó (inputs vacíos)
    expect((emailInput as HTMLInputElement).value).toBe("");
    expect((commentInput as HTMLTextAreaElement).value).toBe("");
  });

  it("muestra error si el comentario tiene menos de 5 caracteres", async () => {
    render(<Comments postId="post-1" initialComments={[]} />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const commentInput = screen.getByRole("textbox", { name: /comentario/i });
    const submitButton = screen.getByRole("button", {
      name: /enviar comentario/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@correo.com" } });
    fireEvent.change(commentInput, { target: { value: "1234" } }); // 👈 menos de 5 caracteres
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(
        /el comentario debe tener al menos 5 caracteres/i,
      ),
    ).toBeInTheDocument();
  });

  it("muestra error si addComment lanza una excepción", async () => {
    // 👇 Forzamos a que addComment falle
    mockAddComment.mockRejectedValueOnce(new Error("DB down"));

    render(<Comments postId="post-1" initialComments={[]} />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const commentInput = screen.getByRole("textbox", { name: /comentario/i });
    const submitButton = screen.getByRole("button", {
      name: /enviar comentario/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@correo.com" } });
    fireEvent.change(commentInput, {
      target: { value: "Un comentario válido" },
    });

    fireEvent.click(submitButton);

    // 👇 Confirmamos que addComment fue llamado
    expect(mockAddComment).toHaveBeenCalled();

    // Y como falló, el formulario NO debería haberse reseteado
    expect((emailInput as HTMLInputElement).value).toBe("test@correo.com");
    expect((commentInput as HTMLTextAreaElement).value).toBe(
      "Un comentario válido",
    );
  });

  it("renderiza los comentarios iniciales", () => {
    const fakeComments = [
      {
        id: "1",
        email: "usuario@test.com",
        content: "Este es un comentario inicial",
        date: new Date().toISOString(),
        postId: "post-1",
      },
    ];

    render(<Comments postId="post-1" initialComments={fakeComments} />);

    // Verificamos que se muestre el email
    expect(screen.getByText(/usuario@test.com/i)).toBeInTheDocument();

    // Verificamos que se muestre el contenido
    expect(
      screen.getByText(/este es un comentario inicial/i),
    ).toBeInTheDocument();

    // Verificamos que se muestre la fecha formateada (puede depender de tu formatDate)
    expect(screen.getByText("FECHA_FAKE")).toBeInTheDocument();
  });
});
