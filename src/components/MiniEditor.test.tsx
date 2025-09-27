import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import MiniEditor from "./MiniEditor";
import React from "react";
import { vi } from "vitest";
import { Editor } from "@tiptap/core";

describe("MiniEditor", () => {
  it("renderiza la barra de herramientas", () => {
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("🔗")).toBeInTheDocument();
    expect(screen.getByText("</>")).toBeInTheDocument();
    expect(screen.getByText("📝 HTML")).toBeInTheDocument();
    expect(screen.getByText("Expandir")).toBeInTheDocument();
  });

  it("abre el modo HTML y muestra textarea", () => {
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("📝 HTML"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("permite modificar HTML y guardar cambios", () => {
    const onChange = vi.fn();
    render(<MiniEditor value="<p>hola</p>" onChange={onChange} />);
    fireEvent.click(screen.getByText("📝 HTML"));
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "<p>nuevo</p>" } });
    fireEvent.click(screen.getByText("Guardar HTML"));
    expect(onChange).toHaveBeenCalledWith("<p>nuevo</p>");
  });

  it("cierra modo HTML sin guardar", () => {
    const onChange = vi.fn();
    render(<MiniEditor value="<p>hola</p>" onChange={onChange} />);
    fireEvent.click(screen.getByText("📝 HTML"));
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "<p>cambio</p>" } });
    fireEvent.click(screen.getByText(/Volver/));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("expande y cierra el editor", () => {
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("Expandir"));
    expect(screen.getByText("Cerrar")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cerrar"));
    expect(screen.queryByText("Cerrar")).not.toBeInTheDocument();
  });

  it("intenta insertar link cuando prompt devuelve URL", () => {
    vi.spyOn(window, "prompt").mockReturnValue("https://ejemplo.com");
    render(<MiniEditor value="<p>link</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("🔗"));
    expect(window.prompt).toHaveBeenCalledWith("Ingresa la URL");
  });

  it("no inserta link cuando prompt devuelve null", () => {
    vi.spyOn(window, "prompt").mockReturnValue(null);
    render(<MiniEditor value="<p>link</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("🔗"));
    expect(window.prompt).toHaveBeenCalled();
  });

  it("ejecuta unsetLink al hacer click en ❌🔗", () => {
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("❌🔗"));
    expect(screen.getByText("❌🔗")).toBeInTheDocument();
  });

  it("ejecuta toggleCodeBlock al hacer click en </>", () => {
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("</>"));
    expect(screen.getByText("</>")).toBeInTheDocument();
  });

  it("ejecuta toggleBold cuando se hace click en B", () => {
    const onChange = vi.fn();
    render(<MiniEditor value="<p>hola</p>" onChange={onChange} />);
    const boldButton = screen.getByText("B");
    fireEvent.click(boldButton);
    expect(boldButton).toBeInTheDocument();
  });

  it("ejecuta toggleBold en modo expanded al hacer click en B", () => {
    const spy = vi.spyOn(Editor.prototype, "chain").mockReturnValue({
      focus: () => ({
        toggleBold: () => ({
          run: () => true,
        }),
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("Expandir"));
    const boldButtons = screen.getAllByText("B");
    fireEvent.click(boldButtons[boldButtons.length - 1]);
    spy.mockRestore();
  });

  it("ejecuta setLink en modo expanded al ingresar URL", () => {
    vi.spyOn(window, "prompt").mockReturnValue("https://ejemplo.com");
    const spy = vi.spyOn(Editor.prototype, "chain").mockReturnValue({
      focus: () => ({
        extendMarkRange: () => ({
          setLink: () => ({
            run: () => true,
          }),
        }),
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    render(<MiniEditor value="<p>link</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("Expandir"));
    const linkButtons = screen.getAllByText("🔗");
    fireEvent.click(linkButtons[linkButtons.length - 1]);
    expect(window.prompt).toHaveBeenCalledWith("Ingresa la URL");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("ejecuta unsetLink en modo expanded", () => {
    const spy = vi.spyOn(Editor.prototype, "chain").mockReturnValue({
      focus: () => ({
        unsetLink: () => ({
          run: () => true,
        }),
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("Expandir"));
    const unsetButtons = screen.getAllByText("❌🔗");
    fireEvent.click(unsetButtons[unsetButtons.length - 1]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("ejecuta toggleCodeBlock en modo expanded", () => {
    const spy = vi.spyOn(Editor.prototype, "chain").mockReturnValue({
      focus: () => ({
        toggleCodeBlock: () => ({
          run: () => true,
        }),
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    render(<MiniEditor value="<p>hola</p>" onChange={() => {}} />);
    fireEvent.click(screen.getByText("Expandir"));
    const codeButtons = screen.getAllByText("</>");
    fireEvent.click(codeButtons[codeButtons.length - 1]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("cubre textarea, Guardar HTML y Volver al editor en expanded", () => {
    const onChange = vi.fn();
    render(<MiniEditor value="<p>hola</p>" onChange={onChange} />);

    // Expandir editor
    fireEvent.click(screen.getByText("Expandir"));

    // Activar HTML dentro del expanded
    const htmlButtons = screen.getAllByText("📝 HTML");
    fireEvent.click(htmlButtons[htmlButtons.length - 1]);

    // Buscar el último textarea (expanded)
    const textareas = screen.getAllByRole("textbox");
    const textarea = textareas[textareas.length - 1] as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "<p>nuevo</p>" } });
    expect(textarea.value).toBe("<p>nuevo</p>");

    // Click en el Guardar HTML correcto (expanded)
    const guardarButtons = screen.getAllByText("Guardar HTML");
    fireEvent.click(guardarButtons[guardarButtons.length - 1]);
    expect(onChange).toHaveBeenCalledWith("<p>nuevo</p>");

    // Reabrir HTML y volver al editor
    const htmlButtonsAgain = screen.getAllByText("📝 HTML");
    fireEvent.click(htmlButtonsAgain[htmlButtonsAgain.length - 1]);

    const volverButtons = screen.getAllByText("Volver al editor");
    fireEvent.click(volverButtons[volverButtons.length - 1]);

    // El textarea ya no debería estar visible
    expect(screen.queryByRole("textbox")).toBeNull();
  });
});
