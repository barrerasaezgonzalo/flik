// MiniEditor.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom"; // Para matchers como toHaveValue
import React from "react";
// Importa el componente que vamos a probar
import MiniEditor from "./MiniEditor";

// --------------------------------------------------------------------------
// MOCK del componente TinyMCE Editor
// Esta es la parte más importante y a menudo la que causa problemas.
// Queremos reemplazar el componente real de TinyMCE con algo muy simple
// que podemos controlar y testear.
// --------------------------------------------------------------------------
const TinyMCEEditorMock = vi.fn((props: any) => {
  // En lugar de renderizar el complejo editor de TinyMCE,
  // renderizamos un simple textarea que nos permitirá:
  // 1. Verificar si fue renderizado.
  // 2. Simular cambios en su valor para probar onEditorChange.
  return (
    <textarea
      data-testid="mock-tinymce-editor" // Usaremos este ID para encontrarlo en los tests
      value={props.value}
      onChange={(e) => props.onEditorChange(e.target.value)} // Llama al onEditorChange prop de TinyMCE
      // Podemos ignorar otras props como apiKey, init, onInit para este test simple
    />
  );
});

// Ahora, le decimos a Vitest/Jest que cada vez que `MiniEditor` intente
// importar 'Editor' de '@tinymce/tinymce-react', use nuestro `TinyMCEEditorMock` en su lugar.
vi.mock("@tinymce/tinymce-react", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tinymce/tinymce-react")>();
  return {
    ...actual, // Mantén todas las exportaciones originales por si alguna se usa, aunque es poco probable para un mock simple
    Editor: TinyMCEEditorMock, // Reemplaza la exportación 'Editor'
  };
});

describe("MiniEditor - Basic Functionality", () => {
  // Limpiamos el mock antes de cada test para asegurar que cada test es independiente
  beforeEach(() => {
    TinyMCEEditorMock.mockClear();
  });

  it("renders the TinyMCE mock editor", () => {
    const handleChange = vi.fn();
    render(<MiniEditor value="Initial content" onChange={handleChange} />);

    // Verificamos que nuestro mock fue renderizado
    waitFor(() => {
      expect(TinyMCEEditorMock).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("mock-tinymce-editor")).toBeInTheDocument();
    });
  });

  it("displays the initial value passed to it", () => {
    const handleChange = vi.fn();
    const initialContent = "<p>Hello world!</p>";
    render(<MiniEditor value={initialContent} onChange={handleChange} />);
    waitFor(() => {
      // Verificamos que el textarea mock tiene el valor inicial
      expect(screen.getByTestId("mock-tinymce-editor")).toHaveValue(
        initialContent,
      );
    });
  });
});
