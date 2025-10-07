// File: components/__tests__/CommentForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { supabase } from "@/lib/supabaseClient";
import CommentForm from "./Comments";
import React from "react";

// ✅ Mock de Supabase
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({
            data: {
              id: 1,
              email: "test@test.com",
              content: "Hola",
              date: new Date().toISOString(),
            },
            error: null,
          }),
      })),
      select: vi.fn(() => ({
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    })),
  },
}));

describe("CommentForm", () => {
  it("muestra los inputs y valida errores", async () => {
    render(<CommentForm postId="123" />);

    // 1️⃣ Inputs visibles
    const emailInput = screen.getByPlaceholderText("tu@correo.com");
    const bodyInput = screen.getByPlaceholderText("¿Qué te pareció?");
    const submitBtn = screen.getByRole("button", {
      name: /enviar comentario/i,
    });

    expect(emailInput).toBeInTheDocument();
    expect(bodyInput).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();

    // 2️⃣ Escribir email inválido y cuerpo vacío
    fireEvent.change(emailInput, { target: { value: "invalido" } });
    fireEvent.change(bodyInput, { target: { value: "" } });

    // El botón sigue deshabilitado
    expect(submitBtn).toBeDisabled();

    // 3️⃣ Escribir email válido y comentario válido
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(bodyInput, { target: { value: "Este es un comentario" } });

    // Esperamos que se habilite
    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    // 4️⃣ Enviar comentario
    fireEvent.click(submitBtn);

    // Esperamos que el mensaje de éxito aparezca
    await waitFor(() => {
      expect(
        screen.getByText(/¡Gracias! Tu comentario quedó enviado./i),
      ).toBeInTheDocument();
    });

    // 5️⃣ Verificamos que Supabase insert fue llamado
    expect(supabase.from).toHaveBeenCalledWith("comments");
  });
});
