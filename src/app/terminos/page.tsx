export const metadata = {
  title: "Términos y Condiciones | Blog de tecnología en español",
  description:
    "Consulta los términos y condiciones de uso de Flik, un blog de tecnología en español.",
};

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto prose prose-lg">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
        Términos y condicione
      </h1>
      <p className="mb-4">
        Bienvenido a <strong>Flik</strong>. Al acceder y utilizar este sitio web
        aceptas cumplir con los presentes términos y condiciones de uso. Si no
        estás de acuerdo con alguno de estos términos, te recomendamos no
        utilizar el sitio.
      </p>
      <h2>2. Propiedad intelectual</h2>
      <p className="mb-4">
        Los textos, imágenes, logotipos y demás elementos publicados en este
        sitio son propiedad de Flik o de sus respectivos autores. El uso no
        autorizado de este material podrá ser considerado una infracción a los
        derechos de propiedad intelectual.
      </p>
      <h2>3. Responsabilidad del contenido</h2>
      <p className="mb-4">
        Flik no se hace responsable de los posibles errores, omisiones o
        desactualización del contenido. La información publicada puede contener
        opiniones personales que no deben ser consideradas asesoramiento
        profesional. El uso que hagas de la información del sitio es bajo tu
        propia responsabilidad.
      </p>{" "}
      <h2>4. Enlaces a terceros</h2>
      <p className="mb-4">
        Este sitio puede incluir enlaces externos a otros sitios web. Flik no
        tiene control sobre el contenido o las políticas de privacidad de esos
        sitios y no asume responsabilidad alguna por ellos.
      </p>
      <h2>5. Modificaciones</h2>
      <p className="mb-4">
        Flik se reserva el derecho de modificar estos términos y condiciones en
        cualquier momento, sin necesidad de aviso previo. Se recomienda revisar
        periódicamente esta página para mantenerse informado sobre los cambios.
      </p>
      <h2>6. Contacto</h2>
      <p className="mb-4">
        Para cualquier consulta relacionada con estos términos y condiciones,
        puedes escribir a <span className="text-green-600">hola@flik.cl</span>.
      </p>
    </div>
  );
}
